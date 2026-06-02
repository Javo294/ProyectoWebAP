import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout, { type ItemNav } from "../components/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import StatCard from "../components/StatCard";
import { getCurrentUser } from "../lib/session";
import { api } from "../lib/api";
import type { EstadoDonacion, AsignacionVista } from "../lib/sistratec";

interface TransportistaConAsignaciones {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  vehicle: string | null;
  isActive: boolean;
  asignaciones: AsignacionVista[];
}

const variantePorEstado: Record<EstadoDonacion, "recibido" | "clasificado" | "en_transito" | "entregado"> = {
  recibido: "recibido",
  clasificado: "clasificado",
  en_transito: "en_transito",
  entregado: "entregado",
};

const TruckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const PackageIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.27 6.96 12 12.01l8.73-5.05" />
    <path d="M12 22.08V12" />
  </svg>
);

const ITEMS_NAV: ItemNav[] = [
  { clave: "seguimiento", etiqueta: "Seguimiento", icono: <TruckIcon /> },
];

const SeguimientoTransportistaAdmin: React.FC = () => {
  const usuario = getCurrentUser();
  const [transportistas, setTransportistas] = useState<TransportistaConAsignaciones[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandido, setExpandido] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await api.get<TransportistaConAsignaciones[]>("/transporters/tracking");
      setTransportistas(data);
    } catch (err: any) {
      setError(err.message || "No pudimos cargar la información de los transportistas.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const activos = transportistas.filter((t) => t.isActive).length;
  const enRuta = transportistas.filter((t) => t.asignaciones.some((a) => a.estado === "en_transito")).length;
  const totalAsignaciones = transportistas.reduce((sum, t) => sum + t.asignaciones.length, 0);

  return (
    <DashboardLayout
      usuario={usuario}
      items={ITEMS_NAV}
      activo="seguimiento"
      onSeleccionar={() => undefined}
      titulo="Seguimiento de transportistas"
      subtitulo="Monitorea el estado y las asignaciones activas de cada transportista."
    >
      <div style={styles.cards}>
        <StatCard label="Transportistas activos" value={activos} icon={<UsersIcon />} accent="#00d4f5" />
        <StatCard label="En ruta" value={enRuta} icon={<TruckIcon />} accent="#b9770e" />
        <StatCard label="Asignaciones activas" value={totalAsignaciones} icon={<PackageIcon />} accent="#16a34a" />
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.panel}>
        <h2 style={styles.panelTitle}>Transportistas y sus rutas</h2>

        {cargando ? (
          <p style={styles.vacio}>Cargando transportistas...</p>
        ) : transportistas.length === 0 ? (
          <p style={styles.vacio}>No hay transportistas registrados en el sistema.</p>
        ) : (
          <div style={styles.lista}>
            {transportistas.map((t) => (
              <div key={t.id} style={styles.tarjeta}>
                <div style={styles.tarjetaHeader} onClick={() => setExpandido(expandido === t.id ? null : t.id)}>
                  <div style={styles.tarjetaInfo}>
                    <div style={styles.avatar}>
                      {t.fullName.split(" ").slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join("")}
                    </div>
                    <div style={styles.tarjetaData}>
                      <span style={styles.tarjetaNombre}>{t.fullName}</span>
                      <span style={styles.tarjetaDetalle}>
                        {t.vehicle || "Sin vehículo"} · {t.asignaciones.length} asignaciones
                      </span>
                    </div>
                  </div>
                  <div style={styles.tarjetaEstado}>
                    <span
                      style={{
                        ...styles.indicador,
                        backgroundColor: t.isActive ? "#16a34a" : "#8a9bb0",
                      }}
                    />
                    <span style={styles.tarjetaAccion}>
                      {expandido === t.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {expandido === t.id && (
                  <div style={styles.asignaciones}>
                    {t.asignaciones.length === 0 ? (
                      <p style={styles.sinAsignaciones}>Sin asignaciones activas.</p>
                    ) : (
                      <div style={styles.tablaWrap}>
                        <table style={styles.tabla}>
                          <thead>
                            <tr>
                              <th style={styles.th}>Código</th>
                              <th style={styles.th}>Tipo</th>
                              <th style={styles.th}>Origen</th>
                              <th style={styles.th}>Destino</th>
                              <th style={styles.th}>Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {t.asignaciones.map((a) => (
                              <tr key={a.asignacionId} style={styles.tr}>
                                <td style={{ ...styles.td, ...styles.codigo }}>{a.trackingId}</td>
                                <td style={styles.td}>{a.tipo}</td>
                                <td style={styles.td}>{a.origen}</td>
                                <td style={styles.td}>{a.destino}</td>
                                <td style={styles.td}>
                                  <StatusBadge variant={variantePorEstado[a.estado]} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
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
  panelTitle: {
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    margin: 0,
    marginBottom: "18px",
  },
  lista: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  tarjeta: {
    backgroundColor: "#111318",
    border: "1px solid #232830",
    borderRadius: "12px",
    overflow: "hidden",
  },
  tarjetaHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    cursor: "pointer",
  },
  tarjetaInfo: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    backgroundColor: "#00d4f5",
    color: "#0a0f14",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    flexShrink: 0,
  },
  tarjetaData: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  tarjetaNombre: {
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
  },
  tarjetaDetalle: {
    color: "#8a9bb0",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
  },
  tarjetaEstado: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  indicador: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
  },
  tarjetaAccion: {
    color: "#8a9bb0",
    fontSize: "12px",
    fontFamily: "'Inter', sans-serif",
  },
  asignaciones: {
    padding: "0 20px 16px",
  },
  sinAsignaciones: {
    color: "#56606e",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
    padding: "12px 0",
    margin: 0,
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
  td: { color: "#cdd6e0", fontSize: "13px", padding: "12px 12px", verticalAlign: "middle" },
  codigo: { color: "#00d4f5", fontWeight: "700" },
  vacio: {
    color: "#8a9bb0",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
    padding: "30px 0",
  },
};

export default SeguimientoTransportistaAdmin;
