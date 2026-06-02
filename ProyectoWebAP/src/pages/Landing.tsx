import React from "react";
import AppHeader from "../components/Header";

const Landing: React.FC = () => {
  return (
    <div style={styles.page}>
      <AppHeader
        title="SISTRA-TEC"
        subtitle="Trazabilidad de donaciones en tiempo real"
        rightContent={
          <div style={styles.headerActions}>
            <button style={styles.outlineBtn} onClick={() => window.location.hash = "#/login"}>
              Iniciar sesión
            </button>
            <button style={styles.primaryBtn} onClick={() => window.location.hash = "#/register"}>
              Registrarme
            </button>
          </div>
        }
      />

      <main style={styles.main}>
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>
            Transparencia en cada <span style={styles.accent}>donación</span>
          </h1>
          <p style={styles.heroSubtitle}>
            SISTRA-TEC te permite rastrear el ciclo de vida completo de tu ayuda:
            desde que entregas una donación hasta que llega a quien más lo necesita.
          </p>
          <div style={styles.heroActions}>
            <button style={styles.heroPrimary} onClick={() => window.location.hash = "#/track"}>
              Rastrear una donación
            </button>
            <button style={styles.heroSecondary} onClick={() => window.location.hash = "#/register"}>
              Quiero donar
            </button>
          </div>
        </section>

        <section style={styles.steps}>
          <h2 style={styles.sectionTitle}>Ciclo de tu donación</h2>
          <div style={styles.stepsGrid}>
            <div style={styles.stepCard}>
              <div style={{ ...styles.stepIcon, borderColor: "#0e7c66", color: "#0e7c66" }}>1</div>
              <h3 style={styles.stepTitle}>Recibido</h3>
              <p style={styles.stepDesc}>La donación llega al centro de acopio y es registrada en el sistema.</p>
            </div>
            <div style={styles.stepCard}>
              <div style={{ ...styles.stepIcon, borderColor: "#00d4f5", color: "#00d4f5" }}>2</div>
              <h3 style={styles.stepTitle}>Clasificado</h3>
              <p style={styles.stepDesc}>El personal clasifica y prepara los productos para su traslado.</p>
            </div>
            <div style={styles.stepCard}>
              <div style={{ ...styles.stepIcon, borderColor: "#b9770e", color: "#b9770e" }}>3</div>
              <h3 style={styles.stepTitle}>En tránsito</h3>
              <p style={styles.stepDesc}>Un transportista lleva la donación hacia su destino final.</p>
            </div>
            <div style={styles.stepCard}>
              <div style={{ ...styles.stepIcon, borderColor: "#16a34a", color: "#16a34a" }}>4</div>
              <h3 style={styles.stepTitle}>Entregado</h3>
              <p style={styles.stepDesc}>La donación llega al beneficiario y el ciclo se completa.</p>
            </div>
          </div>
        </section>

        <section style={styles.cta}>
          <h2 style={styles.ctaTitle}>¿Listo para hacer la diferencia?</h2>
          <p style={styles.ctaDesc}>
            Regístrate y recibe un código único para rastrear cada donación que realices.
          </p>
          <button style={styles.ctaBtn} onClick={() => window.location.hash = "#/register"}>
            Crear cuenta gratuita
          </button>
        </section>
      </main>

      <footer style={styles.footer}>
        <span>SISTRA-TEC © 2026 — Trazabilidad de donaciones en tiempo real</span>
      </footer>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#04080E",
    backgroundImage:
      "radial-gradient(ellipse at 30% 20%, rgba(0,80,100,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0,50,80,0.1) 0%, transparent 50%)",
    display: "flex",
    flexDirection: "column",
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
    fontWeight: "700",
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
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "80px",
    padding: "120px 48px 60px",
    maxWidth: "1000px",
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
    textAlign: "center",
    padding: "40px 0",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: "44px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.2,
    maxWidth: "640px",
    margin: 0,
  },
  accent: {
    color: "#00d4f5",
  },
  heroSubtitle: {
    color: "#8a9bb0",
    fontSize: "17px",
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.6,
    maxWidth: "520px",
    margin: 0,
  },
  heroActions: {
    display: "flex",
    gap: "14px",
    marginTop: "12px",
  },
  heroPrimary: {
    padding: "14px 32px",
    backgroundColor: "#00d4f5",
    color: "#0a0f14",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  heroSecondary: {
    padding: "14px 32px",
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "1px solid #3a5060",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  steps: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
    margin: 0,
  },
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  stepCard: {
    backgroundColor: "#1A1D23",
    border: "1px solid #232830",
    borderRadius: "14px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
    textAlign: "center",
  },
  stepIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
  },
  stepTitle: {
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    margin: 0,
  },
  stepDesc: {
    color: "#8a9bb0",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.5,
    margin: 0,
  },
  cta: {
    backgroundColor: "#1A1D23",
    border: "1px solid #232830",
    borderRadius: "16px",
    padding: "48px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignItems: "center",
    textAlign: "center",
  },
  ctaTitle: {
    color: "#ffffff",
    fontSize: "26px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    margin: 0,
  },
  ctaDesc: {
    color: "#8a9bb0",
    fontSize: "15px",
    fontFamily: "'Inter', sans-serif",
    maxWidth: "440px",
    margin: 0,
  },
  ctaBtn: {
    padding: "14px 36px",
    backgroundColor: "#00d4f5",
    color: "#0a0f14",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    marginTop: "8px",
  },
  footer: {
    padding: "20px 48px",
    textAlign: "center",
    color: "#5a7080",
    fontSize: "12px",
    fontFamily: "'Inter', sans-serif",
    borderTop: "1px solid #1a2530",
  },
};

export default Landing;
