import React from "react";
import { CheckCircle2, Clock, XCircle, AlertCircle, UserCheck } from "lucide-react";
import type { AppointmentStatus, PaymentStatus } from "../../context/ClinicContext";

type StatusType = AppointmentStatus | PaymentStatus | "active" | "inactive";

interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function StatusBadge({ status, size = "md", showIcon = true }: StatusBadgeProps) {
  const configs: Record<
    StatusType,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    // Appointments
    confirmed: {
      label: "Confirmada",
      bg: "#ecfdf5",
      text: "#065f46",
      border: "#a7f3d0",
      icon: <CheckCircle2 size={12} />,
    },
    pending: {
      label: "Pendiente",
      bg: "#fffbeb",
      text: "#92400e",
      border: "#fde68a",
      icon: <Clock size={12} />,
    },
    attended: {
      label: "Atendida",
      bg: "#f0f9ff",
      text: "#075985",
      border: "#bae6fd",
      icon: <UserCheck size={12} />,
    },
    cancelled: {
      label: "Cancelada",
      bg: "#fef2f2",
      text: "#991b1b",
      border: "#fecaca",
      icon: <XCircle size={12} />,
    },
    no_show: {
      label: "No asistió",
      bg: "#f1f5f9",
      text: "#475569",
      border: "#cbd5e1",
      icon: <AlertCircle size={12} />,
    },
    // Payments
    paid: {
      label: "Pagado",
      bg: "#ecfdf5",
      text: "#065f46",
      border: "#a7f3d0",
      icon: <CheckCircle2 size={12} />,
    },
    partial: {
      label: "Parcial",
      bg: "#fef3c7",
      text: "#92400e",
      border: "#fde68a",
      icon: <Clock size={12} />,
    },
    // Patients
    active: {
      label: "Activo",
      bg: "#ecfdf5",
      text: "#065f46",
      border: "#a7f3d0",
      icon: <CheckCircle2 size={12} />,
    },
    inactive: {
      label: "Inactivo",
      bg: "#f1f5f9",
      text: "#64748b",
      border: "#e2e8f0",
      icon: <XCircle size={12} />,
    },
  };

  const config = configs[status] || {
    label: status,
    bg: "#f1f5f9",
    text: "#475569",
    border: "#cbd5e1",
    icon: null,
  };

  const isSmall = size === "sm";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: isSmall ? "2px 8px" : "4px 10px",
        fontSize: isSmall ? "0.75rem" : "0.8125rem",
        fontWeight: 600,
        borderRadius: "999px",
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        lineHeight: 1.2,
      }}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  );
}
