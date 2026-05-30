import React from "react";
import PrimaryButton from "./PrimaryButton";

interface DonationNotFoundProps {
  onRetry?: () => void;
}

const DonationNotFound: React.FC<DonationNotFoundProps> = ({ onRetry }) => {
  return (
    <div style={styles.wrapper}>
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
    maxWidth: "500px",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "transparent",
    margin: "0 auto", // <--- ESTO ASEGURA EL CENTRADO HORIZONTAL
  },
  icon: {
    fontSize: "44px",
    color: "#5a7080",
    lineHeight: 1,
    userSelect: "none",
  },
  title: {
    margin: 0,
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
  },
  subtitle: {
    margin: 0,
    color: "#5a7080",
    fontSize: "13px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
  },
  btn: {
    marginTop: "8px",
    width: "200px",
  },
};

export default DonationNotFound;