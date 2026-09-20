import { type ReactNode } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LogIn, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { type UserRole, type Permission, ROLE_LABELS } from "../../lib/jwt";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requiredPermission,
}: ProtectedRouteProps) {
  const { user, loading, hasPermission, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-app)" }}>
        <div style={{ textAlign: "center" }}>
          <div className="skeleton" style={{ width: 48, height: 48, borderRadius: "50%", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Verificando credenciales de seguridad...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role restriction
  const isRoleAllowed = !allowedRoles || hasRole(allowedRoles);
  const isPermissionAllowed = !requiredPermission || hasPermission(requiredPermission);

  if (!isRoleAllowed || !isPermissionAllowed) {
    const userRoleInfo = ROLE_LABELS[user.role];

    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: "var(--bg-app)", 
        padding: "24px" 
      }}>
        <div style={{ 
          maxWidth: "480px", 
          width: "100%", 
          background: "white", 
          borderRadius: "20px", 
          border: "1px solid var(--border-subtle)", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)", 
          padding: "36px 32px", 
          textAlign: "center" 
        }}>
          <div style={{ 
            width: "60px", 
            height: "60px", 
            borderRadius: "16px", 
            background: "#FEE2E2", 
            color: "#DC2626", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 16px" 
          }}>
            <ShieldAlert size={32} />
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", background: "#FEF2F2", color: "#B91C1C", borderRadius: "999px", fontSize: "12px", fontWeight: 700, marginBottom: "12px" }}>
            <Lock size={12} />
            Acceso Denegado (403 Forbidden)
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
            Módulo no disponible para tu rol
          </h2>

          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "20px" }}>
            Has iniciado sesión con el rol <span style={{ fontWeight: 700, color: userRoleInfo.color }}>{userRoleInfo.title}</span> ({userRoleInfo.badge}), el cual no tiene permisos asignados para acceder a esta sección del sistema clínico.
          </p>

          {allowedRoles && (
            <div style={{ background: "var(--bg-app)", padding: "12px", borderRadius: "12px", marginBottom: "24px", fontSize: "12px", color: "var(--text-muted)" }}>
              <strong>Roles autorizados:</strong> {allowedRoles.map(r => ROLE_LABELS[r].title).join(", ")}
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
            <Link 
              to={user.role === "patient" ? "/mis-citas" : user.role === "doctor" ? "/admin/agenda" : "/admin"} 
              className="btn btn-primary" 
              style={{ width: "100%", justifyContent: "center", padding: "12px", borderRadius: "12px" }}
            >
              <ArrowLeft size={16} />
              Ir a mi área autorizada
            </Link>

            <Link 
              to="/login" 
              className="btn btn-secondary" 
              style={{ width: "100%", justifyContent: "center", padding: "12px", borderRadius: "12px" }}
            >
              <LogIn size={15} />
              Cambiar de usuario o rol
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
