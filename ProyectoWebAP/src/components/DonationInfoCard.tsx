import React from "react";

interface DonationInfoCardProps {
  donante: string;
  tipo: string;
  centro: string;
  fechaRegistro: string;
}

const DonationInfoCard: React.FC<DonationInfoCardProps> = ({ donante, tipo, centro, fechaRegistro }) => {
  const fields = [
    { label: "Donante", value: donante },
    { label: "Tipo", value: tipo },
    { label: "Centro", value: centro },
    { label: "Fecha de registro", value: fechaRegistro },
  ];

  return (
    <div style={styles.card}>
      {fields.map((field, i) => (
        <div key={i} style={styles.field}>
          <span style={styles.label}>{field.label}</span>
          <span style={styles.value}>{field.value}</span>
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: "1px solid #666666",
    background: "#171920",
    borderRadius: "8px",
    padding: "16px 24px",
    display: "flex",
    gap: "40px",
    flexWrap: "wrap" as const,
    backgroundColor: "transparent",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: {
    color: "#5a7080",
    fontSize: "12px",
    fontFamily: "'Inter', sans-serif",
  },
  value: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
  },
};

export default DonationInfoCard;