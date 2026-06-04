import { clearSession, getAccessToken, getRefreshToken, setAccessToken } from "./session";

const BASE_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL ||
  "http://localhost:3000/api/v1";

export interface DetalleValidacion {
  campo?: string;
  mensaje?: string;
}

export class ApiError extends Error {
  codigo: string;

  status: number;

  detalle: DetalleValidacion[] | string | null;

  constructor(mensaje: string, codigo: string, status: number, detalle: DetalleValidacion[] | string | null = null) {
    super(mensaje);
    this.name = "ApiError";
    this.codigo = codigo;
    this.status = status;
    this.detalle = detalle;
  }

  primerMensajeDeValidacion(): string | null {
    if (Array.isArray(this.detalle) && this.detalle.length > 0) {
      const primero = this.detalle[0];
      return primero?.mensaje ?? null;
    }
    return null;
  }
}

interface OpcionesPeticion {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
}

function construirUrl(ruta: string, query?: OpcionesPeticion["query"]): string {
  const url = new URL(`${BASE_URL}${ruta}`);
  if (query) {
    Object.entries(query).forEach(([clave, valor]) => {
      if (valor !== undefined && valor !== null && `${valor}` !== "") {
        url.searchParams.set(clave, `${valor}`);
      }
    });
  }
  return url.toString();
}

let refreshEnCurso: Promise<string | null> | null = null;

async function intentarRefresh(): Promise<string | null> {
  if (refreshEnCurso) return refreshEnCurso;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  refreshEnCurso = (async () => {
    try {
      const respuesta = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!respuesta.ok) return null;
      const json = await respuesta.json();
      const nuevoAccess: string | undefined = json?.datos?.accessToken;
      if (!nuevoAccess) return null;
      setAccessToken(nuevoAccess);
      return nuevoAccess;
    } catch {
      return null;
    } finally {
      refreshEnCurso = null;
    }
  })();

  return refreshEnCurso;
}

interface RespuestaBackend<T> {
  exito?: boolean;
  mensaje?: string;
  datos?: T;
  error?: { codigo?: string; detalle?: DetalleValidacion[] | string | null } | null;
}

async function ejecutarPeticion<T>(ruta: string, opciones: OpcionesPeticion, token: string | null): Promise<{ status: number; json: RespuestaBackend<T> }> {
  const { method = "GET", body, query } = opciones;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const respuesta = await fetch(construirUrl(ruta, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let json: RespuestaBackend<T> = {};
  try { json = await respuesta.json(); } catch { json = {}; }
  return { status: respuesta.status, json };
}

export async function apiRequest<T = unknown>(
  ruta: string,
  opciones: OpcionesPeticion = {}
): Promise<T> {
  let token = getAccessToken();
  let { status, json } = await ejecutarPeticion<T>(ruta, opciones, token);

  const esTokenExpirado = status === 401 && (json.error?.codigo === "TOKEN_EXPIRADO" || json.error?.codigo === "TOKEN_INVALIDO");
  if (esTokenExpirado && token) {
    const nuevo = await intentarRefresh();
    if (nuevo) {
      token = nuevo;
      ({ status, json } = await ejecutarPeticion<T>(ruta, opciones, token));
    } else {
      clearSession();
      if (typeof window !== "undefined") {
        window.location.hash = "#/login";
      }
    }
  }

  if (status < 200 || status >= 300 || json.exito === false) {
    throw new ApiError(
      json.mensaje || "Ocurrió un error al comunicarse con el servidor",
      json.error?.codigo || "ERROR_DESCONOCIDO",
      status,
      json.error?.detalle ?? null,
    );
  }

  return json.datos as T;
}

export const api = {
  get: <T = unknown>(ruta: string, query?: OpcionesPeticion["query"]) =>
    apiRequest<T>(ruta, { method: "GET", query }),
  post: <T = unknown>(ruta: string, body?: unknown) =>
    apiRequest<T>(ruta, { method: "POST", body }),
  patch: <T = unknown>(ruta: string, body?: unknown) =>
    apiRequest<T>(ruta, { method: "PATCH", body }),
  delete: <T = unknown>(ruta: string) =>
    apiRequest<T>(ruta, { method: "DELETE" }),
};
