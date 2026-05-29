import React, { useState } from "react";
import AppHeader from "../components/Header"; // Ajusté las rutas asumiendo que están en components
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

// Definimos los campos válidos del formulario para mayor seguridad en TypeScript
interface FormState {
  nombre: string;
  correo: string;
  direccion: string;
  contrasena: string;
  confirmar: string;
}

const Register: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    correo: "",
    direccion: "",
    contrasena: "",
    confirmar: "",
  });

  // Tipamos correctamente el parámetro 'field' restringido a las llaves de FormState
  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    console.log("Formulario enviado:", form);
  };

  return (
    <div style={styles.page}>
      <AppHeader />
      <main style={styles.main}>
        <AuthCard
          title="Crear cuenta"
          subtitle="Regístrate para poder hacer una donación"
          footerText="¿Ya tienes una cuenta?"
          footerLinkText="Inicia sesión aquí"
          onClickFooterLink={() => console.log("Ir a login")} // CORREGIDO: Coincide con la prop de AuthCard
        >
          <InputField
            label="Nombre completo"
            placeholder="Ej: María García Solis"
            helperText="Tu nombre tal y como aparece en tu cédula"
            value={form.nombre}
            onChange={handleChange("nombre")}
          />
          <InputField
            label="Correo electrónico"
            placeholder="nombre@correo.com"
            helperText="Te enviaremos notificaciones a este correo"
            type="email"
            value={form.correo}
            onChange={handleChange("correo")}
          />
          <InputField
            label="Dirección exacta"
            placeholder="Ej: San José, Escazú, 200m norte de..."
            helperText="Ayuda a coordinar la logística de recolección"
            value={form.direccion}
            onChange={handleChange("direccion")}
          />
          <InputField
            label="Contraseña"
            placeholder="••••••••"
            helperText="Mínimo 8 carácteres, una mayúscula y un número"
            showToggle
            value={form.contrasena}
            onChange={handleChange("contrasena")}
          />
          <InputField
            label="Confirmar contraseña"
            placeholder="••••••••"
            helperText="La misma contraseña que acabas de ingresar"
            showToggle
            value={form.confirmar}
            onChange={handleChange("confirmar")}
          />
          <PrimaryButton label="Ingresar" onClick={handleSubmit} />
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
};

export default Register;