export type UserRole = "admin" | "doctor" | "receptionist" | "patient";

export type Permission = 
  | "view:dashboard"
  | "manage:agenda"
  | "manage:patients"
  | "edit:clinical_history"
  | "manage:professionals"
  | "manage:payments"
  | "view:reports"
  | "manage:settings"
  | "view:my_appointments";

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  permissions: Permission[];
  iat: number; // Issued at (timestamp in seconds)
  exp: number; // Expiration (timestamp in seconds)
  iss: string; // Issuer
}

const JWT_STORAGE_KEY = "klinicpro_auth_jwt";
const JWT_SECRET = "klinicpro-secure-jwt-secret-key-2026";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    "view:dashboard",
    "manage:agenda",
    "manage:patients",
    "edit:clinical_history",
    "manage:professionals",
    "manage:payments",
    "view:reports",
    "manage:settings",
    "view:my_appointments",
  ],
  doctor: [
    "manage:agenda",
    "manage:patients",
    "edit:clinical_history",
    "view:my_appointments",
  ],
  receptionist: [
    "view:dashboard",
    "manage:agenda",
    "manage:patients",
    "manage:payments",
    "view:my_appointments",
  ],
  patient: [
    "view:my_appointments",
  ],
};

export const ROLE_LABELS: Record<UserRole, { title: string; badge: string; color: string; bg: string }> = {
  admin: {
    title: "Director / Administrador",
    badge: "👑 Admin",
    color: "#4f46e5",
    bg: "#eef2ff",
  },
  doctor: {
    title: "Médico / Especialista",
    badge: "👨‍⚕️ Médico",
    color: "#059669",
    bg: "#ecfdf5",
  },
  receptionist: {
    title: "Recepcionista / Staff",
    badge: "📋 Recepción",
    color: "#d97706",
    bg: "#fffbeb",
  },
  patient: {
    title: "Paciente",
    badge: "👤 Paciente",
    color: "#2563eb",
    bg: "#eff6ff",
  },
};

/**
 * Base64Url encode helper
 */
function base64UrlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Base64Url decode helper
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return decodeURIComponent(escape(atob(base64)));
}

/**
 * Generates a signed JWT Token
 */
export function generateJwtToken(user: {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
}, expiresInHours = 24): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const nowInSec = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar_url: user.avatar_url,
    permissions: ROLE_PERMISSIONS[user.role],
    iat: nowInSec,
    exp: nowInSec + expiresInHours * 3600,
    iss: "klinicpro-auth-service",
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  
  // Create signature simulation with secret
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const signature = base64UrlEncode(`${dataToSign}.${JWT_SECRET}`);

  return `${dataToSign}.${signature}`;
}

/**
 * Verifies and decodes a JWT token
 */
export function verifyJwtToken(token: string | null): { valid: boolean; payload: JwtPayload | null; error?: string } {
  if (!token) {
    return { valid: false, payload: null, error: "Token no proporcionado" };
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, payload: null, error: "Formato JWT inválido" };
    }

    const payloadJson = base64UrlDecode(parts[1]);
    const payload: JwtPayload = JSON.parse(payloadJson);

    // Verify expiration
    const nowInSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowInSec) {
      return { valid: false, payload: null, error: "Token expirado. Por favor inicia sesión nuevamente." };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, payload: null, error: "Error al decodificar token JWT" };
  }
}

/**
 * Storage helpers
 */
export function saveTokenToStorage(token: string) {
  try {
    localStorage.setItem(JWT_STORAGE_KEY, token);
  } catch {
    // fallback
  }
}

export function getTokenFromStorage(): string | null {
  try {
    return localStorage.getItem(JWT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function removeTokenFromStorage() {
  try {
    localStorage.removeItem(JWT_STORAGE_KEY);
  } catch {
    // fallback
  }
}
