import React, { useEffect, useState } from "react";
import ModalOverlay from "../components/ModalOverlay";
import InfoBanner from "../components/InfoBanner";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import DetailGrid from "../components/DetailGrid";
import StatusBadge from "../components/StatusBadge";
import { transportistasService, donacionesService, type DonacionAdmin, type Usuario } from "../lib/sistratec";
import { mensajeDeError } from "../lib/api";

interface AsignarTransportistaModalProps {
  donacion: DonacionAdmin;
  onAsignado: () => void;
  onCancel: () => void;
}

const InfoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const WarningIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const AsignarTransportistaModal: React.FC<AsignarTransportistaModalProps> = ({ donacion, onAsignado, onCancel }) => {
  const [transportistas, setTransportistas] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [transporterId, setTransporterId] = useState("");
  const [destination, setDestination] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    transportistasService
      .listar()
      .then((datos) => {
        if (!activo) return;
        setTransportistas(datos.filter((t) => t.isActive));
        setCargando(false);
      })
      .catch((err) => {
        if (!activo) return;
        setErrorCarga(mensajeDeError(err));
        setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  const formularioValido = transporterId !== "" && destination.trim().length >= 3;

  const asignar = async () => {
    setError(null);
    setEnviando(true);
    try {
      await donacionesService.asignar(donacion.id, transporterId, destination.trim());
      onAsignado();
    } catch (err) {
      setError(mensajeDeError(err));
      setEnviando(false);
    }
  };

  return (
    <ModalOverlay onClose={onCancel}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Asignar transportista</h2>
          <span style={styles.subtitle}>Donación seleccionada</span>
        </div>
        <button style={styles.closeBtn} onClick={onCancel} aria-label="Cerrar">
          ×
        </button>
      </div>

      <div style={styles.badgeRow}>
        <span style={styles.codigo}>{donacion.trackingId}</span>
        <StatusBadge variant={donacion.estado} />
      </div>

      <DetailGrid
        fields={[
          { label: "Tipo de bien", value: donacion.tipo },
          { label: "Donante", value: donacion.donante },
          { label: "Origen", value: donacion.origen },
          { label: "Descripción", value: donacion.descripcion },
        ]}
      />

      <InfoBanner
        variant="info"
        icon={<InfoIcon />}
        title="¿Qué sucede al asignar?"
        description="La donación quedará asignada al transportista y disponible para que la marque en tránsito. Esta acción queda registrada en el historial de trazabilidad."
      />

      <div style={styles.field}>
        <label style={styles.label} htmlFor="select-transportista">
          Seleccionar transportista
        </label>
        <select
          id="select-transportista"
          value={transporterId}
          onChange={(e) => setTransporterId(e.target.value)}
          disabled={cargando || transportistas.length === 0}
          style={styles.select}
        >
          <option value="">
            {cargando ? "Cargando transportistas..." : "Elige un transportista disponible"}
          </option>
          {transportistas.map((t) => (
            <option key={t.id} value={t.id}>
              {t.fullName}
              {t.vehicle ? ` · ${t.vehicle}` : ""}
            </option>
          ))}
        </select>
        <span style={styles.helper}>Solo se muestran los transportistas activos de tu centro de acopio.</span>
      </div>

      <InputField
        label="Destino de la entrega"
        placeholder="Ej: Albergue municipal de Alajuelita"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        helperText="Indica dónde debe entregar el transportista esta donación."
      />

      {!cargando && transportistas.length === 0 && !errorCarga && (
        <InfoBanner
          variant="warning"
          icon={<WarningIcon />}
          title="No hay transportistas disponibles"
          description="Primero agrega un transportista activo a tu centro de acopio para poder asignar esta donación."
        />
      )}

      {errorCarga && (
        <InfoBanner variant="warning" icon={<WarningIcon />} title="Error al cargar datos" description={errorCarga} />
      )}

      {error && (
        <InfoBanner variant="warning" icon={<WarningIcon />} title="No pudimos asignar" description={error} />
      )}

      <div style={styles.actions}>
        <button style={styles.cancelBtn} onClick={onCancel} disabled={enviando}>
          Cancelar
        </button>
        <div style={styles.confirmWrap}>
          <PrimaryButton
            label={enviando ? "Asignando..." : "Asignar transportista"}
            onClick={asignar}
            disabled={!formularioValido || enviando}
          />
        </div>
      </div>
    </ModalOverlay>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    margin: 0,
  },
  subtitle: {
    color: "#8a9bb0",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#8a9bb0",
    fontSize: "22px",
    cursor: "pointer",
    lineHeight: 1,
  },
  badgeRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  codigo: {
    color: "#00d4f5",
    fontSize: "16px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "0.03em",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    color: "#EFEFEF",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
  },
  select: {
    width: "100%",
    backgroundColor: "#13161C",
    border: "1px solid #666666",
    borderRadius: "6px",
    padding: "11px 14px",
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
    color: "#EFEFEF",
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  helper: {
    color: "#8B95A1",
    fontSize: "12px",
    fontFamily: "'Inter', sans-serif",
  },
  actions: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
  },
  cancelBtn: {
    flex: "0 0 auto",
    padding: "14px 24px",
    backgroundColor: "transparent",
    color: "#cdd6e0",
    border: "1px solid #2e3f50",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  confirmWrap: {
    flex: 1,
  },
};

export default AsignarTransportistaModal;
