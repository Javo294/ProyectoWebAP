import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout, { type ItemNav } from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { BarChart, DonutChart } from "../components/Charts";
import GestorCuentas from "../components/GestorCuentas";
import PanelPerfil from "./PanelPerfil";
import AsignarTransportistaModal from "./AsignarTransportistaModal";
import AgregarTransportistaModal from "./AgregarTransportistaModal";
import AgregarAdministradorModal from "./AgregarAdministradorModal";
import DetalleDonacionModal from "./DetalleDonacionModal";
import {
  dashboardService,
  donacionesService,
  transportistasService,
  administradoresService,
  type DonacionAdmin,
  type EstadoDonacion,
  type MetricasAdmin,
} from "../lib/sistratec";
import { getCurrentUser } from "../lib/session";
import { ApiError } from "../lib/api";

const variantePorEstado: Record<EstadoDonacion, "recibido" | "clasificado" | "en_transito" | "entregado"> = {
  recibido: "recibido",
  clasificado: "clasificado",
  en_transito: "en_transito",
  entregado: "entregado",
};

const variantePorEstadoModal: Record<EstadoDonacion, "entregado" | "activo" | "pendiente" | "transito"> = {
  recibido: "pendiente",
  clasificado: "activo",
  en_transito: "transito",
  entregado: "entregado",
};

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);
const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.27 6.96 12 12.01l8.73-5.05" />
    <path d="M12 22.08V12" />
  </svg>
);
const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ITEMS_NAV: ItemNav[] = [
  { clave: "resumen", etiqueta: "Resumen", icono: <GridIcon /> },
  { clave: "donaciones", etiqueta: "Donaciones", icono: <BoxIcon /> },
  { clave: "transportistas", etiqueta: "Transportistas", icono: <TruckIcon /> },
  { clave: "admins", etiqueta: "Administradores", icono: <UsersIcon /> },
  { clave: "perfil", etiqueta: "Mi perfil", icono: <UserIcon /> },
];

const ESTADOS_FILTRO: { valor: EstadoDonacion | ""; etiqueta: string }[] = [
  { valor: "", etiqueta: "Todos" },
  { valor: "recibido", etiqueta: "Recibido" },
  { valor: "clasificado", etiqueta: "Clasificado" },
  { valor: "en_transito", etiqueta: "En tránsito" },
  { valor: "entregado", etiqueta: "Entregado" },
];

const AdminDashboard: React.FC = () => {
  const usuario = getCurrentUser();
  const [seccion, setSeccion] = useState("resumen");

  const [metricas, setMetricas] = useState<MetricasAdmin | null>(null);
  const [errorMetricas, setErrorMetricas] = useState<string | null>(null);

  const [donaciones, setDonaciones] = useState<DonacionAdmin[]>([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [pagina, setPagina] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState<EstadoDonacion | "">("");
  const [busqueda, setBusqueda] = useState("");
  const [cargandoDonaciones, setCargandoDonaciones] = useState(true);
  const [errorDonaciones, setErrorDonaciones] = useState<string | null>(null);

  const [detalle, setDetalle] = useState<DonacionAdmin | null>(null);
  const [asignando, setAsignando] = useState<DonacionAdmin | null>(null);
  const [modalAgregarTransportista, setModalAgregarTransportista] = useState(false);
  const [modalAgregarAdmin, setModalAgregarAdmin] = useState(false);
  const [senalTransportistas, setSenalTransportistas] = useState(0);
  const [senalAdmins, setSenalAdmins] = useState(0);

  const cargarMetricas = useCallback(async () => {
    setErrorMetricas(null);
    try {
      setMetricas(await dashboardService.metricasAdmin());
    } catch (err) {
      setErrorMetricas(err instanceof ApiError ? err.message : "No pudimos cargar las métricas.");
    }
  }, []);

  const cargarDonaciones = useCallback(async () => {
    setCargandoDonaciones(true);
    setErrorDonaciones(null);
    try {
      const resp = await donacionesService.listar({
        status: filtroEstado || undefined,
        search: busqueda.trim() || undefined,
        pagina,
        porPagina: 8,
      });
      setDonaciones(resp.items);
      setTotalPaginas(resp.paginacion.totalPaginas);
    } catch (err) {
      setErrorDonaciones(
        err instanceof ApiError ? err.message : "No pudimos cargar las donaciones. Tus datos están a salvo, intenta de nuevo."
      );
    } finally {
      setCargandoDonaciones(false);
    }
  }, [filtroEstado, busqueda, pagina]);

  useEffect(() => {
    cargarMetricas();
  }, [cargarMetricas]);

  useEffect(() => {
    cargarDonaciones();
  }, [cargarDonaciones]);

  const refrescarTrasAsignar = () => {
    setAsignando(null);
    cargarDonaciones();
    cargarMetricas();
  };

  const distribucion = metricas?.distribucion ?? [];
  const datosGrafico = [
    { estado: "Recibido", valor: distribucion.find((d) => d.estado === "Recibido")?.valor ?? 0, color: "#0e7c66" },
    { estado: "En Tránsito", valor: distribucion.find((d) => d.estado === "En Tránsito")?.valor ?? 0, color: "#b9770e" },
    { estado: "Entregado", valor: distribucion.find((d) => d.estado === "Entregado")?.valor ?? 0, color: "#16a34a" },
  ];

  return (
    <DashboardLayout
      usuario={usuario}
      items={ITEMS_NAV}
      activo={seccion}
      onSeleccionar={setSeccion}
      titulo="Panel de administración"
      subtitulo="Gestiona donaciones, transportistas y el equipo de tu centro de acopio."
    >
      {seccion === "resumen" && (
        <>
          {errorMetricas && <div style={styles.errorBox}>{errorMetricas}</div>}
          <div style={styles.cards}>
            <StatCard label="Donaciones totales" value={metricas?.total ?? 0} icon={<BoxIcon />} accent="#00d4f5" />
            <StatCard label="En el centro" value={metricas?.recibidos ?? 0} icon={<GridIcon />} accent="#0e7c66" />
            <StatCard label="En tránsito" value={metricas?.enTransito ?? 0} icon={<TruckIcon />} accent="#b9770e" />
            <StatCard label="Entregadas" value={metricas?.entregados ?? 0} icon={<CheckIcon />} accent="#16a34a" />
          </div>

          <div style={styles.graficos}>
            <div style={styles.graficoPanel}>
              <h3 style={styles.graficoTitulo}>Donaciones por estado</h3>
              <BarChart datos={datosGrafico} />
            </div>
            <div style={styles.graficoPanel}>
              <h3 style={styles.graficoTitulo}>Distribución</h3>
              <DonutChart datos={datosGrafico} />
            </div>
          </div>
        </>
      )}

      {seccion === "donaciones" && (
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Gestor de donaciones</h2>
          <span style={styles.panelDesc}>Busca, filtra y asigna transportistas a las donaciones de tu centro.</span>

          <div style={styles.controles}>
            <input
              type="text"
              placeholder="Buscar por código (ej: DON-2026-A4F9)"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPagina(1);
              }}
              style={styles.buscador}
              aria-label="Buscar donación por código"
            />
            <div style={styles.filtros}>
              {ESTADOS_FILTRO.map((f) => (
                <button
                  key={f.etiqueta}
                  onClick={() => {
                    setFiltroEstado(f.valor);
                    setPagina(1);
                  }}
                  style={{ ...styles.chip, ...(filtroEstado === f.valor ? styles.chipActivo : {}) }}
                >
                  {f.etiqueta}
                </button>
              ))}
            </div>
          </div>

          {errorDonaciones && <div style={styles.errorBox}>{errorDonaciones}</div>}

          {cargandoDonaciones ? (
            <p style={styles.vacio}>Cargando donaciones...</p>
          ) : donaciones.length === 0 ? (
            <p style={styles.vacio}>No hay donaciones que coincidan con tu búsqueda.</p>
          ) : (
            <div style={styles.tablaWrap}>
              <table style={styles.tabla}>
                <thead>
                  <tr>
                    <th style={styles.th}>Código</th>
                    <th style={styles.th}>Tipo</th>
                    <th style={styles.th}>Donante</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {donaciones.map((d) => (
                    <tr key={d.id} style={styles.tr}>
                      <td style={{ ...styles.td, ...styles.codigo }}>{d.trackingId}</td>
                      <td style={styles.td}>{d.tipo}</td>
                      <td style={styles.td}>{d.donante}</td>
                      <td style={styles.td}>
                        <StatusBadge variant={variantePorEstado[d.estado]} />
                      </td>
                      <td style={styles.td}>
                        <div style={styles.acciones}>
                          <button style={styles.linkBtn} onClick={() => setDetalle(d)}>
                            Ver detalle
                          </button>
                          {d.estado === "recibido" && (
                            <button style={styles.asignarBtn} onClick={() => setAsignando(d)}>
                              Asignar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPaginas > 1 && (
            <div style={styles.paginacion}>
              <button style={styles.pagBtn} disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)}>
                Anterior
              </button>
              <span style={styles.pagInfo}>
                Página {pagina} de {totalPaginas}
              </span>
              <button style={styles.pagBtn} disabled={pagina >= totalPaginas} onClick={() => setPagina((p) => p + 1)}>
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}

      {seccion === "transportistas" && (
        <GestorCuentas
          titulo="Transportistas"
          descripcion="Personas encargadas de trasladar las donaciones de tu centro."
          servicio={transportistasService}
          etiquetaAgregar="Agregar transportista"
          onAgregar={() => setModalAgregarTransportista(true)}
          refrescarSenal={senalTransportistas}
          mostrarVehiculo
        />
      )}

      {seccion === "admins" && (
        <GestorCuentas
          titulo="Administradores"
          descripcion="Personas con acceso a la gestión del centro de acopio."
          servicio={administradoresService}
          etiquetaAgregar="Agregar administrador"
          onAgregar={() => setModalAgregarAdmin(true)}
          refrescarSenal={senalAdmins}
        />
      )}

      {seccion === "perfil" && <PanelPerfil />}

      {detalle && (
        <DetalleDonacionModal
          codigo={detalle.trackingId}
          descripcion={detalle.descripcion}
          donante={detalle.donante}
          tipo={detalle.tipo}
          fechaRegistro={new Date(detalle.fechaRegistro).toLocaleDateString("es-CR")}
          estado={variantePorEstadoModal[detalle.estado]}
          onClose={() => setDetalle(null)}
        />
      )}

      {asignando && (
        <AsignarTransportistaModal donacion={asignando} onAsignado={refrescarTrasAsignar} onCancel={() => setAsignando(null)} />
      )}

      {modalAgregarTransportista && (
        <AgregarTransportistaModal
          onCreado={() => {
            setModalAgregarTransportista(false);
            setSenalTransportistas((s) => s + 1);
          }}
          onCancel={() => setModalAgregarTransportista(false)}
        />
      )}

      {modalAgregarAdmin && (
        <AgregarAdministradorModal
          onCreado={() => {
            setModalAgregarAdmin(false);
            setSenalAdmins((s) => s + 1);
          }}
          onCancel={() => setModalAgregarAdmin(false)}
        />
      )}
    </DashboardLayout>
  );
};

const styles: Record<string, React.CSSProperties> = {
  cards: { display: "flex", gap: "16px", flexWrap: "wrap" },
  graficos: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  graficoPanel: {
    backgroundColor: "#1A1D23",
    border: "1px solid #232830",
    borderRadius: "14px",
    padding: "22px 24px",
  },
  graficoTitulo: {
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    margin: "0 0 18px",
  },
  panel: {
    backgroundColor: "#1A1D23",
    border: "1px solid #232830",
    borderRadius: "14px",
    padding: "22px 24px",
  },
  panelTitle: {
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    margin: 0,
  },
  panelDesc: {
    color: "#8a9bb0",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
    display: "block",
    marginBottom: "18px",
  },
  controles: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginBottom: "18px",
  },
  buscador: {
    width: "100%",
    backgroundColor: "#13161C",
    border: "1px solid #666666",
    borderRadius: "6px",
    padding: "11px 14px",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    color: "#EFEFEF",
    outline: "none",
    boxSizing: "border-box",
  },
  filtros: { display: "flex", gap: "8px", flexWrap: "wrap" },
  chip: {
    padding: "7px 14px",
    backgroundColor: "transparent",
    color: "#8a9bb0",
    border: "1px solid #2e3f50",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  chipActivo: {
    backgroundColor: "rgba(0,212,245,0.12)",
    color: "#00d4f5",
    borderColor: "#00d4f5",
  },
  errorBox: {
    backgroundColor: "rgba(184,134,11,0.10)",
    border: "1px solid #b8860b",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#f0d488",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
    marginBottom: "14px",
  },
  tablaWrap: { overflowX: "auto" },
  tabla: { width: "100%", borderCollapse: "collapse", fontFamily: "'Inter', sans-serif" },
  th: {
    textAlign: "left",
    color: "#8a9bb0",
    fontSize: "12px",
    fontWeight: "600",
    padding: "10px 12px",
    borderBottom: "1px solid #232830",
    whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #1A1D23" },
  td: { color: "#cdd6e0", fontSize: "13px", padding: "14px 12px", verticalAlign: "middle" },
  codigo: { color: "#00d4f5", fontWeight: "700" },
  acciones: { display: "flex", gap: "14px", alignItems: "center" },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#8a9bb0",
    fontSize: "13px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    padding: 0,
  },
  asignarBtn: {
    padding: "7px 14px",
    backgroundColor: "rgba(0,212,245,0.10)",
    color: "#00d4f5",
    border: "1px solid #00d4f5",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  paginacion: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    marginTop: "20px",
  },
  pagBtn: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "#cdd6e0",
    border: "1px solid #2e3f50",
    borderRadius: "6px",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  pagInfo: {
    color: "#8a9bb0",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
  },
  vacio: {
    color: "#8a9bb0",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
    padding: "30px 0",
  },
};

export default AdminDashboard;
