import React, { useState } from "react";
import AppHeader from "../components/Header"; 
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

// Esquema exacto que espera recibir el backend
interface FormState {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const [exitoMensaje, setExitoMensaje] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errorMensaje) setErrorMensaje(null);
    if (exitoMensaje) setExitoMensaje(null);
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    // 1. Validar que no haya campos vacíos
    if (!form.fullName || !form.email || !form.phone || !form.address || !form.password || !form.confirmPassword) {
      setErrorMensaje("Por favor, rellena todos los campos.");
      return;
    }

    // 2. Validar que el teléfono tenga exactamente 8 números
    const regexTelefono = /^[0-9]{8}$/;
    if (!regexTelefono.test(form.phone)) {
      setErrorMensaje("El teléfono debe tener exactamente 8 dígitos numéricos (Ej: 88881234).");
      return;
    }

    // 3. Validar Contraseña Estricta: Mínimo 8 caracteres, una mayúscula y un número
    const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regexPassword.test(form.password)) {
      setErrorMensaje("La contraseña debe tener mínimo 8 caracteres, incluir una letra mayúscula y al menos un número.");
      return;
    }

    // 4. Validar que ambas contraseñas coincidan
    if (form.password !== form.confirmPassword) {
      setErrorMensaje("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);
    setErrorMensaje(null);
    setExitoMensaje(null);

    try {
      // Petición POST al backend
      const response = await fetch("http://localhost:3000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          password: form.password,
          confirmPassword: form.confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Objeto de error recibido del backend:", data);

        if (data.error && data.error.detalle) {
          const detalleTexto = typeof data.error.detalle === 'object' 
            ? JSON.stringify(data.error.detalle) 
            : data.error.detalle;
          
          throw new Error(`${data.mensaje || 'Error'}: ${detalleTexto}`);
        }

        throw new Error(data.mensaje || "Validación fallida en el servidor.");
      }

      console.log("¡Usuario registrado en Neon con éxito!", data);
      
      // Asignamos el mensaje de éxito
      setExitoMensaje("¡Cuenta creada con éxito, dirigite al inicio de sesión para ingresar!");
      
      // Resetear el formulario tras el éxito
      setForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
      });

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
          title="Crear cuenta"
          subtitle="Regístrate para poder hacer una donación"
          footerText="¿Ya tienes una cuenta?"
          footerLinkText="Inicia sesión aquí"
          onClickFooterLink={() => { window.location.hash = "#/login"; }}
        >
          <InputField
            label="Nombre completo"
            placeholder="Ej: María Fernández Solís"
            helperText="Tu nombre tal y como aparece en tu cédula"
            value={form.fullName}
            onChange={handleChange("fullName")}
          />
          <InputField
            label="Correo electrónico"
            placeholder="maria.fernandez@example.com"
            helperText="Te enviaremos notificaciones a este correo"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
          />
          <InputField
            label="Teléfono Celular"
            placeholder="Ej: 88881234"
            helperText="Formato de 8 números sin guiones"
            type="tel"
            value={form.phone}
            onChange={handleChange("phone")}
          />
          <InputField
            label="Dirección exacta"
            placeholder="Ej: San José, 100m norte del parque central"
            helperText="Ayuda a coordinar la logística de recolección"
            value={form.address}
            onChange={handleChange("address")}
          />
          <InputField
            label="Contraseña"
            placeholder="••••••••"
            helperText="Mínimo 8 caracteres, una mayúscula y un número"
            showToggle
            value={form.password}
            onChange={handleChange("password")}
          />
          <InputField
            label="Confirmar contraseña"
            placeholder="••••••••"
            helperText="Repita la contraseña exacta"
            showToggle
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
          />
          
          <PrimaryButton 
            label={cargando ? "Registrando..." : "Ingresar"} 
            onClick={handleSubmit} 
          />

          <div style={styles.alertContainer}>
            {/* Si falta algo o falla, muestra el error en rojo aquí */}
            {errorMensaje && <div style={styles.errorAlert}>{errorMensaje}</div>}

            {/* Si todo se creó bien, muestra el éxito en verde aquí */}
            {exitoMensaje && <div style={styles.successAlert}>{exitoMensaje}</div>}
          </div>

        </AuthCard>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
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
  alertContainer: {
    marginTop: "16px", // Espaciado superior para separarlo bien del botón
  },
  errorAlert: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    color: "#F87171",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "14px",
    textAlign: "center",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    wordBreak: "break-word"
  },
  successAlert: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    color: "#34D399",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "14px",
    textAlign: "center",
    border: "1px solid rgba(16, 185, 129, 0.4)",
    wordBreak: "break-word",
    fontWeight: "500"
  }
};

export default Register;