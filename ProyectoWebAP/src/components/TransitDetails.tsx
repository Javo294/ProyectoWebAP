import React from "react";

interface TransitDetailsProps {
  estado: "en_transito" | "entregado";
  fechaEstimada?: string;
  fechaEntregada?: string;
  transportista?: string;
  vehiculo?: string;
  origen?: string;
  destino?: string;
}

const TransitDetails: React.FC<TransitDetailsProps> = ({
  estado,
  fechaEstimada,
  fechaEntregada,
  transportista,
  vehiculo,
  origen,
  destino,
}) => {
  const titulo =
    estado === "entregado"
      ? `Entregado el ${fechaEntregada || "fecha pendiente"}`
      : "En tránsito hacia su destino";

  const fechaEstimadaTexto = fechaEstimada || "Sin estimar";
  const transportistaTexto = transportista || "Pendiente asignación";
  const vehiculoTexto = vehiculo || "Pendiente";
  const origenTexto = origen || "Centro de acopio";
  const destinoTexto = destino || "Pendiente";

  return (
    <div style={styles.card}>
      <p style={styles.title}>{titulo}</p>
      <div style={styles.fields}>
        <div style={styles.field}>
          <span style={styles.label}>Transportista</span>
          <span style={styles.value}>{transportistaTexto}</span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Vehículo</span>
          <span style={styles.value}>{vehiculoTexto}</span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Origen</span>
          <span style={styles.value}>{origenTexto}</span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Destino</span>
          <span style={styles.value}>{destinoTexto}</span>
        </div>
        {estado === "en_transito" && (
          <div style={styles.field}>
            <span style={styles.label}>Entrega estimada</span>
            <span style={styles.value}>{fechaEstimadaTexto}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: "1px solid #666666",
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
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
  },
  fields: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: "1 1 auto",
    minWidth: 140,
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
