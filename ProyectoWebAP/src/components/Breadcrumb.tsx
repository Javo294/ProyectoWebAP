import React from "react";

// 1. Definimos la estructura de cada paso de navegación
interface BreadcrumbItem {
  label: string;
  href?: string; // Para rutas directas
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => void; // Para disparar funciones manuales
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav style={styles.nav} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {/* Agrega el separador a partir del segundo elemento */}
            {index > 0 && <span style={styles.separator}>&rsaquo;</span>}

            {isLast ? (
              // Página actual (último elemento): Texto estático sin enlace
              <span style={styles.current} aria-current="page">
                {item.label}
              </span>
            ) : item.href ? (
              // Si tiene una ruta directa, usamos una etiqueta de enlace real
              <a href={item.href} style={styles.link} onClick={item.onClick}>
                {item.label}
              </a>
            ) : (
              // Si solo maneja una función onClick manual
              <span style={styles.link} onClick={item.onClick}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// 2. Mantenemos tus estilos limpios y estables en TS
const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "13px",
  },
  separator: {
    color: "#3a5060",
    padding: "0 2px",
    userSelect: "none", // Evita que el usuario seleccione el carácter "›" sin querer
  },
  link: {
    color: "#00d4f5",
    cursor: "pointer",
    textDecoration: "none",
  },
  current: {
    color: "#8a9bb0",
  },
};

export default Breadcrumb;