import React from "react";

// 1. Definimos la interfaz con propiedades opcionales por seguridad contra datos nulos
interface TransitDetailsProps {
  date?: string;
  transportista?: string;
  vehiculo?: string;
  destino?: string;
}

const TransitDetails: React.FC<TransitDetailsProps> = ({ 
  date = "Pendiente", 
  transportista = "Por asignar", 
  vehiculo = "No especificado", 
  destino = "Centro de distribución" 
}) => {
  return (
    <div style={styles.card}>
      <p style={styles.title}>
        En tránsito desde el <span style={styles.date}>{date}</span>
      </p>
      <div style={styles.fields}>
        <div style={styles.field}>
          <span style={styles.label}>Transportista</span>
          <span style={styles.value}>{transportista}</span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Vehículo</span>
          <span style={styles.value}>{vehiculo}</span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Destino</span>
          <span style={styles.value}>{destino}</span>
        </div>
      </div>
    </div>
  );
};

// 2. Tipado de objeto CSS estándar unificado con el resto del front
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: "1px solid #666666",
    background: "#171920",
    borderRadius: "8px",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "transparent",
  },
  title: {
    margin: 0,
    color: "#00D4FF",
    fontSize: "21px",
    fontWeight: "700", // Inter Bold
    fontFamily: "'Inter', sans-serif",
  },
  date: {
    color: "#00d4f5",
    fontWeight: "700", // Inter Bold
    fontFamily: "'Inter', sans-serif",
  },
  fields: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap", // Simplificado sin requerir el 'as const'
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: "1 1 auto", // Comportamiento responsivo fluido para pantallas chicas
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

export default TransitDetails;