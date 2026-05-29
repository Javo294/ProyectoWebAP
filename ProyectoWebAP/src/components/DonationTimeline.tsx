import React from "react";

// Tipos base que ya tenías bien definidos
type StepStatus = "completed" | "active" | "pending";

interface TimelineStep {
  label: string;
  date?: string;
  status: StepStatus;
}

interface DonationTimelineProps {
  steps: TimelineStep[];
}

const DonationTimeline: React.FC<DonationTimelineProps> = ({ steps }) => {
  return (
    <div style={styles.wrapper}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          {/* Contenedor de cada paso */}
          <div style={styles.stepCol}>
            <div style={{ ...styles.circle, ...circleStyle(step.status) }} />
            {step.date && <span style={styles.date}>{step.date}</span>}
            <span style={{ ...styles.label, color: step.status === "pending" ? "#2A2D35" : "#00d4f5" }}>
              {step.label}
            </span>
            <div style={styles.badge}>
              <span style={{ ...styles.dot, background: step.status === "pending" ? "#2A2D35" : "#00d4f5" }} />
              <span style={{ ...styles.badgeText, color: step.status === "pending" ? "#2A2D35" : "#8a9bb0" }}>
                {step.status === "completed" ? "Completado" : step.status === "active" ? "Activo" : "Pendiente"}
              </span>
            </div>
          </div>

          {/* Línea conectora entre círculos */}
          {i < steps.length - 1 && (
            <div 
              style={{ 
                ...styles.line, 
                background: steps[i + 1].status === "pending" ? "#2A2D35" : "#00d4f5" 
              }} 
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Función auxiliar para los estados visuales del círculo
const circleStyle = (status: StepStatus): React.CSSProperties => {
  if (status === "completed") return { border: "2px solid #00d4f5", background: "rgba(0,212,245,0.08)" };
  if (status === "active") return { border: "2px solid #00d4f5", background: "rgba(0,212,245,0.18)", boxShadow: "0 0 0 4px rgba(0,212,245,0.1)" };
  return { border: "2px solid #434343", background: "#2A2D35" }; 
};

// Estilos unificados y corregidos para compatibilidad estricta 
const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    alignItems: "flex-start", // Cambiado de center a flex-start para alinear mejor con el desfase de la línea
    justifyContent: "center",
    padding: "20px",
    width: "100%",
    boxSizing: "border-box",
    overflowX: "auto", // Si hay demasiados pasos en celular, permite scroll horizontal en vez de aplastar los círculos
  },
  stepCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    width: "140px", // Ancho fijo recomendado para mantener simetría
    flexShrink: 0, // Evita que se deformen los bloques en pantallas pequeñas
  },
  circle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    boxSizing: "border-box",
  },
  line: {
    flexGrow: 1, // Permite que la línea se estire dinámicamente llenando el vacío
    minWidth: "40px", // Espacio mínimo asegurado entre círculos
    height: "2px",
    marginTop: "39px", // Ajustado matemáticamente para que calce exactamente en el centro horizontal del círculo de 80px
    flexShrink: 0,
  },
  date: {
    color: "#8a9bb0",
    fontSize: "11px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
  },
  label: {
    fontSize: "13px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  badgeText: {
    fontSize: "11px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
  },
};

export default DonationTimeline;