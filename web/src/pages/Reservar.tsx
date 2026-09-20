import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { useClinic, type Specialty, type Professional, type PaymentMethod } from "../context/ClinicContext";
import { useToast } from "../context/ToastContext";

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function Reservar() {
  const navigate = useNavigate();
  const { specialties, professionals, addAppointment } = useClinic();
  const { toast } = useToast();

  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>(specialties[0] || null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional>(professionals[0] || null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState<string>("09:30");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientDni, setPatientDni] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod] = useState<PaymentMethod>("Yape");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate next 14 calendar dates
  const nextDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const availableSlots = [
    { time: "08:00", available: true },
    { time: "08:45", available: true },
    { time: "09:30", available: true },
    { time: "10:15", available: false },
    { time: "11:00", available: true },
    { time: "11:45", available: true },
    { time: "14:00", available: true },
    { time: "14:45", available: true },
    { time: "15:30", available: true },
    { time: "16:15", available: true },
    { time: "17:00", available: true },
    { time: "17:45", available: false },
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) {
      toast("Por favor ingresa tu nombre y teléfono de contacto", "warning");
      return;
    }

    setIsSubmitting(true);

    addAppointment({
      patient_id: "pat-guest-" + Math.random().toString(36).substring(2, 7),
      patient_name: patientName,
      patient_phone: patientPhone,
      professional_id: selectedProfessional.id,
      professional_name: selectedProfessional.name,
      professional_avatar: selectedProfessional.avatar_url,
      specialty_id: selectedSpecialty.id,
      specialty_name: selectedSpecialty.name,
      date: selectedDate,
      time: selectedTime,
      duration_min: selectedSpecialty.duration_min,
      status: "confirmed",
      location_type: "consultorio",
      notes: notes || "Reserva realizada desde la web pública",
      room: "Box 1",
      price: selectedSpecialty.price,
      payment_status: "pending",
      payment_method: paymentMethod,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/mis-citas");
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-app)", display: "flex", flexDirection: "column" }}>
      {/* Header Bar */}
      <header
        style={{
          height: "64px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--text-primary)" }}>
          <div style={{ width: 34, height: 34, borderRadius: "10px", backgroundColor: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.125rem" }}>
            +
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em" }}>Klinic Pro</div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontWeight: 600 }}>RESERVA EN LÍNEA</div>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/" className="btn btn-ghost" style={{ fontSize: "0.8125rem" }}>
            <ChevronLeft size={16} />
            Volver al Inicio
          </Link>
          <Link to="/admin" className="btn btn-secondary" style={{ fontSize: "0.8125rem" }}>
            Panel Clínico SaaS
          </Link>
        </div>
      </header>

      {/* Main Reservation Container */}
      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "36px 20px 80px", width: "100%" }}>
        {/* Title Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "var(--primary-light)", color: "var(--primary)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, marginBottom: 12 }}>
            <Sparkles size={13} />
            <span>Disponibilidad en Tiempo Real</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#0f172a" }}>
            Reserva tu Cita Médica & Terapéutica
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: 4 }}>
            Elige la especialidad, selecciona tu profesional de preferencia y escoge el horario que mejor te convenga.
          </p>
        </div>

        <form onSubmit={handleBooking} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* STEP 1: SELECT SPECIALTY */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem" }}>
                1
              </div>
              <h3 style={{ fontSize: "1.0625rem", margin: 0 }}>Elige la Especialidad o Servicio</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
              {specialties.map((esp) => {
                const isSelected = selectedSpecialty?.id === esp.id;
                return (
                  <div
                    key={esp.id}
                    onClick={() => setSelectedSpecialty(esp)}
                    style={{
                      padding: "16px",
                      borderRadius: "var(--radius-md)",
                      border: `2px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                      backgroundColor: isSelected ? "var(--primary-light)" : "var(--surface)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h4 style={{ fontSize: "0.9375rem", color: isSelected ? "var(--primary)" : "var(--text-primary)", margin: 0 }}>
                          {esp.name}
                        </h4>
                        {isSelected && <CheckCircle2 size={16} color="var(--primary)" />}
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.4 }}>
                        {esp.description}
                      </p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>{esp.duration_min} min</span>
                      <span style={{ fontSize: "0.9375rem", fontWeight: 800, color: "var(--text-primary)" }}>S/ {esp.price.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: SELECT PROFESSIONAL */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem" }}>
                2
              </div>
              <h3 style={{ fontSize: "1.0625rem", margin: 0 }}>Selecciona al Profesional</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              {professionals.map((pro) => {
                const isSelected = selectedProfessional?.id === pro.id;
                return (
                  <div
                    key={pro.id}
                    onClick={() => setSelectedProfessional(pro)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "var(--radius-md)",
                      border: `2px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                      backgroundColor: isSelected ? "var(--primary-light)" : "var(--surface)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <img
                      src={pro.avatar_url}
                      alt={pro.name}
                      style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", color: isSelected ? "var(--primary)" : "var(--text-primary)" }}>
                        {pro.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        {pro.title}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={18} color="var(--primary)" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: SELECT DATE & TIME */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem" }}>
                3
              </div>
              <h3 style={{ fontSize: "1.0625rem", margin: 0 }}>Fecha y Horario de Atención</h3>
            </div>

            {/* Date Picker Carousel */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, marginBottom: 20 }}>
              {nextDates.map((dateStr) => {
                const dateObj = new Date(dateStr + "T00:00:00");
                const dayNum = dateObj.getDate();
                const dayName = WEEKDAYS[dateObj.getDay()];
                const monthName = MONTHS[dateObj.getMonth()];
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    style={{
                      minWidth: "64px",
                      padding: "10px 8px",
                      borderRadius: "var(--radius-md)",
                      border: `1.5px solid ${isSelected ? "var(--primary)" : "var(--border)"}`,
                      backgroundColor: isSelected ? "var(--primary)" : "var(--surface)",
                      color: isSelected ? "#ffffff" : "var(--text-primary)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <span style={{ fontSize: "0.6875rem", fontWeight: 600, opacity: isSelected ? 0.9 : 0.6 }}>
                      {dayName}
                    </span>
                    <span style={{ fontSize: "1.125rem", fontWeight: 800, margin: "2px 0" }}>
                      {dayNum}
                    </span>
                    <span style={{ fontSize: "0.6875rem", opacity: isSelected ? 0.9 : 0.6 }}>
                      {monthName}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Available Time Slots */}
            <div>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>
                Horarios Disponibles para el {selectedDate}:
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))", gap: 8 }}>
                {availableSlots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      style={{
                        padding: "9px 4px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        border: `1.5px solid ${isSelected ? "var(--primary)" : slot.available ? "var(--border)" : "#f1f5f9"}`,
                        backgroundColor: isSelected ? "var(--primary)" : slot.available ? "var(--surface)" : "#f8fafc",
                        color: isSelected ? "#ffffff" : slot.available ? "var(--text-primary)" : "#cbd5e1",
                        cursor: slot.available ? "pointer" : "not-allowed",
                        textDecoration: slot.available ? "none" : "line-through",
                        transition: "all var(--transition-fast)",
                      }}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 4: PATIENT CONTACT INFO & CONFIRMATION */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.875rem" }}>
                4
              </div>
              <h3 style={{ fontSize: "1.0625rem", margin: 0 }}>Tus Datos de Contacto</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Nombre y Apellidos *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ej. Carmen Rosa Morales"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono WhatsApp *</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  placeholder="+51 987 654 321"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">DNI / Documento</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="74892019"
                  value={patientDni}
                  onChange={(e) => setPatientDni(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Observaciones o motivo de consulta (opcional)</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Indica brevemente tus síntomas o dolencias..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Confirmation Summary Box */}
            <div style={{ padding: "16px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
              <div>
                <div style={{ fontWeight: 700, color: "#166534", fontSize: "0.9375rem" }}>
                  {selectedSpecialty?.name} con {selectedProfessional?.name}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#15803d", marginTop: 2 }}>
                  📅 {selectedDate} a las {selectedTime} ({selectedSpecialty?.duration_min} min)
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.75rem", color: "#15803d", display: "block" }}>Total a pagar en recepción</span>
                <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#14532d" }}>
                  S/ {selectedSpecialty?.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ padding: "12px 28px", fontSize: "1rem" }}
              >
                {isSubmitting ? "Confirmando Cita..." : "Confirmar Cita Médica"}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
