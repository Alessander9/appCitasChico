import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  Plus, 
  Search, 
  Clock, 
  CalendarDays, 
  MapPin, 
  User, 
  X, 
  MessageCircle, 
  ExternalLink,
  RotateCcw
} from "lucide-react";
import { useClinic, type Appointment } from "../context/ClinicContext";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useToast } from "../context/ToastContext";
import { Pagination } from "../components/ui/Pagination";

export default function MisCitas() {
  const { appointments, cancelAppointment, rescheduleAppointment } = useClinic();
  const { toast } = useToast();

  const [activeFilter, setActiveFilter] = useState<"all" | "confirmed" | "pending" | "attended" | "cancelled">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  // Reprogram modal state
  const [reprogramApp, setReprogramApp] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("10:00");
  const [isSaving, setIsSaving] = useState(false);

  // Filter appointments
  const filteredAppointments = appointments.filter((app) => {
    // Status filter
    if (activeFilter !== "all" && app.status !== activeFilter) {
      return false;
    }
    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchSpecialty = app.specialty_name.toLowerCase().includes(q);
      const matchDoctor = app.professional_name.toLowerCase().includes(q);
      const matchDate = app.date.includes(q);
      const matchPatient = app.patient_name.toLowerCase().includes(q);
      return matchSpecialty || matchDoctor || matchDate || matchPatient;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredAppointments.length / pageSize) || 1;
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCancel = (id: string, specialtyName: string) => {
    if (window.confirm(`¿Estás seguro de que deseas cancelar tu cita de "${specialtyName}"?`)) {
      cancelAppointment(id);
      toast("Tu cita ha sido cancelada correctamente.", "info");
    }
  };

  const handleOpenReprogram = (app: Appointment) => {
    setReprogramApp(app);
    setNewDate(app.date);
    setNewTime(app.time);
  };

  const handleSaveReprogram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reprogramApp || !newDate || !newTime) return;

    setIsSaving(true);
    setTimeout(() => {
      rescheduleAppointment(reprogramApp.id, newDate, newTime);
      setIsSaving(false);
      setReprogramApp(null);
      toast(`Cita reprogramada con éxito para el ${newDate} a las ${newTime}.`, "success");
    }, 400);
  };

  const availableTimeSlots = [
    "08:00", "08:45", "09:30", "10:15", "11:00", "11:45",
    "14:00", "14:45", "15:30", "16:15", "17:00", "17:45"
  ];

  return (
    <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Header & Page Title */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start", 
        marginBottom: "32px", 
        flexWrap: "wrap", 
        gap: "16px" 
      }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
            <CalendarDays size={14} />
            Portal del Paciente
          </div>
          <h1 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: 0 }}>
            Mis Citas Médicas
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Consulta el estado de tus citas programadas, reprograma horarios o gestiona tus atenciones.
          </p>
        </div>

        <Link to="/reservar" className="btn btn-primary" style={{ padding: "11px 20px", borderRadius: "12px", fontSize: "14px", fontWeight: 700 }}>
          <Plus size={16} />
          Agendar nueva cita
        </Link>
      </div>

      {/* Filter and Search Controls */}
      <div style={{ 
        background: "white", 
        borderRadius: "16px", 
        border: "1px solid var(--border-subtle)", 
        padding: "16px 20px", 
        marginBottom: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
      }}>
        {/* Status Pill Filters */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            { id: "all", label: "Todas las citas", count: appointments.length },
            { id: "confirmed", label: "Confirmadas", count: appointments.filter(a => a.status === "confirmed").length },
            { id: "pending", label: "Pendientes", count: appointments.filter(a => a.status === "pending").length },
            { id: "attended", label: "Atendidas", count: appointments.filter(a => a.status === "attended").length },
            { id: "cancelled", label: "Canceladas", count: appointments.filter(a => a.status === "cancelled").length },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? "var(--primary)" : "var(--bg-app)",
                  color: isActive ? "white" : "var(--text-secondary)",
                  border: `1px solid ${isActive ? "var(--primary)" : "var(--border-subtle)"}`,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span>{tab.label}</span>
                <span style={{ 
                  fontSize: "11px", 
                  padding: "1px 6px", 
                  borderRadius: "999px", 
                  background: isActive ? "rgba(255,255,255,0.25)" : "var(--border)",
                  color: isActive ? "white" : "var(--text-muted)" 
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div style={{ position: "relative", minWidth: "260px", flex: "1 1 260px", maxWidth: "340px" }}>
          <Search size={15} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "11px" }} />
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por doctor, servicio o fecha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", paddingLeft: "36px", paddingRight: "12px", height: "36px", fontSize: "13px", borderRadius: "10px" }}
          />
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div style={{ 
          background: "white", 
          borderRadius: "20px", 
          border: "1px solid var(--border-subtle)", 
          padding: "56px 24px", 
          textAlign: "center" 
        }}>
          <div style={{ 
            width: "56px", 
            height: "56px", 
            borderRadius: "16px", 
            background: "var(--primary-light)", 
            color: "var(--primary)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 16px" 
          }}>
            <Calendar size={28} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
            No se encontraron citas
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "420px", margin: "0 auto 24px", lineHeight: 1.5 }}>
            {searchTerm || activeFilter !== "all" 
              ? "Prueba cambiando los filtros seleccionados o el término de búsqueda." 
              : "Aún no tienes citas médicas registradas en nuestro sistema. ¡Agenda tu primera consulta fácilmente!"}
          </p>
          <Link to="/reservar" className="btn btn-primary" style={{ padding: "12px 24px", borderRadius: "12px" }}>
            <Plus size={16} />
            Reservar una cita ahora
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {paginatedAppointments.map((app) => {
            const isCancelled = app.status === "cancelled";
            const isAttended = app.status === "attended";
            
            // Format nice date string
            const dateParts = app.date.split("-");
            const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            const dayName = dateObj.toLocaleDateString("es-ES", { weekday: "short" });
            const monthName = dateObj.toLocaleDateString("es-ES", { month: "short" });
            const dayNumber = dateParts[2];

            const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Cita Klinic Pro: " + app.specialty_name)}&dates=${app.date.replace(/-/g, "")}T${app.time.replace(/:/g, "")}00/${app.date.replace(/-/g, "")}T${(parseInt(app.time.split(":")[0]) + 1).toString().padStart(2, "0")}${app.time.split(":")[1]}00&details=${encodeURIComponent("Especialista: " + app.professional_name + " | Sede: Av. República de Panamá 3500")}&location=${encodeURIComponent("Klinic Pro - San Isidro, Lima")}`;

            const waDirectUrl = `https://wa.me/51987654321?text=${encodeURIComponent(`Hola Klinic Pro, tengo una consulta sobre mi cita de ${app.specialty_name} programada para el ${app.date} a las ${app.time} con ${app.professional_name}.`)}`;

            return (
              <div
                key={app.id}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  transition: "all 0.2s ease",
                  opacity: isCancelled ? 0.75 : 1
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <div style={{ 
                      width: "56px", 
                      height: "56px", 
                      borderRadius: "14px", 
                      background: isCancelled ? "#F1F5F9" : isAttended ? "#ECFDF5" : "var(--primary-light)", 
                      color: isCancelled ? "var(--text-muted)" : isAttended ? "#059669" : "var(--primary)",
                      display: "flex", 
                      flexDirection: "column", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: "10px", textTransform: "uppercase", lineHeight: 1 }}>{monthName}</span>
                      <span style={{ fontSize: "18px", lineHeight: 1 }}>{dayNumber}</span>
                      <span style={{ fontSize: "9px", textTransform: "capitalize", opacity: 0.8 }}>{dayName}</span>
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                          {app.specialty_name}
                        </h3>
                        <StatusBadge status={app.status} size="sm" />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px", flexWrap: "wrap" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                          <Clock size={14} color="var(--primary)" />
                          {app.time} hrs ({app.duration_min} min)
                        </span>
                        <span>•</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <User size={14} />
                          {app.professional_name}
                        </span>
                        <span>•</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <MapPin size={14} />
                          {app.room || "Box Principal"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                      S/ {app.price.toFixed(2)}
                    </div>
                    <div style={{ fontSize: "12px", color: app.payment_status === "paid" ? "#059669" : "#D97706", fontWeight: 600 }}>
                      {app.payment_status === "paid" ? "✓ Pagado" : "Pendiente de pago"}
                    </div>
                  </div>
                </div>

                {app.notes && (
                  <div style={{ background: "var(--bg-app)", padding: "10px 14px", borderRadius: "10px", fontSize: "12px", color: "var(--text-secondary)" }}>
                    <strong style={{ color: "var(--text-primary)" }}>Nota médica:</strong> {app.notes}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-subtle)", paddingTop: "14px", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <a
                      href={googleCalendarUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", gap: "5px" }}
                    >
                      <ExternalLink size={13} />
                      Google Calendar
                    </a>
                    <a
                      href={waDirectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", gap: "5px", color: "#059669" }}
                    >
                      <MessageCircle size={13} />
                      WhatsApp Soporte
                    </a>
                  </div>

                  {!isCancelled && !isAttended && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleOpenReprogram(app)}
                        className="btn btn-secondary"
                        style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", gap: "5px" }}
                      >
                        <RotateCcw size={13} />
                        Reprogramar
                      </button>
                      <button
                        onClick={() => handleCancel(app.id, app.specialty_name)}
                        className="btn btn-danger-ghost"
                        style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px" }}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAppointments.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setCurrentPage(1);
            }}
            pageSizeOptions={[3, 5, 10, 20]}
          />
        </div>
      )}

      {/* Reprogram Modal */}
      {reprogramApp && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setReprogramApp(null)}
        >
          <div 
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "32px",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <RotateCcw size={18} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>Reprogramar Cita</h3>
              </div>
              <button onClick={() => setReprogramApp(null)} className="btn-icon" style={{ width: "32px", height: "32px" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: "var(--bg-app)", padding: "14px 16px", borderRadius: "12px", marginBottom: "20px", fontSize: "13px" }}>
              <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{reprogramApp.specialty_name}</div>
              <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>Especialista: {reprogramApp.professional_name}</div>
            </div>

            <form onSubmit={handleSaveReprogram} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px", display: "block" }}>
                  Nueva Fecha deseada
                </label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={newDate} 
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", fontSize: "14px" }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px", display: "block" }}>
                  Nuevo Horario
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setNewTime(slot)}
                      style={{
                        padding: "8px 4px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: newTime === slot ? 700 : 500,
                        backgroundColor: newTime === slot ? "var(--primary)" : "#F8FAFC",
                        color: newTime === slot ? "white" : "var(--text-primary)",
                        border: `1px solid ${newTime === slot ? "var(--primary)" : "var(--border-subtle)"}`,
                        cursor: "pointer"
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setReprogramApp(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: "10px", borderRadius: "10px" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", fontWeight: 700 }}
                >
                  {isSaving ? "Guardando..." : "Confirmar Cambio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
