import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  Plus, 
  Bell, 
  CheckCircle2, 
  DollarSign, 
  ChevronDown, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Globe, 
  Sparkles, 
  ShieldCheck,
  Calendar
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { ROLE_LABELS } from "../../lib/jwt";

interface TopbarProps {
  onOpenSearch: () => void;
  onOpenNewAppointment: () => void;
}

export function Topbar({ onOpenSearch, onOpenNewAppointment }: TopbarProps) {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await signOut();
    toast("Has cerrado sesión exitosamente.", "info");
    navigate("/login");
  };

  const notifications = [
    { id: 1, title: "Nueva cita confirmada", desc: "María López (Terapia Física) a las 09:00", time: "Hace 10 min", icon: <CheckCircle2 size={14} color="#10b981" /> },
    { id: 2, title: "Pago recibido", desc: "S/ 80.00 vía Yape de Juan Torres", time: "Hace 25 min", icon: <DollarSign size={14} color="#4f46e5" /> },
    { id: 3, title: "Recordatorio", desc: "Elena Valdivia asiste en 30 minutos", time: "Hace 40 min", icon: <Bell size={14} color="#f59e0b" /> },
  ];

  const roleInfo = user ? ROLE_LABELS[user.role] : null;

  return (
    <header
      style={{
        height: "64px",
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Search Bar Button (Ctrl + K) */}
      <button
        onClick={onOpenSearch}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "7px 14px",
          backgroundColor: "var(--bg-app)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          color: "var(--text-muted)",
          fontSize: "0.8125rem",
          cursor: "pointer",
          width: "280px",
          textAlign: "left",
          transition: "border-color var(--transition-fast)",
        }}
      >
        <Search size={15} color="var(--text-secondary)" />
        <span style={{ flex: 1 }}>Buscar paciente, cita...</span>
        <kbd
          style={{
            fontSize: "0.6875rem",
            padding: "2px 5px",
            borderRadius: "4px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            fontWeight: 700,
          }}
        >
          Ctrl K
        </kbd>
      </button>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Primary Action Button */}
        <button className="btn btn-primary" onClick={onOpenNewAppointment} style={{ padding: "8px 14px", gap: "6px" }}>
          <Plus size={16} />
          <span>Nueva Cita</span>
          <kbd
            style={{
              fontSize: "0.6875rem",
              padding: "1px 5px",
              borderRadius: "4px",
              backgroundColor: "rgba(255,255,255,0.25)",
              color: "#ffffff",
              fontWeight: 700,
              marginLeft: 4,
            }}
          >
            C
          </kbd>
        </button>

        {/* Notifications Popover */}
        <div style={{ position: "relative" }} ref={notificationsRef}>
          <button
            className="btn-icon"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ position: "relative" }}
          >
            <Bell size={18} />
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "var(--primary)",
              }}
            />
          </button>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "320px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-xl)",
                padding: "12px",
                zIndex: 50,
                animation: "scaleUp 150ms ease-out",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px 10px", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>Notificaciones</span>
                <span style={{ fontSize: "0.6875rem", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}>
                  Marcar leídas
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "8px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--bg-app)",
                    }}
                  >
                    <div style={{ marginTop: 2 }}>{n.icon}</div>
                    <div>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{n.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{n.desc}</div>
                      <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: 2 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Trigger */}
        {user && (
          <div style={{ position: "relative" }} ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderLeft: "1px solid var(--border)",
                paddingLeft: 14,
                paddingRight: 6,
                paddingTop: 4,
                paddingBottom: 4,
                borderRadius: "var(--radius-md)",
                background: showUserMenu ? "var(--surface-hover)" : "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                transition: "all var(--transition-fast)"
              }}
            >
              <img
                src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={user.name}
                style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: `2px solid ${roleInfo?.color || "#4f46e5"}` }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {user.name}
                </span>
                <span style={{ fontSize: "0.6875rem", color: roleInfo?.color || "var(--primary)", fontWeight: 700 }}>
                  {roleInfo?.title || "Usuario"}
                </span>
              </div>
              <ChevronDown 
                size={16} 
                color="var(--text-muted)" 
                style={{ 
                  transform: showUserMenu ? "rotate(180deg)" : "rotate(0deg)", 
                  transition: "transform var(--transition-fast)" 
                }} 
              />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: "260px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
                  padding: "8px",
                  zIndex: 50,
                  animation: "scaleUp 150ms ease-out",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}
              >
                {/* User Header Summary */}
                <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-subtle)", marginBottom: "4px" }}>
                  <div style={{ fontWeight: 800, fontSize: "14px", color: "var(--text-primary)" }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
                    {user.email}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ 
                      fontSize: "11px", 
                      fontWeight: 700, 
                      color: roleInfo?.color, 
                      backgroundColor: roleInfo?.bg, 
                      padding: "2px 8px", 
                      borderRadius: "6px" 
                    }}>
                      {roleInfo?.badge}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--success-text)", display: "flex", alignItems: "center", gap: "3px" }}>
                      <ShieldCheck size={12} color="var(--success)" /> JWT Activo
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <Link
                  to="/perfil"
                  onClick={() => setShowUserMenu(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "background-color 0.15s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <UserIcon size={16} color="var(--primary)" />
                  <span>Mi Perfil de Usuario</span>
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin/configuracion"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "background-color 0.15s ease"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <Settings size={16} color="var(--text-secondary)" />
                    <span>Configuración Clínica</span>
                  </Link>
                )}

                <Link
                  to="/mis-citas"
                  onClick={() => setShowUserMenu(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "background-color 0.15s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <Calendar size={16} color="var(--text-secondary)" />
                  <span>Portal Mis Citas</span>
                </Link>

                <Link
                  to="/"
                  onClick={() => setShowUserMenu(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "background-color 0.15s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <Globe size={16} color="var(--text-secondary)" />
                  <span>Ver Portal Público</span>
                </Link>

                <Link
                  to="/login"
                  onClick={() => setShowUserMenu(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    color: "var(--primary)",
                    fontSize: "13px",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "background-color 0.15s ease",
                    backgroundColor: "var(--primary-light)"
                  }}
                >
                  <Sparkles size={16} color="var(--primary)" />
                  <span>Cambiar de Rol (Demo)</span>
                </Link>

                <div style={{ height: "1px", backgroundColor: "var(--border-subtle)", margin: "4px 0" }} />

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    color: "var(--danger)",
                    fontSize: "13px",
                    fontWeight: 600,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "background-color 0.15s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--danger-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <LogOut size={16} color="var(--danger)" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
