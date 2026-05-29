import React, { useState } from "react";
import AppHeader from "../components/Header";
import Breadcrumb from "../components/Breadcrumb";
import DonationInfoCard from "../components/DonationInfoCard";
import DonationTimeline from "../components/DonationTimeline";
import DonationNotFound from "../components/DonationNotFound";
import TransitDetails from "../components/TransitDetails";

// Definimos el tipo estricto para los estados de la línea de tiempo
type StepStatus = "completed" | "active" | "pending";

interface TimelineStep {
  label: string;
  date?: string;
  status: StepStatus;
}

// Estructura completa de los datos de donación para TypeScript
interface DonationData {
  codigo: string;
  donante: string;
  tipo: string;
  centro: string;
  fechaRegistro: string;
  transit: {
    date: string;
    transportista: string;
    vehiculo: string;
    destino: string;
  };
  steps: TimelineStep[];
}

// Mock de donación encontrada
const mockDonation: DonationData = {
  codigo: "DON-2025-001",
  donante: "Juan P. Zuñiga",
  tipo: "Alimentos",
  centro: "Cruz Roja Cartago",
  fechaRegistro: "02/07/2025",
  transit: {
    date: "18/05/2025",
    transportista: "Carlos M.",
    vehiculo: "Camión #4",
    destino: "Hatillo, San José",
  },
  steps: [
    { label: "Recibido", date: "02/05/2025 9:14 am", status: "completed" },
    { label: "En tránsito", date: "18/05/2025 12:24 am", status: "active" },
    { label: "Entregado", status: "pending" },
  ],
};

type ViewState = "result" | "notFound" | "idle";

const Trazabilidad: React.FC = () => {
  const [searchCode, setSearchCode] = useState("");
  const [viewState, setViewState] = useState<ViewState>("result");
  const [donation] = useState<DonationData>(mockDonation);

  const handleSearch = () => {
    if (searchCode.trim().toUpperCase() === mockDonation.codigo) {
      setViewState("result");
    } else {
      setViewState("notFound");
    }
  };

  const handleRetry = () => {
    setSearchCode("");
    setViewState("idle");
  };

  return (
    <div style={styles.page}>
      <AppHeader
        title="SISTRA-TEC"
        subtitle="Trazabilidad de donaciones en tiempo real"
        rightContent={
          <div style={styles.headerActions}>
            <button style={styles.outlineBtn}>Iniciar sesión</button>
            <button style={styles.primaryBtn}>Registrarme</button>
          </div>
        }
      />

      <main style={styles.main}>
        {/* 1. ESTADO: RESULTADO ENCONTRADO */}
        {viewState === "result" && (
          <section style={styles.section}>
            <Breadcrumb
              items={[
                { label: "Inicio", onClick: () => console.log("Ir a inicio") },
                { label: "Rastrear donación" },
              ]}
            />
            <div style={styles.codeHeader}>
              <h2 style={styles.codeLabel}>Estado de tu donación</h2>
              <h1 style={styles.code}>
                {donation.codigo}
              </h1>
              <span style={styles.changeCode} onClick={handleRetry}>
                ¿No es tu código? Presiona aquí para buscar otro
              </span>
            </div>

            <div style={styles.card}>
              <DonationInfoCard
                donante={donation.donante}
                tipo={donation.tipo}
                centro={donation.centro}
                fechaRegistro={donation.fechaRegistro}
              />
              <DonationTimeline steps={donation.steps} />
              <TransitDetails
                date={donation.transit.date}
                transportista={donation.transit.transportista}
                vehiculo={donation.transit.vehiculo}
                destino={donation.transit.destino}
              />
            </div>
          </section>
        )}

        {/* 2. SECCIÓN DE BÚSQUEDA */}
        {(viewState === "idle" || viewState === "result") && (
          <section style={styles.searchSection}>
            <h2 style={styles.searchTitle}>Rastrear otra donación</h2>
            <p style={styles.searchSubtitle}>
              Ingresa tu código de seguimiento para ver el estado en tiempo real. No necesitas cuenta
            </p>
            
            <div style={styles.searchBar}>
              <input
                type="text"
                placeholder="Ingresa tu código (ej. DON-2026-XXXX)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                style={styles.inlineInput}
              />
              <button onClick={handleSearch} style={styles.inlineButton}>
                Rastrear
              </button>
            </div>

            <span style={styles.searchHelper}>
              Tu código fue generado al registrar tu donación en el centro de acopio
            </span>
          </section>
        )}

        {/* 3. ESTADO: NO ENCONTRADO */}
        {viewState === "notFound" && (
          <section style={styles.section}>
            <DonationNotFound onRetry={handleRetry} />
          </section>
        )}
      </main>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #0a0f14; }
        input::placeholder { color: #3a5060; }
        input:focus { outline: none; }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#04080E",
    backgroundImage:
      "radial-gradient(ellipse at 20% 80%, rgba(0,80,100,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,50,80,0.1) 0%, transparent 60%)",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "60px",
    padding: "100px 48px 60px",
    maxWidth: "900px",
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  codeHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  codeLabel: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700", // Inter Bold
    fontFamily: "'Inter', sans-serif",
  },
  code: {
    color: "#00d4f5",
    fontSize: "36px",
    fontWeight: "700", // Inter Bold
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.02em",
  },
  changeCode: {
    color: "#00d4f5",
    fontSize: "13px",
    fontWeight: "500", // Inter Bold
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    marginTop: "4px",
    width: "fit-content",
  },
  card: {
    border: "1px solid #00D4FF",
    borderRadius: "16px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    backgroundColor: "#1A1D23",
    boxSizing: "border-box",
  },
  searchSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "60px 0",
    borderTop: "1px solid #1a2530",
  },
  searchTitle: {
    color: "#ffffff",
    fontSize: "26px",
    fontWeight: "700", // Inter Bold
    fontFamily: "'Inter', sans-serif",
  },
  searchSubtitle: {
    color: "#8a9bb0",
    fontSize: "14px",
    fontWeight: "700", // Inter Bold
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
    maxWidth: "480px",
    lineHeight: "1.5",
  },
  searchBar: {
    display: "flex",
    width: "100%",
    maxWidth: "560px",
    backgroundColor: "#101922",
    border: "1px solid #2e3f50",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  inlineInput: {
    flex: 1,
    background: "none",
    border: "none",
    padding: "16px 20px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "500", // Inter Bold
    fontFamily: "'Inter', sans-serif",
    outline: "none",
  },
  inlineButton: {
    background: "#00d4f5",
    color: "#0a0f14",
    border: "none",
    padding: "0 30px",
    fontSize: "15px",
    fontWeight: "700", // Inter Bold
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  searchHelper: {
    color: "#5a7080",
    fontSize: "12px",
    fontWeight: "700", // Inter Bold
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
    marginTop: "10px",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  outlineBtn: {
    background: "none",
    border: "1px solid #3a5060",
    color: "#ffffff",
    padding: "8px 18px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "700", // Inter Bold
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  primaryBtn: {
    background: "#00d4f5",
    border: "none",
    color: "#0a0f14",
    padding: "8px 18px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "700", // Inter Bold
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
};

export default Trazabilidad;