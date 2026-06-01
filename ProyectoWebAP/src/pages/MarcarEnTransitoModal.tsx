import React from "react";
import ModalOverlay from "../components/ModalOverlay";
import InfoBanner from "../components/InfoBanner";

interface MarcarEnTransitoModalProps {
  cantidad: number;
  detalle: string;
  enviando: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const TruckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const MarcarEnTransitoModal: React.FC<MarcarEnTransitoModalProps> = ({
  cantidad,
  detalle,
  enviando,
  onConfirm,
  onCancel,
}) => {
  return (
    <ModalOverlay onClose={onCancel}>
      <div style={styles.header}>
        <h2 style={styles.title}>Marcar en tránsito</h2>
        <button style={styles.closeBtn} onClick={onCancel} aria-label="Cerrar">
          ×
        </button>
      </div>

      <InfoBanner
        variant="info"
        icon={<TruckIcon />}
        title={
          cantidad > 1
            ? `Vas a marcar ${cantidad} donaciones como En tránsito`
            : "Vas a marcar esta donación como En tránsito"
        }
        description={detalle}
      />

      <p style={styles.texto}>
        El estado pasará de &quot;Clasificado&quot; a &quot;En tránsito&quot; y el donante podrá ver el cambio en la
        trazabilidad. Si aún no has iniciado la ruta, puedes cancelar y hacerlo después.
      </p>

      <div style={styles.actions}>
        <button style={styles.cancelBtn} onClick={onCancel} disabled={enviando}>
          Cancelar
        </button>
        <button style={styles.confirmBtn} onClick={onConfirm} disabled={enviando}>
          {enviando ? "Actualizando..." : "Confirmar en tránsito"}
        </button>
      </div>
    </ModalOverlay>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#8a9bb0",
    fontSize: "22px",
    cursor: "pointer",
    lineHeight: 1,
  },
  texto: {
    color: "#8a9bb0",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.5,
    margin: 0,
  },
  actions: {
    display: "flex",
    gap: "14px",
  },
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
};

export default MarcarEnTransitoModal;
