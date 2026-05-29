import React from "react";

// 1. Definimos la interfaz para TypeScript
interface PrimaryButtonProps {
  label?: string;
  // Este es el tipo estándar en React para un evento de clic en un botón
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; 
  // Restringimos 'type' a los 3 valores reales que acepta la etiqueta button de HTML
  type?: "button" | "submit" | "reset"; 
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  label = "Ingresar", 
  onClick, 
  type = "button", 
  disabled = false 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.button,
        ...(disabled ? styles.disabled : {}),
      }}
    >
      {label}
    </button>
  );
};

// 2. Agregamos el molde de estilos CSS seguro para TypeScript
const styles: { [key: string]: React.CSSProperties } = {
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#00d4f5",
    color: "#0a0f14",
    border: "none",
    borderRadius: "6px",
    fontSize: "18px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.04em",
    cursor: "pointer",
    transition: "background-color 0.2s, transform 0.1s",
  },
  disabled: {
    backgroundColor: "#1e3040",
    color: "#4a6070",
    cursor: "not-allowed",
  },
};

export default PrimaryButton;