import React, { useCallback, useEffect, useMemo, useState } from "react";
import DashboardLayout, { type ItemNav } from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import MarcarEnTransitoModal from "./MarcarEnTransitoModal";
import ConfirmarEntregaModal from "./ConfirmarEntrega";
import PanelPerfil from "./PanelPerfil";
import {
  asignacionesService,
  dashboardService,
  donacionesService,
  type AsignacionVista,
  type EstadoDonacion,
  type MetricasTransportista,
} from "../lib/sistratec";
import { getCurrentUser } from "../lib/session";
import { mensajeDeError } from "../lib/api";

const variantePorEstado: Record<EstadoDonacion, "recibido" | "en_transito" | "entregado"> = {
  recibido: "recibido",
  en_transito: "en_transito",
  entregado: "entregado",
};

const PackageIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.27 6.96 12 12.01l8.73-5.05" />
    <path d="M12 22.08V12" />
  </svg>
);

const TruckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ITEMS_NAV: ItemNav[] = [
  { clave: "asignaciones", etiqueta: "Mis asignaciones", icono: <PackageIcon /> },
  { clave: "perfil", etiqueta: "Mi perfil", icono: <UserIcon /> },
];

const TransportistaDashboard: React.FC = () => {
  const usuario = getCurrentUser();
  const [seccion, setSeccion] = useState("asignaciones");
  const [asignaciones, setAsignaciones] = useState<AsignacionVista[]>([]);
  const [metricas, setMetricas] = useState<MetricasTransportista | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set());

  const [modalTransito, setModalTransito] = useState<AsignacionVista[] | null>(null);
  const [modalEntrega, setModalEntrega] = useState<AsignacionVista | null>(null);
  const [accionEnviando, setAccionEnviando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [lista, met] = await Promise.all([
        asignacionesService.mias(),
        dashboardService.metricasTransportista(),
      ]);
      setAsignaciones(lista);
      setMetricas(met);
      setSeleccion(new Set());
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const pendientesSalida = useMemo(
    () => asignaciones.filter((a) => a.estado === "recibido"),
    [asignaciones]
  );

  const alternarSeleccion = (id: string) => {
    setSeleccion((previo) => {
      const copia = new Set(previo);
      if (copia.has(id)) copia.delete(id);
      else copia.add(id);
      return copia;
    });
  };

  const alternarTodas = () => {
    if (seleccion.size === pendientesSalida.length) setSeleccion(new Set());
    else setSeleccion(new Set(pendientesSalida.map((a) => a.donationId)));
  };

  const confirmarTransito = async () => {
    if (!modalTransito) return;
    setAccionEnviando(true);
    try {
      await Promise.all(modalTransito.map((a) => donacionesService.marcarEnTransito(a.donationId)));
      setModalTransito(null);
      setAccionEnviando(false);
      await cargar();
    } catch (err) {
      setModalTransito(null);
      setAccionEnviando(false);
      setError(mensajeDeError(err));
    }
  };

  const confirmarEntrega = async () => {
    if (!modalEntrega) return;
    setAccionEnviando(true);
    try {
      await donacionesService.confirmarEntrega(modalEntrega.donationId);
      setModalEntrega(null);
      setAccionEnviando(false);
      await cargar();
    } catch (err) {
      setModalEntrega(null);
      setAccionEnviando(false);
      setError(mensajeDeError(err));
    }
  };

  const idsSeleccionados = Array.from(seleccion);
  const asignacionesSeleccionadas = pendientesSalida.filter((a) => seleccion.has(a.donationId));

  return (
    <DashboardLayout
      usuario={usuario}
      items={ITEMS_NAV}
      activo={seccion}
      onSeleccionar={setSeccion}
      titulo={seccion === "perfil" ? "Mi perfil" : `Hola, ${usuario?.fullName?.split(" ")[0] || "transportista"}`}
      subtitulo={seccion === "perfil" ? "Actualiza tus datos personales y contraseña." : "Estas son las donaciones que tienes asignadas para transportar."}
    >
      {seccion === "perfil" ? (
        <PanelPerfil mostrarVehiculo />
      ) : (
      <>
      <div style={styles.cards}>
        <StatCard label="Pendientes de salida" value={metricas?.pendientes ?? 0} icon={<PackageIcon />} accent="#00d4f5" />
        <StatCard label="En tránsito" value={metricas?.enTransito ?? 0} icon={<TruckIcon />} accent="#b9770e" />
        <StatCard label="Entregadas" value={metricas?.entregados ?? 0} icon={<CheckIcon />} accent="#16a34a" />
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.panel}>
        <div style={styles.panelHeader}>
          <h2 style={styles.panelTitle}>Mis asignaciones</h2>
          {pendientesSalida.length > 0 && (
            <button
              style={{ ...styles.bulkBtn, ...(idsSeleccionados.length === 0 ? styles.bulkBtnDisabled : {}) }}
              disabled={idsSeleccionados.length === 0}
              onClick={() => setModalTransito(asignacionesSeleccionadas)}
            >
              Marcar seleccionadas en tránsito ({idsSeleccionados.length})
            </button>
          )}
        </div>

        {cargando ? (
          <p style={styles.vacio}>Cargando asignaciones...</p>
        ) : asignaciones.length === 0 ? (
          <p style={styles.vacio}>Todavía no tienes donaciones asignadas. Cuando un administrador te asigne una, aparecerá aquí.</p>
        ) : (
          <div style={styles.tablaWrap}>
            <table style={styles.tabla}>
              <thead>
                <tr>
                  <th style={styles.th}>
                    <input
                      type="checkbox"
                      checked={pendientesSalida.length > 0 && seleccion.size === pendientesSalida.length}
                      onChange={alternarTodas}
                      aria-label="Seleccionar todas las pendientes"
                    />
                  </th>
                  <th style={styles.th}>Código</th>
                  <th style={styles.th}>Tipo</th>
                  <th style={styles.th}>Origen</th>
                  <th style={styles.th}>Destino</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones.map((a) => (
                  <tr key={a.asignacionId} style={styles.tr}>
                    <td style={styles.td}>
                      {a.estado === "recibido" ? (
                        <input
                          type="checkbox"
                          checked={seleccion.has(a.donationId)}
                          onChange={() => alternarSeleccion(a.donationId)}
                          aria-label={`Seleccionar ${a.trackingId}`}
                        />
                      ) : (
                        <span style={styles.guion}></span>
                      )}
                    </td>
                    <td style={{ ...styles.td, ...styles.codigo }}>{a.trackingId}</td>
                    <td style={styles.td}>{a.tipo}</td>
                    <td style={styles.td}>{a.origen}</td>
                    <td style={styles.td}>{a.destino}</td>
                    <td style={styles.td}>
                      <StatusBadge variant={variantePorEstado[a.estado]} />
                    </td>
                    <td style={styles.td}>
                      {a.estado === "recibido" && (
                        <button style={styles.accionBtn} onClick={() => setModalTransito([a])}>
                          En tránsito
                        </button>
                      )}
                      {a.estado === "en_transito" && (
                        <button style={styles.accionBtnVerde} onClick={() => setModalEntrega(a)}>
                          Confirmar entrega
                        </button>
                      )}
                      {a.estado === "entregado" && <span style={styles.guion}>Finalizada</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalTransito && (
        <MarcarEnTransitoModal
          cantidad={modalTransito.length}
          detalle={modalTransito.map((a) => a.trackingId).join(", ")}
          enviando={accionEnviando}
          onConfirm={confirmarTransito}
          onCancel={() => setModalTransito(null)}
        />
      )}

      {modalEntrega && (
        <ConfirmarEntregaModal
          donacionCodigo={modalEntrega.trackingId}
          descripcion={`${modalEntrega.tipo} · Destino: ${modalEntrega.destino}`}
          onConfirm={confirmarEntrega}
          onCancel={() => setModalEntrega(null)}
        />
      )}
      </>
      )}
    </DashboardLayout>
  );
};

const styles: Record<string, React.CSSProperties> = {
  cards: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  errorBox: {
    backgroundColor: "rgba(184,134,11,0.10)",
    border: "1px solid #b8860b",
    borderRadius: "10px",
    padding: "14px 18px",
    color: "#f0d488",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
  },
  panel: {
    backgroundColor: "#1A1D23",
    border: "1px solid #232830",
    borderRadius: "14px",
    padding: "22px 24px",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px",
    gap: "14px",
    flexWrap: "wrap",
  },
  panelTitle: {
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    margin: 0,
  },
  bulkBtn: {
    padding: "10px 16px",
    backgroundColor: "rgba(0,212,245,0.10)",
    color: "#00d4f5",
    border: "1px solid #00d4f5",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  bulkBtnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  tablaWrap: {
    overflowX: "auto",
  },
  tabla: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "'Inter', sans-serif",
  },
  th: {
    textAlign: "left",
    color: "#8a9bb0",
    fontSize: "12px",
    fontWeight: "600",
    padding: "10px 12px",
    borderBottom: "1px solid #232830",
    whiteSpace: "nowrap",
  },
  tr: {
    borderBottom: "1px solid #1A1D23",
  },
  td: {
    color: "#cdd6e0",
    fontSize: "13px",
    padding: "14px 12px",
    verticalAlign: "middle",
  },
  codigo: {
    color: "#00d4f5",
    fontWeight: "700",
  },
  guion: {
    color: "#56606e",
    fontSize: "13px",
  },
  accionBtn: {
    padding: "8px 14px",
    backgroundColor: "rgba(0,212,245,0.10)",
    color: "#00d4f5",
    border: "1px solid #00d4f5",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  accionBtnVerde: {
    padding: "8px 14px",
    backgroundColor: "rgba(22,163,74,0.12)",
    color: "#3fd17e",
    border: "1px solid #16a34a",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  vacio: {
    color: "#8a9bb0",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
    padding: "30px 0",
  },
};

export default TransportistaDashboard;
