import { api, apiRequest } from "./api";

export type EstadoDonacion = "recibido" | "en_transito" | "entregado";

export interface DonacionAdmin {
  id: string;
  trackingId: string;
  tipo: string;
  donante: string;
  estado: EstadoDonacion;
  descripcion: string;
  fechaRegistro: string;
  fechaEntregado: string | null;
  origen: string;
  isAssigned: boolean;
}

export interface Paginacion {
  pagina: number;
  porPagina: number;
  total: number;
  totalPaginas: number;
}

export interface RespuestaDonaciones {
  items: DonacionAdmin[];
  paginacion: Paginacion;
}

export interface MetricasAdmin {
  total: number;
  recibidos: number;
  enTransito: number;
  entregados: number;
  detalle: Record<EstadoDonacion, number>;
  distribucion: { estado: string; valor: number }[];
}

export interface MetricasTransportista {
  pendientes: number;
  enTransito: number;
  entregados: number;
}

export interface Usuario {
  id: string;
  fullName: string;
  email: string;
  role: string;
  address: string | null;
  phone: string | null;
  vehicle: string | null;
  collectionCenterId: number | null;
  isActive: boolean;
  createdAt: string | null;
}

export interface AsignacionVista {
  asignacionId: string;
  donationId: string;
  trackingId: string;
  tipo: string;
  donante: string;
  origen: string;
  destino: string;
  vehiculo: string | null;
  estado: EstadoDonacion;
  fechaAsignada: string;
}

export const donacionesService = {
  listar: async (filtros: {
    status?: EstadoDonacion;
    search?: string;
    pagina?: number;
    porPagina?: number;
  }): Promise<RespuestaDonaciones> => {
    const raw = await api.get<{ items: any[]; paginacion: Paginacion }>("/donations", filtros as Record<string, string | number | undefined>);
    const items: DonacionAdmin[] = raw.items.map((d) => ({
      id: d.id,
      trackingId: d.trackingId,
      tipo: d.donationTypeName ?? d.tipo ?? "",
      donante: d.donorName ?? d.donante ?? "",
      estado: d.status as EstadoDonacion,
      descripcion: d.descripcion ?? "",
      fechaRegistro: d.createdAt ?? "",
      fechaEntregado: d.deliveredAt ?? null,
      origen: d.collectionCenterName ?? d.origen ?? "",
      isAssigned: d.isAssigned ?? false,
    }));
    return { items, paginacion: raw.paginacion };
  },
  asignar: (id: string, transporterId: string, destination: string) =>
    api.post(`/donations/${id}/assign`, { transporterId, destination }),
  marcarEnTransito: (id: string) => api.patch(`/donations/${id}/transit`),
  confirmarEntrega: (id: string) => api.patch(`/donations/${id}/deliver`),
};

export const transportistasService = {
  listar: () => api.get<Usuario[]>("/users", { role: "transporter" }),
  crear: (datos: { fullName: string; email: string; phone: string; address: string; password: string; vehicle?: string }) =>
    api.post<Usuario>("/users/transporter", datos),
  editar: (id: string, datos: Partial<Pick<Usuario, "fullName" | "email" | "phone" | "vehicle">>) =>
    api.patch<Usuario>(`/users/${id}`, datos),
  cambiarEstado: (id: string, activo: boolean) =>
    api.patch<Usuario>(`/users/${id}/active`, { isActive: activo }),
};

export const administradoresService = {
  listar: () => api.get<Usuario[]>("/users", { role: "admin" }),
  crear: (datos: { fullName: string; email: string; phone: string; address: string; password: string }) =>
    api.post<Usuario>("/users/admin", datos),
  editar: (id: string, datos: Partial<Pick<Usuario, "fullName" | "email" | "phone">>) =>
    api.patch<Usuario>(`/users/${id}`, datos),
  cambiarEstado: (id: string, activo: boolean) =>
    api.patch<Usuario>(`/users/${id}/active`, { isActive: activo }),
};

export const dashboardService = {
  metricasAdmin: () => api.get<MetricasAdmin>("/dashboard/metrics"),
  metricasTransportista: () => api.get<MetricasTransportista>("/dashboard/mine"),
};

export const asignacionesService = {
  mias: async (): Promise<AsignacionVista[]> => {
    const raw = await api.get<any[]>("/assignments/mine");
    return raw.map((a) => ({
      asignacionId: a.id,
      donationId: a.donationId,
      trackingId: a.donacion?.trackingId ?? "",
      tipo: a.donacion?.donationTypeName ?? "",
      donante: a.donacion?.donorName ?? "",
      origen: a.donacion?.collectionCenterName ?? "",
      destino: a.destination ?? "",
      vehiculo: a.vehicleDescription ?? null,
      estado: (a.donacion?.status ?? "recibido") as EstadoDonacion,
      fechaAsignada: a.assignedAt ?? "",
    }));
  },
};

export const perfilService = {
  obtener: () => api.get<Usuario>("/users/me"),
  actualizar: (datos: Partial<Pick<Usuario, "fullName" | "email" | "phone" | "vehicle">>) =>
    api.patch<Usuario>("/users/me", datos),
  cambiarPassword: (currentPassword: string, newPassword: string, confirmPassword: string) =>
    apiRequest("/users/me/change-password", {
      method: "POST",
      body: { currentPassword, newPassword, confirmPassword },
    }),
};

export function validarReglasPassword(nueva: string): string | null {
  if (!nueva) return "Ingresa una nueva contraseña.";
  if (nueva.length < 8) return "La nueva contraseña debe tener al menos 8 caracteres.";
  if (!/[A-Z]/.test(nueva)) return "La nueva contraseña debe incluir al menos una letra mayúscula.";
  if (!/[0-9]/.test(nueva)) return "La nueva contraseña debe incluir al menos un número.";
  return null;
}

export function validarNuevaPassword(
  actual: string,
  nueva: string,
  confirmacion: string,
): string | null {
  if (!actual) return "Ingresa tu contraseña actual.";
  const reglas = validarReglasPassword(nueva);
  if (reglas) return reglas;
  if (nueva === actual) return "La nueva contraseña debe ser distinta de la actual.";
  if (!confirmacion) return "Confirma tu nueva contraseña.";
  if (nueva !== confirmacion) return "La nueva contraseña y su confirmación no coinciden.";
  return null;
}
