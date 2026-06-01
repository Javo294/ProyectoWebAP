import { api } from "./api";

export type EstadoDonacion = "recibido" | "clasificado" | "en_transito" | "entregado";

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
  listar: (filtros: {
    status?: EstadoDonacion;
    search?: string;
    pagina?: number;
    porPagina?: number;
  }) => api.get<RespuestaDonaciones>("/donations", filtros),
  asignar: (id: string, transporterId: string, destination: string) =>
    api.post(`/donations/${id}/assign`, { transporterId, destination }),
  marcarEnTransito: (id: string) => api.patch(`/donations/${id}/transit`),
  confirmarEntrega: (id: string) => api.patch(`/donations/${id}/deliver`),
};

export const transportistasService = {
  listar: () => api.get<Usuario[]>("/transporters"),
  crear: (datos: { fullName: string; email: string; address: string; password: string; vehicle?: string }) =>
    api.post<Usuario>("/transporters", datos),
  editar: (id: string, datos: Partial<Pick<Usuario, "fullName" | "email" | "phone" | "vehicle">>) =>
    api.patch<Usuario>(`/transporters/${id}`, datos),
  cambiarEstado: (id: string, activo: boolean) =>
    api.patch<Usuario>(`/transporters/${id}/active`, { activo }),
};

export const administradoresService = {
  listar: () => api.get<Usuario[]>("/admins"),
  crear: (datos: { fullName: string; email: string; address: string; password: string }) =>
    api.post<Usuario>("/admins", datos),
  editar: (id: string, datos: Partial<Pick<Usuario, "fullName" | "email" | "phone">>) =>
    api.patch<Usuario>(`/admins/${id}`, datos),
  cambiarEstado: (id: string, activo: boolean) =>
    api.patch<Usuario>(`/admins/${id}/active`, { activo }),
};

export const dashboardService = {
  metricasAdmin: () => api.get<MetricasAdmin>("/dashboard/metrics"),
  metricasTransportista: () => api.get<MetricasTransportista>("/dashboard/mine"),
};

export const asignacionesService = {
  mias: () => api.get<AsignacionVista[]>("/assignments/mine"),
};

export const perfilService = {
  obtener: () => api.get<Usuario>("/me"),
  actualizar: (datos: Partial<Pick<Usuario, "fullName" | "email" | "phone" | "vehicle">>) =>
    api.patch<Usuario>("/me", datos),
  cambiarPassword: (passwordActual: string, passwordNueva: string) =>
    api.patch("/me/password", { passwordActual, passwordNueva }),
};
