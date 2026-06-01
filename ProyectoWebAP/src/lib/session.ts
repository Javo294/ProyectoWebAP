export interface UsuarioSesion {
  id: string;
  fullName: string;
  email: string;
  role: "donor" | "transporter" | "admin";
  collectionCenterId: number | null;
}

const CLAVE_TOKEN = "sistratec_access_token";
const CLAVE_USUARIO = "sistratec_user";

export function getAccessToken(): string | null {
  try {
    return window.localStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
}

export function getCurrentUser(): UsuarioSesion | null {
  try {
    const crudo = window.localStorage.getItem(CLAVE_USUARIO);
    return crudo ? (JSON.parse(crudo) as UsuarioSesion) : null;
  } catch {
    return null;
  }
}

export function setSession(token: string, usuario: UsuarioSesion): void {
  window.localStorage.setItem(CLAVE_TOKEN, token);
  window.localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function clearSession(): void {
  window.localStorage.removeItem(CLAVE_TOKEN);
  window.localStorage.removeItem(CLAVE_USUARIO);
}
