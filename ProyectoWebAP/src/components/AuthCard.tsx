import React from "react";

// 1. Definimos la interfaz para TypeScript
interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode; // Tipo correcto para cualquier elemento que metas dentro de la tarjeta
  footerText?: string;
  footerLinkText?: string;
  onClickFooterLink?: (e: React.MouseEvent<HTMLSpanElement>) => void; // Cambié el nombre prop por consistencia técnica
}

const AuthCard: React.FC<AuthCardProps> = ({ 
  title, 
  subtitle, 
  children, 
  footerText, 
  footerLinkText, 
  onClickFooterLink 
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.heading}>
        <h1 style={styles.title}>{title}</h1>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
      <div style={styles.body}>{children}</div>
      {footerText && (
        <p style={styles.footer}>
          {footerText}{" "}
          {footerLinkText && (
            <span style={styles.link} onClick={onClickFooterLink}>
              {footerLinkText}
            </span>
          )}
        </p>
      )}
    </div>
  );
};

// 2. Agregamos el molde de estilos CSS seguro para TypeScript
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: "#1A1D23",
    borderRadius: "16px",
    padding: "48px 52px",
    width: "100%",
    maxWidth: "460px",  
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
    boxSizing: "border-box", // Evita que el padding ensanche de más la tarjeta en Windows
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  title: {
    margin: 0,
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "700", // Inter Bold
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    margin: 0,
    color: "#5a7080",
    fontSize: "13px",
    fontWeight: "700", // Inter Bold
    fontFamily: "'Inter', sans-serif",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  footer: {
    margin: 0,
    textAlign: "center",
    color: "#5a7080",
    fontSize: "13px",
    fontWeight: "700", // Inter Bold
    fontFamily: "'Inter', sans-serif",
  },
  link: {
    color: "#00d4f5",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: "700", // Inter Bold para el enlace
    fontFamily: "'Inter', sans-serif",
  },
};

export default AuthCard;