import React from "react";

type BadgeVariant =
  | "entregado"
  | "activo"
  | "pendiente"
  | "transito"
  | "recibido"
  | "clasificado"
  | "en_transito";

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  entregado: { backgroundColor: "#16a34a", color: "#ffffff" },
  activo: { backgroundColor: "#00d4f5", color: "#0a0f14" },
  pendiente: { backgroundColor: "#2e3f50", color: "#8a9bb0" },
  transito: { backgroundColor: "#1e3a5f", color: "#00d4f5" },
  recibido: { backgroundColor: "#0e7c66", color: "#ffffff" },
  clasificado: { backgroundColor: "#1e3a5f", color: "#00d4f5" },
  en_transito: { backgroundColor: "#b9770e", color: "#ffffff" },
};

const defaultLabels: Record<BadgeVariant, string> = {
  entregado: "Entregado",
  activo: "Activo",
  pendiente: "Pendiente",
  transito: "En tránsito",
  recibido: "Recibido",
  clasificado: "Clasificado",
  en_transito: "En tránsito",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, label }) => {
  return (
    <span style={{ ...styles.badge, ...variantStyles[variant] }}>
      {label ?? defaultLabels[variant]}
    </span>
  );
};

const styles: Record<string, React.CSSProperties> = {
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.03em",
    whiteSpace: "nowrap",
  },
};

export default StatusBadge;
