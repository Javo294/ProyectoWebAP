import React, { useState } from "react";
import AppHeader from "../components/Header";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { apiRequest, mensajeDeError } from "../lib/api";
import { validarReglasPassword } from "../lib/sistratec";

type Paso = "email" | "codigo" | "nueva" | "ok";

const ForgotPassword: React.FC = () => {
  const [paso, setPaso] = useState<Paso>("email");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [cargando, setCargando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const [infoMensaje, setInfoMensaje] = useState<string | null>(null);

  const limpiarMensajes = () => {
    setErrorMensaje(null);
    setInfoMensaje(null);
  };

  const enviarCodigo = async () => {
    limpiarMensajes();
    if (!email.trim()) {
      setErrorMensaje("Ingresa tu correo electrónico.");
      return;
    }
    setCargando(true);
    try {
      await apiRequest<{ ttlMinutos: number }>("/auth/forgot-password", {
        method: "POST",
        body: { email: email.trim() },
      });
      setInfoMensaje("Si el correo está registrado, te enviamos un código de 6 dígitos. Revisá tu bandeja de entrada.");
      setPaso("codigo");
    } catch (err) {
      setErrorMensaje(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  };

  const verificarCodigo = async () => {
    limpiarMensajes();
    if (!/^\d{6}$/.test(code)) {
      setErrorMensaje("El código debe tener exactamente 6 dígitos.");
      return;
    }
    setCargando(true);
    try {
      await apiRequest("/auth/verify-reset-code", {
        method: "POST",
        body: { email: email.trim(), code },
      });
      setPaso("nueva");
    } catch (err) {
      setErrorMensaje(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  };

  const reenviarCodigo = async () => {
    limpiarMensajes();
    setCargando(true);
    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: { email: email.trim() },
      });
      setInfoMensaje("Te enviamos un nuevo código a tu correo.");
    } catch (err) {
      setErrorMensaje(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  };

  const restablecerPassword = async () => {
    limpiarMensajes();
    const reglas = validarReglasPassword(newPassword);
    if (reglas) {
      setErrorMensaje(reglas);
      return;
    }
    if (!confirmPassword) {
      setErrorMensaje("Confirma tu nueva contraseña.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMensaje("La nueva contraseña y su confirmación no coinciden.");
      return;
    }
    setCargando(true);
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: {
          email: email.trim(),
          code,
          newPassword,
          confirmPassword,
        },
      });
      setPaso("ok");
    } catch (err) {
      setErrorMensaje(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, accion: () => void) => {
    if (e.key === "Enter" && !cargando) accion();
  };

  return (
    <div style={styles.page}>
      <AppHeader showBack onBack={() => { window.location.hash = "#/login"; }} />
      <main style={styles.main}>
        {paso === "email" && (
          <AuthCard
            title="Olvidé mi contraseña"
            subtitle="Ingresa tu correo y te enviaremos un código para restablecerla"
            footerText="¿Recordaste tu contraseña?"
            footerLinkText="Inicia sesión aquí"
            onClickFooterLink={() => { window.location.hash = "#/login"; }}
          >
            <InputField
              label="Correo electrónico"
              placeholder="tu.correo@example.com"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errorMensaje) setErrorMensaje(null); }}
              helperText="El correo con el que te registraste."
            />
            {errorMensaje && <div style={styles.errorAlert}>{errorMensaje}</div>}
            <div onKeyDown={(e) => handleKeyPress(e as unknown as React.KeyboardEvent<HTMLInputElement>, enviarCodigo)}>
              <PrimaryButton label={cargando ? "Enviando..." : "Enviar código"} onClick={enviarCodigo} disabled={cargando} />
            </div>
          </AuthCard>
        )}

        {paso === "codigo" && (
          <AuthCard
            title="Ingresa tu código"
            subtitle={`Te enviamos un código de 6 dígitos a ${email}`}
            footerText="¿No te llegó?"
            footerLinkText="Reenviar código"
            onClickFooterLink={reenviarCodigo}
          >
            <InputField
              label="Código de verificación"
              placeholder="123456"
              value={code}
              onChange={(e) => {
                const soloDigitos = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCode(soloDigitos);
                if (errorMensaje) setErrorMensaje(null);
              }}
              helperText="6 dígitos numéricos. El código expira en 15 minutos."
            />
            {infoMensaje && <div style={styles.infoAlert}>{infoMensaje}</div>}
            {errorMensaje && <div style={styles.errorAlert}>{errorMensaje}</div>}
            <PrimaryButton label={cargando ? "Verificando..." : "Verificar código"} onClick={verificarCodigo} disabled={cargando} />
            <span style={styles.cambiarCorreo} onClick={() => { setPaso("email"); limpiarMensajes(); setCode(""); }}>
              ¿Te equivocaste de correo? Cambiarlo
            </span>
          </AuthCard>
        )}

        {paso === "nueva" && (
          <AuthCard
            title="Nueva contraseña"
            subtitle="Crea una contraseña nueva para tu cuenta"
          >
            <InputField
              label="Nueva contraseña"
              placeholder="••••••••"
              showToggle
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); if (errorMensaje) setErrorMensaje(null); }}
              helperText="Mínimo 8 caracteres, una letra mayúscula y un número."
            />
            <InputField
              label="Confirmar nueva contraseña"
              placeholder="••••••••"
              showToggle
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); if (errorMensaje) setErrorMensaje(null); }}
              helperText="Repite la contraseña para confirmar."
            />
            {errorMensaje && <div style={styles.errorAlert}>{errorMensaje}</div>}
            <PrimaryButton label={cargando ? "Actualizando..." : "Guardar nueva contraseña"} onClick={restablecerPassword} disabled={cargando} />
          </AuthCard>
        )}

        {paso === "ok" && (
          <AuthCard
            title="¡Contraseña actualizada!"
            subtitle="Ya podés iniciar sesión con tu nueva contraseña"
          >
            <div style={styles.successAlert}>
              Tu contraseña se restableció correctamente. Por tu seguridad, no compartas tu nueva contraseña con nadie.
            </div>
            <PrimaryButton label="Ir al inicio de sesión" onClick={() => { window.location.hash = "#/login"; }} />
          </AuthCard>
        )}
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#04080E",
    backgroundImage:
      "radial-gradient(ellipse at 20% 80%, rgba(0,80,100,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,50,80,0.12) 0%, transparent 60%)",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 24px 40px",
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
  },
  infoAlert: {
    backgroundColor: "rgba(0,212,245,0.10)",
    color: "#7ce6ff",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "13px",
    textAlign: "center",
    border: "1px solid rgba(0,212,245,0.35)",
  },
  successAlert: {
    backgroundColor: "rgba(22,163,74,0.15)",
    color: "#3fd17e",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "14px",
    textAlign: "center",
    border: "1px solid rgba(22,163,74,0.4)",
    lineHeight: 1.5,
  },
  cambiarCorreo: {
    color: "#00d4f5",
    fontSize: "12px",
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
    cursor: "pointer",
    marginTop: 4,
  },
};

export default ForgotPassword;
