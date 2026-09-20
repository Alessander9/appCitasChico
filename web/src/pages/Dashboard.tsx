import { useState } from "react";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  UserCheck,
  DollarSign,
  TrendingUp,
  Activity,
  User
} from "lucide-react";
import { useClinic, type Appointment } from "../context/ClinicContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { StatsCard } from "../components/ui/StatsCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { AppointmentDrawer } from "../components/ui/AppointmentDrawer";
import { PatientDrawer } from "../components/ui/PatientDrawer";
import { ROLE_LABELS } from "../lib/jwt";

export default function Dashboard() {
  const { appointments, patients, kpiStats, updateAppointmentStatus } = useClinic();
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [selectedPatId, setSelectedPatId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  const selectedPatient = patients.find((p) => p.id === selectedPatId) || null;
  const roleInfo = user ? ROLE_LABELS[user.role] : null;

  const handleStatusAction = (e: React.MouseEvent, appId: string, action: "attend" | "confirm") => {
    e.stopPropagation();
    if (action === "attend") {
      updateAppointmentStatus(appId, "attended");
      toast("La cita ha sido marcada como ATENDIDA.", "success");
    } else {
      updateAppointmentStatus(appId, "confirmed");
      toast("La cita ha sido CONFIRMADA.", "success");
    }
  };

  const occupancyRooms = [
    { name: "Box 1 (Fisioterapia & Rehab)", doctor: "Dr. Carlos Pérez", percent: 90, color: "#4f46e5" },
    { name: "Gimnasio Terapéutico", doctor: "Lic. Ana García", percent: 75, color: "#10b981" },
    { name: "Consultorio 2 (Psicología)", doctor: "Dr. Roberto Mendoza", percent: 60, color: "#8b5cf6" },
    { name: "Box 3 (Acupuntura)", doctor: "Dra. Carmen Velasco", percent: 45, color: "#f59e0b" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Executive Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: "0.8125rem", fontWeight: 600, marginBottom: 4 }}>
            <span>Centro Médico & Terapéutico</span>
            <span>/</span>
            <span>Panel de Control</span>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>
            Bienvenido, {user?.name || "Administrador"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: 4 }}>
            Sesión iniciada con rol <span style={{ fontWeight: 700, color: roleInfo?.color || "var(--primary)" }}>{roleInfo?.title}</span>. Resumen operativo del día.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ padding: "8px 16px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 8, boxShadow: "var(--shadow-xs)" }}>
            <CalendarIcon size={16} color="var(--primary)" />
            <span style={{ textTransform: "capitalize" }}>
              {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 }}>
        <StatsCard
          title="Citas de Hoy"
          value={kpiStats.todayAppointments}
          trend={{ value: "↑ 12.5%", isPositive: true }}
          comparisonText="respecto a ayer"
          icon={<CalendarIcon size={20} />}
          color="#4f46e5"
        />
        <StatsCard
          title="Confirmadas"
          value={kpiStats.confirmed}
          trend={{ value: "85%", isPositive: true }}
          comparisonText="tasa de asistencia"
          icon={<CheckCircle2 size={20} />}
          color="#10b981"
        />
        <StatsCard
          title="Pendientes"
          value={kpiStats.pending}
          trend={{ value: "Por confirmar", isPositive: false }}
          comparisonText="en recepción"
          icon={<Clock size={20} />}
          color="#f59e0b"
        />
        <StatsCard
          title="Atendidas"
          value={kpiStats.attended}
          trend={{ value: "↑ 4", isPositive: true }}
          comparisonText="completadas"
          icon={<UserCheck size={20} />}
          color="#0ea5e9"
        />
        <StatsCard
          title="Ingresos del Día"
          value={`S/ ${kpiStats.todayRevenue.toFixed(2)}`}
          trend={{ value: "↑ 18.2%", isPositive: true }}
          comparisonText="vs día anterior"
          icon={<DollarSign size={20} />}
          color="#8b5cf6"
        />
      </div>

      {/* Main Content Layout: Today's Schedule & Quick Insights */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
        
        {/* Left Column: Agenda del Día */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 18, gridColumn: "span 2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "1.125rem", margin: 0, fontWeight: 800 }}>Próximas Citas de Hoy</h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 2 }}>
                Monitoreo y confirmación de pacientes en tiempo real.
              </p>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", backgroundColor: "var(--primary-light)", color: "var(--primary)" }}>
              {todayAppointments.length} Pacientes Agendados
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {todayAppointments.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                No hay citas programadas para hoy.
              </div>
            ) : (
              todayAppointments.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--bg-app)",
                    border: "1px solid var(--border-subtle)",
                    transition: "all var(--transition-fast)",
                    cursor: "pointer",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-focus)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Time Slot */}
                    <div style={{ padding: "6px 10px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontWeight: 800, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                      {app.time}
                    </div>

                    {/* Patient Photo & Info */}
                    <img
                      src={app.patient_avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"}
                      alt={app.patient_name}
                      style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }}
                    />

                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary)" }}>
                        {app.patient_name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                        <span>{app.specialty_name}</span>
                        <span>•</span>
                        <span style={{ color: "var(--primary)", fontWeight: 600 }}>{app.professional_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <StatusBadge status={app.status} size="sm" />

                    {app.status === "confirmed" && (
                      <button
                        onClick={(e) => handleStatusAction(e, app.id, "attend")}
                        className="btn btn-primary"
                        style={{ fontSize: "0.75rem", padding: "5px 10px", borderRadius: "8px" }}
                      >
                        Atender
                      </button>
                    )}

                    {app.status === "pending" && (
                      <button
                        onClick={(e) => handleStatusAction(e, app.id, "confirm")}
                        className="btn btn-secondary"
                        style={{ fontSize: "0.75rem", padding: "5px 10px", borderRadius: "8px" }}
                      >
                        Confirmar
                      </button>
                    )}

                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                      Ver Detalle →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Room Occupancy & Quick Stats */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 700, marginBottom: 2 }}>
              <Activity size={15} />
              <span>Tiempo Real</span>
            </div>
            <h3 style={{ fontSize: "1.125rem", margin: 0, fontWeight: 800 }}>Ocupación de Consultorios</h3>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 2 }}>
              Uso de boxes y gimnasio terapéutico.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {occupancyRooms.map((room, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8125rem" }}>
                  <div>
                    <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{room.name}</span>
                    <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>{room.doctor}</div>
                  </div>
                  <span style={{ fontWeight: 800, color: room.color }}>{room.percent}%</span>
                </div>
                
                {/* Progress Track */}
                <div style={{ height: "6px", width: "100%", backgroundColor: "var(--bg-app)", borderRadius: "999px", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ height: "100%", width: `${room.percent}%`, backgroundColor: room.color, borderRadius: "999px", transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Shortcuts */}
          <div style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <User size={14} color="var(--primary)" />
                <span>Total Pacientes: <strong>{patients.length}</strong></span>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--success)", fontWeight: 700, fontSize: "0.75rem" }}>
                <TrendingUp size={13} /> Óptimo
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Drawers */}
      <AppointmentDrawer
        appointment={selectedApp}
        onClose={() => setSelectedApp(null)}
        onOpenPatient={(patId) => {
          setSelectedApp(null);
          setSelectedPatId(patId);
        }}
      />

      <PatientDrawer
        patient={selectedPatient}
        onClose={() => setSelectedPatId(null)}
        onNewAppointment={() => setSelectedPatId(null)}
      />
    </div>
  );
}
