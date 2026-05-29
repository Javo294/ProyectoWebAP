import React from "react";
import ModalOverlay from "../components/ModalOverlay";
import InfoBanner from "../components/InfoBanner";

interface ConfirmarEntregaModalProps {
  donacionCodigo: string;
  descripcion: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const WarningIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0f14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ConfirmarEntregaModal: React.FC<ConfirmarEntregaModalProps> = ({
  donacionCodigo,
  descripcion,
  onConfirm,
  onCancel,
}) => {
  return (
    <ModalOverlay onClose={onCancel}>
      {/* Título + close */}
      <div style={styles.header}>
        <h2 style={styles.title}>Confirmar entrega</h2>
        <button style={styles.closeBtn} onClick={onCancel} aria-label="Cerrar">
          x
        </button>
      </div>

      {/* Info de donación */}
      <InfoBanner
        variant="info"
        icon={<MailIcon />}
        title={`Confirmar entrega de ${donacionCodigo}`}
        description={descripcion}
      />

      {/* Advertencia */}
      <InfoBanner
        variant="warning"
        icon={<WarningIcon />}
        title="Esta acción es irreversible"
        description='El estado pasará a "Entregado" y se bloqueará cualquier modificación posterior. Asegúrate de haber entregado físicamente el lote antes de confirmar'
      />

      {/* Acciones */}
      <div style={styles.actions}>
        <button style={styles.cancelBtn} onClick={onCancel}>
          Cancelar
        </button>
        <button style={styles.confirmBtn} onClick={onConfirm}>
          <CheckIcon />
          Confirmar entrega
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
    margin: 0,
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
  },
  closeBtn: {
    background: "none",
    border: "1px solid #2e3f50",
    color: "#8a9bb0",
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    flex: 1,
    padding: "12px 20px",
    background: "none",
    border: "1px solid #2e3f50",
    color: "#c8d8e8",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  confirmBtn: {
    flex: 1,
    padding: "12px 20px",
    backgroundColor: "#00d4f5",
    border: "none",
    color: "#0a0f14",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
};

export default ConfirmarEntregaModal;