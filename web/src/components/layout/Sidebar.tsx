import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  UserCheck,
  Stethoscope,
  Activity,
  CreditCard,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useClinic } from "../../context/ClinicContext";
import { type Permission } from "../../lib/jwt";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const { appointments, patients } = useClinic();

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointmentsCount = appointments.filter((a) => a.date === todayStr).length;

  const navGroups: {
    title: string;
    items: { 
      path: string; 
      label: string; 
      icon: React.ReactNode; 
      requiredPermission?: Permission;
      badge?: string | number;
    }[];
  }[] = [
    {
      title: "PRINCIPAL",
      items: [
        { path: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} />, requiredPermission: "view:dashboard" },
        { 
          path: "/admin/agenda", 
          label: "Agenda", 
          icon: <Calendar size={18} />, 
          requiredPermission: "manage:agenda",
          badge: todayAppointmentsCount > 0 ? todayAppointmentsCount : undefined 
        },
        { path: "/admin/citas", label: "Citas", icon: <Clock size={18} />, requiredPermission: "manage:agenda" },
      ],
    },
    {
      title: "GESTIÓN",
      items: [
        { 
          path: "/admin/pacientes", 
          label: "Pacientes (CRM)", 
          icon: <Users size={18} />, 
          requiredPermission: "manage:patients",
          badge: patients.length > 0 ? patients.length : undefined
        },
        { path: "/admin/profesionales", label: "Profesionales", icon: <UserCheck size={18} />, requiredPermission: "manage:professionals" },
        { path: "/admin/especialidades", label: "Especialidades", icon: <Stethoscope size={18} />, requiredPermission: "manage:professionals" },
      ],
    },
    {
      title: "ATENCIÓN CLÍNICA",
      items: [
        { path: "/admin/historias", label: "Fichas & Historias", icon: <Activity size={18} />, requiredPermission: "edit:clinical_history" },
        { path: "/admin/dietas", label: "Dietas & Nutrición", icon: <Globe size={18} />, requiredPermission: "edit:clinical_history" },
      ],
    },
    {
      title: "ADMINISTRACIÓN",
      items: [
        { path: "/admin/inventario", label: "Inventario & Stock", icon: <Users size={18} />, requiredPermission: "manage:professionals" },
        { path: "/admin/pagos", label: "Finanzas & Gastos", icon: <CreditCard size={18} />, requiredPermission: "manage:payments" },
        { path: "/admin/reportes", label: "Reportes", icon: <BarChart3 size={18} />, requiredPermission: "view:reports" },
        { path: "/admin/configuracion", label: "Configuración", icon: <Settings size={18} />, requiredPermission: "manage:settings" },
      ],
    },
  ];

  // Filter groups and items based on current user permissions
  const filteredNavGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!item.requiredPermission) return true;
        return hasPermission(item.requiredPermission);
      }),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside
      style={{
        width: collapsed ? "72px" : "240px",
        height: "100vh",
        backgroundColor: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        transition: "width var(--transition-normal)",
        position: "sticky",
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: collapsed ? "18px 0" : "18px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "var(--text-primary)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "10px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.125rem",
              flexShrink: 0,
              boxShadow: "0 2px 6px var(--primary-glow)",
            }}
          >
            +
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.9375rem", letterSpacing: "-0.02em" }}>
                Klinic Pro
              </div>
              <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.05em" }}>
                MEDICAL SAAS
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: collapsed ? "16px 8px" : "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {filteredNavGroups.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <div
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "0.06em",
                  padding: "0 10px 6px",
                  textTransform: "uppercase",
                }}
              >
                {group.title}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {group.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/admin" && location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: collapsed ? "center" : "space-between",
                      padding: collapsed ? "10px 0" : "8px 12px",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "var(--primary)" : "var(--text-secondary)",
                      backgroundColor: isActive ? "var(--primary-light)" : "transparent",
                      textDecoration: "none",
                      transition: "all var(--transition-fast)",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: isActive ? "var(--primary)" : "var(--text-muted)", display: "flex", alignItems: "center" }}>
                        {item.icon}
                      </span>
                      {!collapsed && <span>{item.label}</span>}
                    </div>

                    {!collapsed && item.badge !== undefined && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "1px 7px",
                          borderRadius: "999px",
                          backgroundColor: isActive ? "var(--primary)" : "var(--border)",
                          color: isActive ? "#ffffff" : "var(--text-secondary)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Clean Footer */}
      <div
        style={{
          padding: "14px 16px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          backgroundColor: "var(--surface)",
        }}
      >
        {!collapsed && (
          <Link
            to="/"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px", 
              fontSize: "0.75rem", 
              color: "var(--text-secondary)", 
              textDecoration: "none",
              fontWeight: 600
            }}
          >
            <Globe size={14} color="var(--primary)" />
            <span>Portal Web</span>
          </Link>
        )}
        <button
          className="btn-icon"
          onClick={onToggle}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          style={{ width: "28px", height: "28px" }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
