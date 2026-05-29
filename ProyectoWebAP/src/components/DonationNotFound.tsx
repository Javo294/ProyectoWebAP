import React from "react";
import PrimaryButton from "./PrimaryButton";

// 1. Interfaz limpia para las propiedades
interface DonationNotFoundProps {
  onRetry?: () => void;
}

const DonationNotFound: React.FC<DonationNotFoundProps> = ({ onRetry }) => {
  return (
    <div style={styles.wrapper}>
      {/* Encapsulamos el icono por accesibilidad y consistencia visual */}
      <span style={styles.icon} role="img" aria-label="Carita triste">
        ☹
      </span>
      <h2 style={styles.title}>Lo sentimos, no encontramos tu donación</h2>
      <p style={styles.subtitle}>Verifica que ingresaste correctamente los dígitos.</p>
      <div style={styles.btn}>
        <PrimaryButton label="Intentar de nuevo" onClick={onRetry} />
      </div>
    </div>
  );
};

// 2. Tipado de objeto CSS unificado sin usar 'as const' planos
const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    border: "1px solid #2e3f50",
    borderRadius: "16px",
    padding: "60px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    textAlign: "center",
    maxWidth: "500px", // Limitamos el ancho para que la tarjeta de error no se deforme en pantallas gigantes
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "transparent",
  },
  icon: {
    fontSize: "44px",
    color: "#5a7080", // Un tono ligeramente más claro para que resalte estéticamente en el fondo oscuro
    lineHeight: 1,
    userSelect: "none",
  },
  title: {
    margin: 0,
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "700",
    fontFamily: "'Courier New', monospace",
  },
  subtitle: {
    margin: 0,
    color: "#5a7080",
    fontSize: "13px",
    fontFamily: "'Courier New', monospace",
  },
  btn: {
    marginTop: "8px",
    width: "200px",
  },
};

export default DonationNotFound;