import React from "react";

type BannerVariant = "info" | "warning";

interface InfoBannerProps {
  variant: BannerVariant;
  title?: string;
  description?: string;
  icon: React.ReactNode;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ variant, title, description, icon }) => {
  const borderColor = variant === "warning" ? "#b8860b" : "#00d4f5";
  const bgColor = variant === "warning" ? "rgba(184,134,11,0.08)" : "rgba(0,212,245,0.06)";

  return (
    <div style={{ ...styles.banner, borderColor, backgroundColor: bgColor }}>
      <span style={styles.icon}>{icon}</span>
      <div style={styles.text}>
        {title && <span style={styles.title}>{title}</span>}
        {description && <span style={styles.description}>{description}</span>}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  banner: {
    border: "1px solid",
    borderRadius: "10px",
    padding: "16px 20px",
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  icon: {
    flexShrink: 0,
    marginTop: "2px",
    display: "flex",
    alignItems: "center",
  },
  text: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  title: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
  },
  description: {
    color: "#8a9bb0",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.5,
  },
};

export default InfoBanner;