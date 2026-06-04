import React from "react";
import { clearSession, type UsuarioSesion } from "../lib/session";

export interface ItemNav {
  clave: string;
  etiqueta: string;
  icono: React.ReactNode;
}

interface DashboardLayoutProps {
  usuario: UsuarioSesion | null;
  items: ItemNav[];
  activo: string;
  onSeleccionar: (clave: string) => void;
  titulo: string;
  subtitulo: string;
  children: React.ReactNode;
  onCerrarSesion?: () => void;
}

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  usuario,
  items,
  activo,
  onSeleccionar,
  titulo,
  subtitulo,
  children,
  onCerrarSesion,
}) => {
  const cerrarSesion = () => {
    clearSession();
    if (onCerrarSesion) onCerrarSesion();
    window.location.hash = "#/login";
    window.location.reload();
  };

  const iniciales = (usuario?.fullName || "U")
    .split(" ")
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={styles.brandTitle}>SISTRA-TEC</span>
          <span style={styles.brandSubtitle}>Trazabilidad de donaciones</span>
        </div>

        <nav style={styles.nav}>
          {items.map((item) => {
            const esActivo = item.clave === activo;
            return (
              <button
                key={item.clave}
                onClick={() => onSeleccionar(item.clave)}
                aria-current={esActivo ? "page" : undefined}
                style={{ ...styles.navItem, ...(esActivo ? styles.navItemActivo : {}) }}
              >
                <span style={styles.navIcon}>{item.icono}</span>
                {item.etiqueta}
              </button>
            );
          })}
        </nav>

        <div style={styles.usuarioBox}>
          <div style={styles.avatar}>{iniciales}</div>
          <div style={styles.usuarioInfo}>
            <span style={styles.usuarioNombre}>{usuario?.fullName || "Usuario"}</span>
            <span style={styles.usuarioEmail}>{usuario?.email || ""}</span>
          </div>
        </div>

        <button style={styles.logout} onClick={cerrarSesion}>
          <LogoutIcon />
          Cerrar sesión
        </button>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.titulo}>{titulo}</h1>
          <p style={styles.subtitulo}>{subtitulo}</p>
        </header>
        <div style={styles.contenido}>{children}</div>
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#04080E",
    fontFamily: "'Inter', sans-serif",
  },
  sidebar: {
    width: "260px",
    flexShrink: 0,
    backgroundColor: "#0B0F16",
    borderRight: "1px solid #1A1D23",
    display: "flex",
    flexDirection: "column",
    padding: "24px 18px",
    gap: "8px",
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  brand: {
    display: "flex",
    flexDirection: "column",
    padding: "0 8px 20px",
    borderBottom: "1px solid #1A1D23",
    marginBottom: "12px",
  },
  brandTitle: {
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "700",
    letterSpacing: "0.05em",
  },
  brandSubtitle: {
    color: "#8a9bb0",
    fontSize: "11px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "transparent",
    color: "#8a9bb0",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    outline: "none",
    transition: "background-color 0.15s, color 0.15s",
  },
  navItemActivo: {
    backgroundColor: "rgba(0,212,245,0.10)",
    color: "#00d4f5",
    fontWeight: "700",
  },
  navIcon: {
    display: "flex",
    alignItems: "center",
  },
  usuarioBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 10px",
    borderTop: "1px solid #1A1D23",
    marginTop: "8px",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#00d4f5",
    color: "#0a0f14",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
    flexShrink: 0,
  },
  usuarioInfo: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  usuarioNombre: {
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  usuarioEmail: {
    color: "#8a9bb0",
    fontSize: "11px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  logout: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1px solid #232830",
    background: "none",
    color: "#cdd6e0",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: "32px 40px",
    overflowX: "hidden",
  },
  header: {
    marginBottom: "28px",
  },
  titulo: {
    color: "#ffffff",
    fontSize: "26px",
    fontWeight: "700",
    margin: 0,
  },
  subtitulo: {
    color: "#8a9bb0",
    fontSize: "14px",
    margin: "6px 0 0",
  },
  contenido: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
};

export default DashboardLayout;
