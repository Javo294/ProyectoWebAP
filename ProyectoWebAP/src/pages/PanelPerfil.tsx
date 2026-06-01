import React, { useEffect, useState } from "react";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import InfoBanner from "../components/InfoBanner";
import { perfilService, type Usuario } from "../lib/sistratec";
import { ApiError } from "../lib/api";

interface PanelPerfilProps {
  mostrarVehiculo?: boolean;
}

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const InfoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const PanelPerfil: React.FC<PanelPerfilProps> = ({ mostrarVehiculo = false }) => {
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordRepetir, setPasswordRepetir] = useState("");
  const [cambiandoPass, setCambiandoPass] = useState(false);
  const [mensajePass, setMensajePass] = useState<string | null>(null);
  const [errorPass, setErrorPass] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    perfilService
      .obtener()
      .then((datos) => {
        if (!activo) return;
        setPerfil(datos);
        setFullName(datos.fullName);
        setEmail(datos.email);
        setPhone(datos.phone || "");
        setVehicle(datos.vehicle || "");
      })
      .catch((err) => {
        if (!activo) return;
        setError(err instanceof ApiError ? err.message : "No pudimos cargar tu perfil.");
      });
    return () => {
      activo = false;
    };
  }, []);

  const guardarPerfil = async () => {
    setMensaje(null);
    setError(null);
    setGuardando(true);
    try {
      const datos: Partial<Pick<Usuario, "fullName" | "email" | "phone" | "vehicle">> = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      };
      if (mostrarVehiculo) datos.vehicle = vehicle.trim() || undefined;
      const actualizado = await perfilService.actualizar(datos);
      setPerfil(actualizado);
      setMensaje("Tus datos se actualizaron correctamente.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos guardar tus datos. Están a salvo, intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarPassword = async () => {
    setMensajePass(null);
    setErrorPass(null);

    if (passwordNueva !== passwordRepetir) {
      setErrorPass("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    setCambiandoPass(true);
    try {
      await perfilService.cambiarPassword(passwordActual, passwordNueva);
      setMensajePass("Tu contraseña se actualizó correctamente.");
      setPasswordActual("");
      setPasswordNueva("");
      setPasswordRepetir("");
    } catch (err) {
      setErrorPass(err instanceof ApiError ? err.message : "No pudimos cambiar tu contraseña. Intenta de nuevo.");
    } finally {
      setCambiandoPass(false);
    }
  };

  const passwordValida = passwordActual.length > 0 && passwordNueva.length >= 8 && passwordRepetir.length > 0;

  return (
    <div style={styles.contenedor}>
      <div style={styles.panel}>
        <h2 style={styles.panelTitle}>Mi perfil</h2>
        <span style={styles.panelDesc}>Actualiza tus datos de contacto.</span>

        <div style={styles.form}>
          <InputField label="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <InputField label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField
            label="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            helperText="8 dígitos, sin espacios."
          />
          {mostrarVehiculo && (
            <InputField
              label="Vehículo"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              helperText="Tipo de vehículo y placa."
            />
          )}
          <p style={styles.nota}>Centro de acopio asignado: #{perfil?.collectionCenterId ?? "—"}</p>
        </div>

        {mensaje && <InfoBanner variant="info" icon={<CheckIcon />} title="Guardado" description={mensaje} />}
        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.btnWrap}>
          <PrimaryButton label={guardando ? "Guardando..." : "Guardar cambios"} onClick={guardarPerfil} disabled={guardando} />
        </div>
      </div>

      <div style={styles.panel}>
        <h2 style={styles.panelTitle}>Cambiar contraseña</h2>
        <span style={styles.panelDesc}>Por seguridad, te pediremos tu contraseña actual.</span>

        <InfoBanner
          variant="info"
          icon={<InfoIcon />}
          title="¿Por qué pedimos la contraseña actual?"
          description="Es una verificación de seguridad para confirmar que eres tú quien hace el cambio."
        />

        <div style={styles.form}>
          <InputField label="Contraseña actual" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} showToggle />
          <InputField
            label="Nueva contraseña"
            value={passwordNueva}
            onChange={(e) => setPasswordNueva(e.target.value)}
            showToggle
            helperText="Mínimo 8 caracteres, con al menos una mayúscula y un número."
          />
          <InputField label="Repetir nueva contraseña" value={passwordRepetir} onChange={(e) => setPasswordRepetir(e.target.value)} showToggle />
        </div>

        {mensajePass && <InfoBanner variant="info" icon={<CheckIcon />} title="Contraseña actualizada" description={mensajePass} />}
        {errorPass && <div style={styles.errorBox}>{errorPass}</div>}

        <div style={styles.btnWrap}>
          <PrimaryButton
            label={cambiandoPass ? "Actualizando..." : "Actualizar contraseña"}
            onClick={cambiarPassword}
            disabled={!passwordValida || cambiandoPass}
          />
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  contenedor: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  panel: {
    backgroundColor: "#1A1D23",
    border: "1px solid #232830",
    borderRadius: "14px",
    padding: "22px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  panelTitle: {
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "700",
    fontFamily: "'Inter', sans-serif",
    margin: 0,
  },
  panelDesc: {
    color: "#8a9bb0",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
    marginTop: "-10px",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  nota: {
    color: "#8a9bb0",
    fontSize: "12px",
    fontFamily: "'Inter', sans-serif",
    margin: 0,
  },
  errorBox: {
    backgroundColor: "rgba(184,134,11,0.10)",
    border: "1px solid #b8860b",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "#f0d488",
    fontSize: "13px",
    fontFamily: "'Inter', sans-serif",
  },
  btnWrap: { marginTop: "4px" },
};

export default PanelPerfil;
