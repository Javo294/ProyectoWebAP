import React from "react";

// 1. Definimos los tipos de las propiedades (Props) para TypeScript
interface HeaderProps {
  title?: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
}

// 2. Le asignamos el tipo al componente y dejamos los valores por defecto
const Header: React.FC<HeaderProps> = ({ 
  title = "SISTRA-TEC", 
  subtitle = "Trazabilidad de donaciones en tiempo real" 
}) => {
  return (
    <header style={styles.header}>
      <span style={styles.title}>{title}</span>
      <span style={styles.subtitle}>{subtitle}</span>
    </header>
  );
};

// 3. Definimos los estilos (con un tipado CSS básico por seguridad)
const styles: { [key: string]: React.CSSProperties } = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    padding: "14px 24px",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
  },
  title: {
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    letterSpacing: "0.05em",
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.2,
  },
  subtitle: {
    color: "#8a9bb0",
    fontSize: "11px",
    fontWeight: "400",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.03em",
  },
};

// 4. CORREGIDO: Exportamos el nombre correcto del componente
export default Header;