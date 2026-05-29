import React from "react";

interface ModalOverlayProps {
  onClose: () => void;
  children: React.ReactNode;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClose, children }) => {
  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  modal: {
    backgroundColor: "#1A1D23",
    borderRadius: "16px",
    padding: "36px 40px",
    width: "100%",
    maxWidth: "520px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    boxShadow: "0 16px 64px rgba(0,0,0,0.6)",
  },
};

export default ModalOverlay;