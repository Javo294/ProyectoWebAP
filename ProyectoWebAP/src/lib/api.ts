import { getAccessToken } from "./session";

const BASE_URL =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL ||
  "http://localhost:3000/api/v1";

export class ApiError extends Error {
  codigo: string;

  status: number;

  constructor(mensaje: string, codigo: string, status: number) {
    super(mensaje);
    this.name = "ApiError";
    this.codigo = codigo;
    this.status = status;
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

export async function apiRequest<T = unknown>(
  ruta: string,
  opciones: OpcionesPeticion = {}
): Promise<T> {
  const { method = "GET", body, query } = opciones;
  const token = getAccessToken();

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const respuesta = await fetch(construirUrl(ruta, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let json: {
    exito?: boolean;
    mensaje?: string;
    datos?: T;
    error?: { codigo?: string } | null;
  } = {};

  try {
    json = await respuesta.json();
  } catch {
    json = {};
  }

  if (!respuesta.ok || json.exito === false) {
    throw new ApiError(
      json.mensaje || "Ocurrió un error al comunicarse con el servidor",
      json.error?.codigo || "ERROR_DESCONOCIDO",
      respuesta.status
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
};
