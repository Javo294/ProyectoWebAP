import React, { useState } from "react";
import ModalOverlay from "../components/ModalOverlay";
import InfoBanner from "../components/InfoBanner";
import StatusBadge from "../components/StatusBadge";
import type { EstadoDonacion } from "../lib/sistratec";

interface CambioEstadoModalProps {
  trackingId: string;
  estadoActual: EstadoDonacion;
  onConfirm: (nuevoEstado: EstadoDonacion) => Promise<void>;
  onCancel: () => void;
}

const estadosPermitidos: { valor: EstadoDonacion; etiqueta: string }[] = [
  { valor: "recibido", etiqueta: "Recibido" },
  { valor: "clasificado", etiqueta: "Clasificado" },
  { valor: "en_transito", etiqueta: "En tránsito" },
  { valor: "entregado", etiqueta: "Entregado" },
];

const varianteBadge: Record<EstadoDonacion, "recibido" | "clasificado" | "en_transito" | "entregado"> = {
  recibido: "recibido",
  clasificado: "clasificado",
  en_transito: "en_transito",
  entregado: "entregado",
};

const InfoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const CambioEstadoModal: React.FC<CambioEstadoModalProps> = ({
  trackingId,
  estadoActual,
  onConfirm,
  onCancel,
}) => {
  const [seleccion, setSeleccion] = useState<EstadoDonacion | "">("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const indiceActual = estadosPermitidos.findIndex((e) => e.valor === estadoActual);

  const handleConfirm = async () => {
    if (!seleccion) return;
    setEnviando(true);
    setError(null);
    try {
      await onConfirm(seleccion as EstadoDonacion);
    } catch (err: any) {
      setError(err.message || "No pudimos cambiar el estado.");
      setEnviando(false);
    }
  };

  return (
    <ModalOverlay onClose={onCancel}>
      <div style={styles.header}>
        <h2 style={styles.title}>Cambiar estado</h2>
        <button style={styles.closeBtn} onClick={onCancel} aria-label="Cerrar">
          ×
        </button>
      </div>

      <InfoBanner
        variant="info"
        icon={<InfoIcon />}
        title={`Donación: ${trackingId}`}
        description="Selecciona el nuevo estado para esta donación."
      />

      <div style={styles.estadoActual}>
        <span style={styles.estadoLabel}>Estado actual:</span>
        <StatusBadge variant={varianteBadge[estadoActual]} />
      </div>

      <div style={styles.opciones}>
        <span style={styles.selectLabel}>Nuevo estado:</span>
        {estadosPermitidos.map((est, idx) => {
          const deshabilitado = idx <= indiceActual;
          return (
            <button
              key={est.valor}
              disabled={deshabilitado}
              onClick={() => setSeleccion(est.valor)}
              style={{
                ...styles.opcion,
                ...(seleccion === est.valor ? styles.opcionActiva : {}),
                ...(deshabilitado ? styles.opcionDeshabilitada : {}),
              }}
            >
              <StatusBadge variant={varianteBadge[est.valor]} />
              {deshabilitado && <span style={styles.actualTag}>Actual o anterior</span>}
            </button>
          );
        })}
      </div>

      {error && (
        <InfoBanner
          variant="warning"
          icon={<InfoIcon />}
          title="Error"
          description={error}
        />
      )}

      <div style={styles.actions}>
        <button style={styles.cancelBtn} onClick={onCancel} disabled={enviando}>
          Cancelar
        </button>
        <button
          style={{
            ...styles.confirmBtn,
            ...(!seleccion || enviando ? styles.confirmBtnDisabled : {}),
          }}
          disabled={!seleccion || enviando}
          onClick={handleConfirm}
        >
          {enviando ? "Cambiando..." : "Cambiar estado"}
        </button>
      </div>
    </ModalOverlay>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  title: { color: "#ffffff", fontSize: "20px", fontWeight: "700", fontFamily: "'Inter', sans-serif", margin: 0 },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#8a9bb0",
    fontSize: "22px",
    cursor: "pointer",
    lineHeight: 1,
  },
  estadoActual: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "#111318",
    borderRadius: "8px",
  },
  estadoLabel: {
    color: "#8a9bb0",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
  },
  opciones: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  selectLabel: {
    color: "#EFEFEF",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
  },
  opcion: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "#111318",
    border: "1px solid #232830",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    color: "#ffffff",
  },
  opcionActiva: {
    borderColor: "#00d4f5",
    backgroundColor: "rgba(0,212,245,0.08)",
  },
  opcionDeshabilitada: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  actualTag: {
    color: "#8a9bb0",
    fontSize: "11px",
    fontStyle: "italic",
  },
  actions: { display: "flex", gap: "14px" },
  cancelBtn: {
    flex: 1,
    padding: "14px",
    backgroundColor: "transparent",
    color: "#cdd6e0",
    border: "1px solid #2e3f50",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  confirmBtn: {
    flex: 1,
    padding: "14px",
    backgroundColor: "#00d4f5",
    color: "#0a0f14",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  confirmBtnDisabled: {
    backgroundColor: "#1e3040",
    color: "#4a6070",
    cursor: "not-allowed",
  },
};

export default CambioEstadoModal;
