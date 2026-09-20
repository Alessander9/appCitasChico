import React, { useState } from "react";
import { X, Calendar, Clock, Phone, CheckCircle2, UserCheck, XCircle, AlertCircle, RefreshCw, DollarSign } from "lucide-react";
import { useClinic, type Appointment, type AppointmentStatus, type PaymentMethod } from "../../context/ClinicContext";
import { StatusBadge } from "./StatusBadge";

interface AppointmentDrawerProps {
  appointment: Appointment | null;
  onClose: () => void;
  onOpenPatient?: (patientId: string) => void;
}

export function AppointmentDrawer({ appointment, onClose, onOpenPatient }: AppointmentDrawerProps) {
  const { updateAppointmentStatus, rescheduleAppointment, recordPayment } = useClinic();
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  if (!appointment) return null;

  const handleStatus = (status: AppointmentStatus) => {
    updateAppointmentStatus(appointment.id, status);
  };

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newTime) return;
    rescheduleAppointment(appointment.id, newDate, newTime);
    setIsRescheduling(false);
  };

  const handleQuickPay = (method: PaymentMethod) => {
    recordPayment({
      appointment_id: appointment.id,
      patient_name: appointment.patient_name,
      location_type: appointment.location_type || "consultorio",
      amount: appointment.price,
      method,
      status: "paid",
    });
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h3 style={{ fontSize: "1.125rem", margin: 0 }}>Detalle de Cita</h3>
              <StatusBadge status={appointment.status} />
            </div>
            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              ID: {appointment.id}
            </span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 24, flex: 1, overflowY: "auto" }}>
          {/* Patient Card */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--bg-app)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={appointment.patient_avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                alt={appointment.patient_name}
                style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary)" }}>
                  {appointment.patient_name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: 2 }}>
                  <Phone size={13} />
                  <span>{appointment.patient_phone}</span>
                </div>
              </div>
              {onOpenPatient && (
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "6px 10px" }}
                  onClick={() => onOpenPatient(appointment.patient_id)}
                >
                  Ver Ficha 360°
                </button>
              )}
            </div>
          </div>

          {/* Appointment Metadata */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4 }}>
                <Calendar size={13} />
                <span>Fecha</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{appointment.date}</div>
            </div>

            <div style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4 }}>
                <Clock size={13} />
                <span>Hora y Duración</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                {appointment.time} ({appointment.duration_min} min)
              </div>
            </div>
          </div>

          {/* Service & Specialist */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Especialidad & Servicio
              </span>
              <div style={{ fontWeight: 600, fontSize: "0.9375rem", marginTop: 4 }}>
                {appointment.specialty_name}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Profesional a cargo
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <img
                  src={appointment.professional_avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"}
                  alt={appointment.professional_name}
                  style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}
                />
                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{appointment.professional_name}</span>
                {appointment.room && (
                  <span style={{ fontSize: "0.75rem", backgroundColor: "#f1f5f9", padding: "2px 8px", borderRadius: "6px", color: "var(--text-secondary)" }}>
                    {appointment.room}
                  </span>
                )}
              </div>
            </div>

            {appointment.notes && (
              <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>
                  Notas Clínicas / Motivo
                </span>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: 0 }}>
                  {appointment.notes}
                </p>
              </div>
            )}
          </div>

          {/* Payment Status & Quick Pay */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <DollarSign size={16} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>Estado del Pago</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <StatusBadge status={appointment.payment_status} size="sm" />
                <span style={{ fontWeight: 800, fontSize: "1rem" }}>S/ {appointment.price.toFixed(2)}</span>
              </div>
            </div>

            {appointment.payment_status !== "paid" ? (
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: 8 }}>
                  Registrar cobro rápido:
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(["Yape", "Plin", "Efectivo", "Tarjeta"] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      className="btn btn-secondary"
                      style={{ fontSize: "0.75rem", padding: "6px 12px" }}
                      onClick={() => handleQuickPay(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: "0.8125rem", color: "var(--success-text)", backgroundColor: "var(--success-bg)", padding: "8px 12px", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={14} />
                <span>Pagado mediante {appointment.payment_method || "Efectivo"}</span>
              </div>
            )}
          </div>

          {/* Rescheduling Form */}
          {isRescheduling && (
            <form onSubmit={handleReschedule} style={{ backgroundColor: "#f8fafc", padding: 16, borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>Reprogramar Cita</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div className="form-group">
                  <label className="form-label">Nueva Fecha</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nueva Hora</label>
                  <input
                    type="time"
                    required
                    className="form-input"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsRescheduling(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          )}

          {/* Quick Actions Footer */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18, marginTop: "auto" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 12, textTransform: "uppercase" }}>
              Acciones Rápidas
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {appointment.status !== "confirmed" && (
                <button className="btn btn-secondary" onClick={() => handleStatus("confirmed")}>
                  <CheckCircle2 size={15} color="var(--success)" />
                  Confirmar
                </button>
              )}
              {appointment.status !== "attended" && (
                <button className="btn btn-secondary" onClick={() => handleStatus("attended")}>
                  <UserCheck size={15} color="var(--primary)" />
                  Atendida
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => setIsRescheduling(!isRescheduling)}>
                <RefreshCw size={15} />
                Reprogramar
              </button>
              {appointment.status !== "no_show" && (
                <button className="btn btn-secondary" onClick={() => handleStatus("no_show")}>
                  <AlertCircle size={15} color="var(--warning)" />
                  No asistió
                </button>
              )}
              {appointment.status !== "cancelled" && (
                <button
                  className="btn btn-danger-ghost"
                  style={{ gridColumn: "span 2" }}
                  onClick={() => handleStatus("cancelled")}
                >
                  <XCircle size={15} />
                  Cancelar Cita
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
