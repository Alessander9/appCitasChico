import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  type UserRole,
  type Permission,
  type JwtPayload,
  generateJwtToken,
  verifyJwtToken,
  saveTokenToStorage,
  getTokenFromStorage,
  removeTokenFromStorage,
} from "../lib/jwt";
import { authApi } from "../lib/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  permissions: Permission[];
  token: string;
}

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string, role?: UserRole) => Promise<AuthUser>;
  loginAsRole: (role: UserRole, customName?: string, customEmail?: string) => AuthUser;
  signUp: (name: string, email: string, password: string, role?: UserRole) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
};

const AuthContext = createContext<AuthState | null>(null);

// Default seed users for quick reference and demo testing
export const DEFAULT_USERS: Record<UserRole, { name: string; email: string; avatar: string }> = {
  admin: {
    name: "Dr. Roberto Mendoza",
    email: "director@klinicpro.com",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
  },
  doctor: {
    name: "Dr. Carlos Pérez",
    email: "carlos.perez@klinicpro.com",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
  },
  receptionist: {
    name: "Claudia Romero",
    email: "recepcion@klinicpro.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  patient: {
    name: "María Elena Rojas",
    email: "maria.rojas@gmail.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from existing stored JWT
  useEffect(() => {
    const token = getTokenFromStorage();
    if (token) {
      const verification = verifyJwtToken(token);
      if (verification.valid && verification.payload) {
        const payload: JwtPayload = verification.payload;
        setUser({
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          avatar_url: payload.avatar_url,
          permissions: payload.permissions,
          token,
        });
      } else {
        removeTokenFromStorage();
        setUser(null);
      }
    } else {
      // Default: login as Admin for seamless out-of-the-box demo experience if not logged in
      const defaultRole: UserRole = "admin";
      const seed = DEFAULT_USERS[defaultRole];
      const token = generateJwtToken({
        id: "usr-admin-1",
        name: seed.name,
        email: seed.email,
        role: defaultRole,
        avatar_url: seed.avatar,
      });
      saveTokenToStorage(token);
      const { payload } = verifyJwtToken(token);
      if (payload) {
        setUser({
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          avatar_url: payload.avatar_url,
          permissions: payload.permissions,
          token,
        });
      }
    }
    setLoading(false);
  }, []);

  // Token Expiration Watchdog (Auto-logout if JWT expires)
  useEffect(() => {
    const interval = setInterval(() => {
      const token = getTokenFromStorage();
      if (token) {
        const verification = verifyJwtToken(token);
        if (!verification.valid) {
          removeTokenFromStorage();
          setUser(null);
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  function loginAsRole(role: UserRole, customName?: string, customEmail?: string): AuthUser {
    const seed = DEFAULT_USERS[role];
    const name = customName || seed.name;
    const email = customEmail || seed.email;
    const id = `usr-${role}-${Math.random().toString(36).substring(2, 7)}`;

    const token = generateJwtToken({
      id,
      name,
      email,
      role,
      avatar_url: seed.avatar,
    });

    saveTokenToStorage(token);
    const { payload } = verifyJwtToken(token);
    
    const authUser: AuthUser = {
      id,
      name,
      email,
      role,
      avatar_url: seed.avatar,
      permissions: payload ? payload.permissions : [],
      token,
    };

    setUser(authUser);
    return authUser;
  }

  async function signIn(email: string, password: string, role: UserRole = "admin"): Promise<AuthUser> {
    // Try communicating with backend API first
    try {
      const res = await authApi.login(email, password);
      if (res.ok && res.data?.user) {
        const backendUser = res.data.user;
        const mappedRole: UserRole = backendUser.role === "admin" ? "admin" : "patient";
        return loginAsRole(mappedRole, backendUser.name, backendUser.email);
      }
    } catch {
      // Offline fallback: continue smoothly with local JWT
    }

    // Detect role based on email if possible or default to specified role
    let detectedRole: UserRole = role;
    if (email.includes("director") || email.includes("admin")) detectedRole = "admin";
    else if (email.includes("doctor") || email.includes("dr") || email.includes("terapeuta")) detectedRole = "doctor";
    else if (email.includes("recepcion") || email.includes("staff")) detectedRole = "receptionist";
    else if (email.includes("paciente") || email.includes("gmail") || email.includes("hotmail")) detectedRole = "patient";

    const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    return loginAsRole(detectedRole, name, email);
  }

  async function signUp(name: string, email: string, password: string, role: UserRole = "patient"): Promise<AuthUser> {
    try {
      await authApi.register(name, email, password);
    } catch {
      // fallback
    }
    return loginAsRole(role, name, email);
  }

  async function signOut(): Promise<void> {
    try {
      await authApi.logout();
    } catch {
      // fallback
    }
    removeTokenFromStorage();
    setUser(null);
  }

  function hasPermission(permission: Permission): boolean {
    if (!user) return false;
    return user.permissions.includes(permission);
  }

  function hasRole(roles: UserRole | UserRole[]): boolean {
    if (!user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(user.role);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        loginAsRole,
        signUp,
        signOut,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
