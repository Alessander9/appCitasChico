import { getTokenFromStorage } from "./jwt";

const API_BASE_URL = "/api";

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
  status: number;
}

export type Service = {
  id: number;
  name: string;
  description: string;
  duration_min: number;
  price?: number | null;
  price_cents?: number | null;
  active: boolean;
  image_url?: string | null;
};

export type Appointment = {
  id: number;
  date: string;
  start_minute: number;
  status: string;
  notes: string;
  profiles?: {
    name: string;
    email: string;
    phone?: string;
  };
  services?: {
    name: string;
    duration_min: number;
    price?: number | null;
    price_cents?: number | null;
  };
};

export type ScheduleWindow = {
  id?: number;
  weekday: number;
  start_minute: number;
  end_minute: number;
};

/**
 * Standard fetch wrapper with automatic JWT Authorization header injection
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getTokenFromStorage();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      return {
        ok: false,
        error: typeof payload === "object" && payload?.error ? payload.error : response.statusText,
        status: response.status,
      };
    }

    return {
      ok: true,
      data: payload,
      status: response.status,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err.message || "Error de conexión de red con el servidor",
      status: 0,
    };
  }
}

/**
 * Auth Backend API Endpoints
 */
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  logout: () =>
    apiRequest("/auth/logout", {
      method: "POST",
    }),

  getProfile: () => apiRequest("/auth/me"),
};

/**
 * Appointments Backend API Endpoints
 */
export const appointmentsApi = {
  getAll: () => apiRequest("/admin/appointments"),
  getMine: () => apiRequest("/appointments/mine"),
  create: (data: { serviceId: number; date: string; startMinute: number; notes?: string }) =>
    apiRequest("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  cancel: (id: number | string) =>
    apiRequest(`/appointments/${id}`, {
      method: "DELETE",
    }),
};

/**
 * Services Backend API Endpoints
 */
export const servicesApi = {
  getAll: () => apiRequest("/services"),
  getAvailability: (serviceId: number, date: string) =>
    apiRequest(`/availability?serviceId=${serviceId}&date=${date}`),
};

// Legacy compatibility functions for Admin and other legacy pages
export async function adminAppointments(params?: { date?: string }): Promise<Appointment[]> {
  const query = params?.date ? `?date=${params.date}` : "";
  const res = await apiRequest(`/admin/appointments${query}`);
  return res.ok && Array.isArray(res.data) ? res.data : [];
}

export async function cancelAppointment(id: number): Promise<void> {
  await apiRequest(`/appointments/${id}`, { method: "DELETE" });
}

export async function listServices(options?: boolean | { includeInactive?: boolean }): Promise<Service[]> {
  const includeInactive = typeof options === "object" ? !!options.includeInactive : (options ?? true);
  const query = includeInactive ? "?all=true" : "";
  const res = await apiRequest(`/services${query}`);
  return res.ok && Array.isArray(res.data) ? res.data : [];
}

export async function createService(data: Partial<Service>): Promise<Service | null> {
  const res = await apiRequest("/services", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.ok ? res.data : null;
}

export async function updateService(id: number, data: Partial<Service>): Promise<void> {
  await apiRequest(`/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function listSchedule(): Promise<ScheduleWindow[]> {
  const res = await apiRequest("/schedule");
  return res.ok && Array.isArray(res.data) ? res.data : [];
}

export async function replaceSchedule(arg1: any, arg2?: any): Promise<void> {
  const body = Array.isArray(arg1) ? { windows: arg1 } : { weekday: arg1, windows: arg2 };
  await apiRequest("/schedule", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function listBlockedDates(): Promise<{ date: string; reason: string }[]> {
  const res = await apiRequest("/blocked-dates");
  if (res.ok && Array.isArray(res.data)) {
    return res.data.map((d: any) => ({ date: d.date, reason: d.reason || "" }));
  }
  return [];
}

export async function blockDate(date: string, reason?: string): Promise<void> {
  await apiRequest("/blocked-dates", {
    method: "POST",
    body: JSON.stringify({ date, reason: reason || "" }),
  });
}

export async function unblockDate(date: string): Promise<void> {
  await apiRequest(`/blocked-dates/${date}`, {
    method: "DELETE",
  });
}

export async function getSettings(): Promise<Record<string, any>> {
  const res = await apiRequest("/settings");
  return res.ok && res.data ? res.data : {};
}

export async function updateSetting(key: string, value: any): Promise<void> {
  await apiRequest("/settings", {
    method: "POST",
    body: JSON.stringify({ key, value }),
  });
}
