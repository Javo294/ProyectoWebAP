import React, { useState } from "react";
import AppHeader from "../components/Header";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { setSession } from "../lib/session";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setErrorMensaje("Por favor, completa todos los campos.");
      return;
    }

    setCargando(true);
    setErrorMensaje(null);

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || "Credenciales inválidas.");
      }

      setSession(data.datos.accessToken, data.datos.usuario, data.datos.refreshToken);

      const role = data.datos.usuario.role;
      if (role === "admin") window.location.hash = "#/admin";
      else if (role === "transporter") window.location.hash = "#/transportista";
      else if (role === "donor") window.location.hash = "#/donante";
      else window.location.hash = "#/";

      window.location.reload();
    } catch (err: any) {
      setErrorMensaje(err.message || "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.page}>
      <AppHeader showBack onBack={() => { window.location.hash = "#/"; }} />
      <main style={styles.main}>
        <AuthCard
          title="Iniciar sesión"
          subtitle="Ingresa a tu cuenta de SISTRA-TEC"
          footerText="¿No tienes cuenta?"
          footerLinkText="Regístrate aquí"
          onClickFooterLink={() => window.location.hash = "#/register"}
        >
          <InputField
            label="Correo electrónico"
            placeholder="tu.correo@example.com"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMensaje) setErrorMensaje(null);
            }}
            helperText="El correo que usaste al registrarte."
          />
          <InputField
            label="Contraseña"
            placeholder="••••••••"
            showToggle
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMensaje) setErrorMensaje(null);
            }}
            helperText="Tu contraseña personal."
          />

          <PrimaryButton
            label={cargando ? "Ingresando..." : "Ingresar"}
            onClick={handleSubmit}
          />

          <span style={styles.forgotLink} onClick={() => { window.location.hash = "#/forgot-password"; }}>
            ¿Olvidaste tu contraseña?
          </span>

          {errorMensaje && (
            <div style={styles.errorAlert}>{errorMensaje}</div>
          )}
        </AuthCard>
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
  forgotLink: {
    color: "#00d4f5",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
    cursor: "pointer",
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
};

export default Login;
