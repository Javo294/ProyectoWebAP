import React from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({
  title = "SISTRA-TEC",
  subtitle = "Trazabilidad de donaciones en tiempo real",
  rightContent,
  showBack = false,
  onBack,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = "#/";
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        {showBack && (
          <button style={styles.backBtn} onClick={handleBack} aria-label="Volver">
            <BackIcon />
            Volver
          </button>
        )}
        <div style={styles.brand}>
          <span style={styles.title}>{title}</span>
          <span style={styles.subtitle}>{subtitle}</span>
        </div>
      </div>
      {rightContent && <div style={styles.right}>{rightContent}</div>}
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 100,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  brand: {
    display: "flex",
    flexDirection: "column",
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
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "none",
    border: "1px solid #2e3f50",
    color: "#cdd6e0",
    padding: "7px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  right: {
    display: "flex",
    alignItems: "center",
  },
};

export default Header;
