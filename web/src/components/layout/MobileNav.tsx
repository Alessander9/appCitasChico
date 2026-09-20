import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, CreditCard, Plus } from "lucide-react";

interface MobileNavProps {
  onOpenNewAppointment: () => void;
}

export function MobileNav({ onOpenNewAppointment }: MobileNavProps) {
  const location = useLocation();

  const items = [
    { path: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/agenda", label: "Agenda", icon: <Calendar size={20} /> },
    { path: "/admin/pacientes", label: "Pacientes", icon: <Users size={20} /> },
    { path: "/admin/pagos", label: "Pagos", icon: <CreditCard size={20} /> },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        backgroundColor: "var(--surface)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 40,
        padding: "0 8px",
      }}
      className="mobile-only"
    >
      {items.slice(0, 2).map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              fontSize: "0.6875rem",
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "var(--primary)" : "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Center Action Button */}
      <button
        onClick={onOpenNewAppointment}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: "var(--primary)",
          color: "#ffffff",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 10px var(--primary-glow)",
          marginTop: -20,
          cursor: "pointer",
        }}
      >
        <Plus size={24} />
      </button>

      {items.slice(2).map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              fontSize: "0.6875rem",
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "var(--primary)" : "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
