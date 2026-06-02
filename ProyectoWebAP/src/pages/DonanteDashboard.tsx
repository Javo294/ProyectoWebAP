import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout, { type ItemNav } from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { getCurrentUser } from "../lib/session";
import type { EstadoDonacion } from "../lib/sistratec";
import { api } from "../lib/api";

interface DonacionDonante {
  id: string;
  trackingId: string;
  tipo: string;
  estado: EstadoDonacion;
  descripcion: string;
  fechaRegistro: string;
}

const variantePorEstado: Record<EstadoDonacion, "recibido" | "clasificado" | "en_transito" | "entregado"> = {
  recibido: "recibido",
  clasificado: "clasificado",
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

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ITEMS_NAV: ItemNav[] = [
  { clave: "donaciones", etiqueta: "Mis donaciones", icono: <PackageIcon /> },
];

const DonanteDashboard: React.FC = () => {
  const usuario = getCurrentUser();
  const [donaciones, setDonaciones] = useState<DonacionDonante[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDonaciones = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await api.get<DonacionDonante[]>("/donations/mine");
      setDonaciones(data);
    } catch (err: any) {
      setError(err.message || "No pudimos cargar tus donaciones.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDonaciones();
  }, [cargarDonaciones]);

  const total = donaciones.length;
  const enTransito = donaciones.filter((d) => d.estado === "en_transito").length;
  const entregados = donaciones.filter((d) => d.estado === "entregado").length;

  return (
    <DashboardLayout
      usuario={usuario}
      items={ITEMS_NAV}
      activo="donaciones"
      onSeleccionar={() => undefined}
      titulo="Mis donaciones"
      subtitulo="Aquí puedes ver el estado de cada donación que has realizado."
    >
      <div style={styles.cards}>
        <StatCard label="Donaciones totales" value={total} icon={<PackageIcon />} accent="#00d4f5" />
        <StatCard label="En tránsito" value={enTransito} icon={<TruckIcon />} accent="#b9770e" />
        <StatCard label="Entregadas" value={entregados} icon={<CheckIcon />} accent="#16a34a" />
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.panel}>
        <h2 style={styles.panelTitle}>Historial de donaciones</h2>

        {cargando ? (
          <p style={styles.vacio}>Cargando donaciones...</p>
        ) : donaciones.length === 0 ? (
          <p style={styles.vacio}>
            Aún no has realizado ninguna donación. Cuando hagas una, aparecerá aquí para que le des seguimiento.
          </p>
        ) : (
          <div style={styles.tablaWrap}>
            <table style={styles.tabla}>
              <thead>
                <tr>
                  <th style={styles.th}>Código</th>
                  <th style={styles.th}>Tipo</th>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {donaciones.map((d) => (
                  <tr key={d.id} style={styles.tr}>
                    <td style={{ ...styles.td, ...styles.codigo }}>{d.trackingId}</td>
                    <td style={styles.td}>{d.tipo}</td>
                    <td style={styles.td}>{new Date(d.fechaRegistro).toLocaleDateString("es-CR")}</td>
                    <td style={styles.td}>
                      <StatusBadge variant={variantePorEstado[d.estado]} />
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.verBtn}
                        onClick={() => window.open(`/#/track?code=${d.trackingId}`, "_blank")}
                      >
                        <EyeIcon />
                        Ver trazabilidad
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  verBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "none",
    border: "1px solid #2e3f50",
    color: "#8a9bb0",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  vacio: {
    color: "#8a9bb0",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
    padding: "30px 0",
  },
};

export default DonanteDashboard;
