import React from "react";
import ModalOverlay from "../components/ModalOverlay";
import InfoBanner from "../components/InfoBanner";
import StatusBadge from "../components/StatusBadge";
import DetailGrid from "../components/DetailGrid";

interface DetalleDonacionModalProps {
  codigo: string;
  descripcion: string;
  donante: string;
  tipo: string;
  fechaRegistro: string;
  estado: "entregado" | "activo" | "pendiente" | "transito";
  onClose: () => void;
}

const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const DetalleDonacionModal: React.FC<DetalleDonacionModalProps> = ({
  codigo,
  descripcion,
  donante,
  tipo,
  fechaRegistro,
  estado,
  onClose,
}) => {
  const estadoMessages: Record<string, { title: string; description: string }> = {
    entregado: {
      title: "Estado actual",
      description: "La donación ya fue entregada y figura como finalizada en el sistema",
    },
    activo: {
      title: "Estado actual",
      description: "La donación está activa y siendo procesada en el sistema",
    },
    transito: {
      title: "Estado actual",
      description: "La donación se encuentra en tránsito hacia su destino",
    },
    pendiente: {
      title: "Estado actual",
      description: "La donación está pendiente de ser procesada",
    },
  };

  const estadoBannerVariant = estado === "entregado" ? "info" : "warning";
  const estadoBannerIcon = estado === "entregado"
    ? <ShieldCheckIcon />
    : <ShieldCheckIcon />;

  return (
    <ModalOverlay onClose={onClose}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Detalle de la donación</h2>
        <button style={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          x
        </button>
      </div>

      {/* Banner donación */}
      <div style={styles.bannerRow}>
        <InfoBanner
          variant="info"
          icon={<MailIcon />}
          title={codigo}
          description={descripcion}
        />
        <div style={styles.badgeOverlay}>
          <StatusBadge variant={estado} />
        </div>
      </div>

      {/* Grid de detalles */}
      <DetailGrid
        fields={[
          { label: "Código", value: codigo },
          { label: "Donante", value: donante },
          { label: "Tipo", value: tipo },
          { label: "Fecha de registro", value: fechaRegistro },
        ]}
      />

      {/* Estado actual */}
      <InfoBanner
        variant={estadoBannerVariant}
        icon={estadoBannerIcon}
        title={estadoMessages[estado].title}
        description={estadoMessages[estado].description}
      />
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
  bannerRow: {
    position: "relative",
  },
  badgeOverlay: {
    position: "absolute",
    top: "25%",
    right: "20px",
    transform: "translateY(-50%)",
  },
};

export default DetalleDonacionModal;