import React from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent = "#00d4f5" }) => {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.iconWrap, color: accent, borderColor: accent }}>{icon}</div>
      <div style={styles.body}>
        <span style={styles.value}>{value}</span>
        <span style={styles.label}>{label}</span>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: "#1A1D23",
    border: "1px solid #232830",
    borderRadius: "14px",
    padding: "20px 22px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flex: 1,
    minWidth: "180px",
  },
  iconWrap: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    backgroundColor: "rgba(0,212,245,0.06)",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  value: {
    color: "#ffffff",
    fontSize: "26px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.1,
  },
  label: {
    color: "#8a9bb0",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
  },
};

export default StatCard;
