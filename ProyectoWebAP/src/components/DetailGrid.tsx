import React from "react";

interface DetailField {
  label: string;
  value: string;
}

interface DetailGridProps {
  fields: DetailField[];
}

const DetailGrid: React.FC<DetailGridProps> = ({ fields }) => {
  return (
    <div style={styles.grid}>
      {fields.map((field, i) => (
        <div key={i} style={styles.cell}>
          <span style={styles.label}>{field.label}</span>
          <span style={styles.value}>{field.value}</span>
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  cell: {
    borderRadius: "8px",
    padding: "14px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    backgroundColor: "#111318",
  },
  label: {
    color: "#8B95A1",
    fontSize: "12px",
    fontFamily: "'Inter', sans-serif",
  },
  value: {
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
  },
};

export default DetailGrid;