import React, { useState } from "react";
import AppHeader from "../components/Header";
import Breadcrumb from "../components/Breadcrumb";
import DonationInfoCard from "../components/DonationInfoCard";
import DonationTimeline from "../components/DonationTimeline";
import DonationNotFound from "../components/DonationNotFound";
import TransitDetails from "../components/TransitDetails";
import { apiRequest, ApiError } from "../lib/api";

type StepStatus = "completed" | "active" | "pending";

interface TimelineStep {
  label: string;
  date?: string;
  status: StepStatus;
}

interface DonationData {
  codigo: string;
  donante: string;
  tipo: string;
  centro: string;
  fechaRegistro: string;
  estado: "recibido" | "en_transito" | "entregado";
  transit: {
    fechaEstimada: string;
    fechaEntregada: string;
    transportista: string;
    vehiculo: string;
    origen: string;
    destino: string;
  };
  steps: TimelineStep[];
}

type ViewState = "result" | "notFound" | "idle" | "loading" | "error";

const Trazabilidad: React.FC = () => {
  const [searchCode, setSearchCode] = useState("");
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [donation, setDonation] = useState<DonationData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mapear respuesta del backend a formato del componente
  const mapearDonacionAlUI = (data: any): DonationData => {
    const estadosUI = [
      { clave: "recibido", label: "Recibido" },
      { clave: "en_transito", label: "En tránsito" },
      { clave: "entregado", label: "Entregado" },
    ];

    const estadoActual = data.status ?? data.estado ?? "recibido";
    const indiceEstadoActual = estadosUI.findIndex((e) => e.clave === estadoActual);

    const steps: TimelineStep[] = estadosUI.map((estado, index) => ({
      label: estado.label,
      date: undefined,
      status:
        index < indiceEstadoActual
          ? "completed"
          : index === indiceEstadoActual
            ? "active"
            : "pending",
    }));

    const formatearFecha = (raw: unknown): string => {
      if (!raw || typeof raw !== "string") return "";
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return "";
      return d.toLocaleDateString("es-CR");
    };

    return {
      codigo: data.trackingId ?? data.codigo ?? "",
      donante: data.donorName ?? "Donante",
      tipo: data.donationTypeName ?? data.descripcion ?? "",
      centro: data.collectionCenterName ?? "Centro de acopio",
      fechaRegistro: formatearFecha(data.createdAt) || (data.fechaRegistro ?? ""),
      estado: estadoActual as DonationData["estado"],
      transit: {
        fechaEstimada: formatearFecha(data.estimatedDeliveryDate),
        fechaEntregada: formatearFecha(data.deliveredAt),
        transportista: data.transporterName ?? "Pendiente asignación",
        vehiculo: data.vehicleDescription ?? "Pendiente",
        origen: data.collectionCenterName ?? "Centro de acopio",
        destino: data.destination ?? "Pendiente",
      },
      steps,
    };
  };

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      setErrorMessage("Por favor ingresa un código de rastreo");
      setViewState("error");
      return;
    }

    setIsLoading(true);
    setViewState("loading");
    setErrorMessage("");

    try {
      const datos = await apiRequest<any>(`/donations/track/${searchCode.toUpperCase().trim()}`);
      const mappedDonation = mapearDonacionAlUI(datos);
      setDonation(mappedDonation);
      setViewState("result");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setDonation(null);
        setViewState("notFound");
        return;
      }
      setErrorMessage(err instanceof ApiError ? err.message : "No se pudo conectar con el servidor");
      setViewState("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setSearchCode("");
    setDonation(null);
    setErrorMessage("");
    setViewState("idle");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
  };

  return (
    <div style={styles.page}>
      <AppHeader
        title="SISTRA-TEC"
        subtitle="Trazabilidad de donaciones en tiempo real"
        showBack
        rightContent={
          <div style={styles.headerActions}>
            <button style={styles.outlineBtn} onClick={() => window.location.hash = "#/login"}>Iniciar sesión</button>
            <button style={styles.primaryBtn} onClick={() => window.location.hash = "#/register"}>Registrarme</button>
          </div>
        }
      />

      <main style={styles.main}>
        {/* RESULTADO ENCONTRADO */}
        {viewState === "result" && donation && (
          <section style={styles.section}>
            <Breadcrumb
              items={[
                { label: "Inicio", onClick: () => window.location.hash = "#/" },
                { label: "Rastrear donación" },
              ]}
            />
            <div style={styles.codeHeader}>
              <h2 style={styles.codeLabel}>Estado de tu donación</h2>
              <h1 style={styles.code}>{donation.codigo}</h1>
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
              {(donation.estado === "en_transito" || donation.estado === "entregado") && (
                <TransitDetails
                  estado={donation.estado}
                  fechaEstimada={donation.transit.fechaEstimada}
                  fechaEntregada={donation.transit.fechaEntregada}
                  transportista={donation.transit.transportista}
                  vehiculo={donation.transit.vehiculo}
                  origen={donation.transit.origen}
                  destino={donation.transit.destino}
                />
              )}
            </div>
          </section>
        )}

        {/* ESTADO: CARGANDO */}
        {viewState === "loading" && (
          <section style={styles.section}>
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Buscando tu donación...</p>
            </div>
          </section>
        )}

        {/* ESTADO: NO ENCONTRADO (Muestra tu componente DonationNotFound) */}
        {viewState === "notFound" && (
          <section style={styles.section}>
            <DonationNotFound onRetry={handleRetry} />
          </section>
        )}

        {/* ESTADO: ERROR EN EL SERVIDOR / CAMPO VACÍO */}
        {viewState === "error" && errorMessage && (
          <section style={styles.section}>
            <div style={styles.alertContainer}>
              <div style={styles.errorAlert}>{errorMessage}</div>
            </div>
          </section>
        )}

        {/* SECCIÓN DE BÚSQUEDA */}
        {(viewState === "idle" || viewState === "result" || viewState === "error" || viewState === "notFound") && (
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
                onKeyPress={handleKeyPress}
                style={styles.inlineInput}
                disabled={isLoading}
              />
              <button
                onClick={handleSearch}
                style={styles.inlineButton}
                disabled={isLoading}
              >
                {isLoading ? "Buscando..." : "Rastrear"}
              </button>
            </div>

            <span style={styles.searchHelper}>
              Tu código fue generado al registrar tu donación en el centro de acopio
            </span>
          </section>
        )}
      </main>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #0a0f14; }
        input::placeholder { color: #3a5060; }
        input:focus { outline: none; }
        input:disabled { opacity: 0.6; cursor: not-allowed; }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
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
  banner: {
    backgroundColor: "rgba(0,212,245,0.06)",
    border: "1px solid rgba(0,212,245,0.25)",
    borderRadius: "10px",
    padding: "14px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  bannerLine: {
    color: "#8a9bb0",
    fontSize: "12px",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  bannerDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#00d4f5",
    flexShrink: 0,
  },
  bannerDotCyan: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#0096C7",
    flexShrink: 0,
  },
  bannerDotGreen: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#16a34a",
    flexShrink: 0,
  },
  codeHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  codeLabel: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
  },
  code: {
    color: "#00d4f5",
    fontSize: "36px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.02em",
  },
  changeCode: {
    color: "#00d4f5",
    fontSize: "13px",
    fontWeight: "500",
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
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "60px 0",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #00d4f5",
    borderTop: "3px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  } as React.CSSProperties,
  loadingText: {
    color: "#8a9bb0",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
  },
  alertContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    marginTop: "16px",
  },
  errorAlert: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    color: "#F87171",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "14px",
    textAlign: "center",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    wordBreak: "break-word",
    width: "100%",
    maxWidth: "500px",
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
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
  },
  searchSubtitle: {
    color: "#8a9bb0",
    fontSize: "14px",
    fontWeight: "700",
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
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
  },
  inlineButton: {
    background: "#00d4f5",
    color: "#0a0f14",
    border: "none",
    padding: "0 30px",
    fontSize: "15px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  searchHelper: {
    color: "#5a7080",
    fontSize: "12px",
    fontWeight: "700",
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
};

export default Trazabilidad;