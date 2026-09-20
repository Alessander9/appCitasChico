import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Stethoscope,
  Sparkles,
  Users,
  Award,
  Star,
  ChevronDown,
} from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function PublicHome() {
  const navigate = useNavigate();
  const { specialties, professionals } = useClinic();

  // Quick Booking Bar State
  const [quickSpecialty, setQuickSpecialty] = useState(specialties[0]?.id || "");
  const [quickDoctor, setQuickDoctor] = useState(professionals[0]?.id || "");
  const [quickDate, setQuickDate] = useState(new Date().toISOString().split("T")[0]);

  // FAQ open/close state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/reservar");
  };

  const trustMetrics = [
    { value: "+10,000", label: "Pacientes Atendidos", icon: <Users size={20} color="var(--primary)" /> },
    { value: "+25", label: "Especialistas Certificados", icon: <UserCheck size={20} color="var(--success)" /> },
    { value: "+15", label: "Especialidades Médicas", icon: <Stethoscope size={20} color="var(--info)" /> },
    { value: "+5 años", label: "Experiencia & Calidad", icon: <Award size={20} color="var(--warning)" /> },
  ];

  const howItWorksSteps = [
    {
      num: "01",
      title: "Elige el servicio",
      desc: "Selecciona la especialidad o terapia que requieres para tu atención.",
    },
    {
      num: "02",
      title: "Selecciona tu especialista",
      desc: "Escoge a tu doctor o terapeuta de preferencia según su trayectoria.",
    },
    {
      num: "03",
      title: "Elige fecha y horario",
      desc: "Visualiza la agenda en tiempo real y aparta el bloque horario ideal.",
    },
    {
      num: "04",
      title: "Confirma tu cita",
      desc: "Ingresa tus datos y recibe recordatorios automáticos al instante.",
    },
  ];

  const testimonials = [
    {
      name: "María Fernández",
      service: "Terapia Física & Rehabilitación",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      comment: "Excelente atención y puntualidad. Gracias a las sesiones de fisioterapia pude recuperarme de mi lesión lumbar en tiempo récord.",
    },
    {
      name: "Renato Salazar",
      service: "Terapia Manual Ortopédica",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      comment: "El Dr. Carlos Pérez es un gran profesional. La plataforma para agendar citas es sumamente rápida y sin complicaciones.",
    },
    {
      name: "Elena Valdivia",
      service: "Psicología Clínica",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      comment: "Ambiente muy cálido y acogedor. El sistema de recordatorios por WhatsApp ayuda muchísimo a no olvidar las sesiones.",
    },
  ];

  const faqs = [
    {
      q: "¿Necesito registrarme para reservar una cita?",
      a: "No es obligatorio crear una cuenta previamente. Solo requieres ingresar tu nombre y WhatsApp durante el proceso de reserva para confirmar tu cupo.",
    },
    {
      q: "¿Qué métodos de pago aceptan?",
      a: "Aceptamos Yape, Plin, Efectivo, Tarjetas de Crédito/Débito (Visa, Mastercard) y Transferencias bancarias directas en recepción.",
    },
    {
      q: "¿Puedo reprogramar o cancelar mi cita si tengo un imprevisto?",
      a: "Sí, puedes ingresar al apartado 'Mis Citas' o escribirnos directamente a nuestro WhatsApp con al menos 2 horas de anticipación para cambiar tu horario sin recargo.",
    },
    {
      q: "¿Cuánto dura una sesión de atención?",
      a: "La duración varía entre 45 y 50 minutos según la especialidad terapéutica o médica seleccionada.",
    },
    {
      q: "¿Qué debo llevar a mi primera consulta?",
      a: "Te recomendamos acudir con tu DNI y cualquier examen auxiliar previo (radiografías, resonancias o informes médicos) si los tuvieras.",
    },
  ];

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{ position: "relative", overflow: "hidden", backgroundColor: "#ffffff", borderBottom: "1px solid var(--border)", paddingTop: "60px", paddingBottom: "70px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "center" }} className="hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "var(--primary-light)", color: "var(--primary)", padding: "6px 14px", borderRadius: "999px", fontSize: "0.8125rem", fontWeight: 700, marginBottom: 18 }}>
              <Sparkles size={14} />
              <span>Salud & Bienestar Integral</span>
            </div>

            <h1 style={{ fontSize: "2.875rem", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em", color: "#0f172a", marginBottom: 18 }}>
              Tu salud, en las mejores manos.
            </h1>

            <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 28, maxWidth: "520px" }}>
              Reserva tu cita con nuestros especialistas certificados de forma rápida, sencilla y segura. Atención personalizada orientada a tu recuperación.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/reservar" className="btn btn-primary" style={{ padding: "12px 24px", fontSize: "1rem" }}>
                <Calendar size={18} />
                Reservar Cita en Línea
              </Link>
              <Link to="/servicios" className="btn btn-secondary" style={{ padding: "12px 22px", fontSize: "1rem" }}>
                Ver Especialidades
              </Link>
            </div>
          </div>

          {/* Hero Visual Composition */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                boxShadow: "0 20px 40px -10px rgba(15, 23, 42, 0.15)",
                border: "1px solid var(--border)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80"
                alt="Atención médica profesional"
                style={{ width: "100%", height: "380px", objectFit: "cover", display: "block" }}
              />
            </div>

            {/* Floating Trust Card */}
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                left: "-20px",
                backgroundColor: "#ffffff",
                padding: "14px 18px",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-xl)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "var(--success-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={22} color="var(--success)" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "var(--text-primary)" }}>
                  Atención Garantizada
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Especialistas 100% colegiados
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK BOOKING BAR (Floating below Hero) */}
      <section style={{ maxWidth: "1100px", margin: "-32px auto 60px", padding: "0 24px", position: "relative", zIndex: 20 }}>
        <form
          onSubmit={handleQuickSearch}
          className="card"
          style={{
            padding: "20px 24px",
            boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.1)",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr auto",
            gap: 16,
            alignItems: "flex-end",
          }}
        >
          <div className="form-group">
            <label className="form-label">¿Qué atención necesitas?</label>
            <select
              className="form-select"
              value={quickSpecialty}
              onChange={(e) => setQuickSpecialty(e.target.value)}
            >
              {specialties.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">¿Quién te atenderá?</label>
            <select
              className="form-select"
              value={quickDoctor}
              onChange={(e) => setQuickDoctor(e.target.value)}
            >
              <option value="any">Cualquier especialista disponible</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">¿Cuándo?</label>
            <input
              type="date"
              className="form-input"
              value={quickDate}
              onChange={(e) => setQuickDate(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px" }}>
            <span>Ver disponibilidad</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </section>

      {/* 3. SOCIAL PROOF & TRUST METRICS */}
      <section style={{ maxWidth: "1200px", margin: "0 auto 80px", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            padding: "32px 24px",
            backgroundColor: "#ffffff",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border)",
          }}
        >
          {trustMetrics.map((metric, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-app)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {metric.icon}
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  {metric.value}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                  {metric.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ESPECIALIDADES Y SERVICIOS */}
      <section style={{ maxWidth: "1200px", margin: "0 auto 90px", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Nuestras Especialidades
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: 4 }}>
              Encuentra la atención que necesitas
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: 4 }}>
              Tratamientos personalizados y seguimiento clínico con los mejores profesionales.
            </p>
          </div>
          <Link to="/servicios" className="btn btn-secondary">
            Ver todas las especialidades →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {specialties.map((esp) => {
            const slug = esp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <div
                key={esp.id}
                className="card"
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform var(--transition-fast), border-color var(--transition-fast)",
                }}
              >
                <div>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      backgroundColor: "var(--primary-light)",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Stethoscope size={22} />
                  </div>
                  <h3 style={{ fontSize: "1.125rem", marginBottom: 6 }}>{esp.name}</h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {esp.description}
                  </p>
                </div>

                <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", display: "block" }}>Desde</span>
                    <span style={{ fontSize: "1.0625rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      S/ {esp.price.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    to={`/servicios/${slug}`}
                    className="btn btn-ghost"
                    style={{ fontSize: "0.8125rem", padding: "6px 10px", color: "var(--primary)", fontWeight: 700 }}
                  >
                    Ver servicio →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CÓMO FUNCIONA (4 PASOS) */}
      <section style={{ backgroundColor: "#ffffff", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "80px 24px", marginBottom: 90 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Flujo Rápido & Simple
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: 4 }}>
              ¿Cómo agendar tu cita en 1 minuto?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: 4 }}>
              Sin registros complicados, con disponibilidad en tiempo real.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 24 }}>
            {howItWorksSteps.map((step) => (
              <div
                key={step.num}
                style={{
                  padding: "24px 20px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--bg-app)",
                  border: "1px solid var(--border)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 900,
                    color: "var(--primary)",
                    opacity: 0.8,
                    marginBottom: 8,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {step.num}
                </div>
                <h3 style={{ fontSize: "1.0625rem", marginBottom: 6 }}>{step.title}</h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ESPECIALISTAS */}
      <section style={{ maxWidth: "1200px", margin: "0 auto 90px", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Cuerpo Médico
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: 4 }}>
              Conoce a nuestros especialistas
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: 4 }}>
              Profesionales titulados con amplia experiencia en medicina física y salud integral.
            </p>
          </div>
          <Link to="/profesionales" className="btn btn-secondary">
            Ver todos los doctores →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {professionals.map((pro) => {
            const slug = pro.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <div key={pro.id} className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <img
                    src={pro.avatar_url}
                    alt={pro.name}
                    style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: `2px solid ${pro.color}` }}
                  />
                  <div>
                    <h3 style={{ fontSize: "1.0625rem", margin: 0 }}>{pro.name}</h3>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: 2 }}>
                      {pro.title}
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.6875rem", color: "var(--success-text)", backgroundColor: "var(--success-bg)", padding: "2px 8px", borderRadius: "999px", marginTop: 6, fontWeight: 700 }}>
                      ● Horarios disponibles hoy
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {pro.specialties.map((esp, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        backgroundColor: "var(--primary-light)",
                        color: "var(--primary)",
                        padding: "3px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {esp}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
                  <Link
                    to={`/profesionales/${slug}`}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: "0.8125rem" }}
                  >
                    Ver Perfil
                  </Link>
                  <Link
                    to="/reservar"
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: "0.8125rem" }}
                  >
                    Reservar
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. TESTIMONIOS */}
      <section style={{ backgroundColor: "#ffffff", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "80px 24px", marginBottom: 90 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Experiencias Reales
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: 4 }}>
              Lo que dicen nuestros pacientes
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", gap: 4, color: "#f59e0b", marginBottom: 12 }}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" />
                    ))}
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, fontStyle: "italic" }}>
                    "{t.comment}"
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>{t.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.service}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PREGUNTAS FRECUENTES (FAQ) */}
      <section style={{ maxWidth: "800px", margin: "0 auto 90px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Dudas Comunes
          </span>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: 4 }}>
            Preguntas Frecuentes
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="card"
                style={{
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color var(--transition-fast)",
                }}
                onClick={() => setOpenFaq(isOpen ? null : index)}
              >
                <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: "0.9375rem" }}>
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 200ms ease",
                      color: "var(--text-muted)",
                    }}
                  />
                </div>
                {isOpen && (
                  <div style={{ padding: "0 20px 18px", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section style={{ maxWidth: "1100px", margin: "0 auto 80px", padding: "0 24px" }}>
        <div
          style={{
            padding: "50px 32px",
            backgroundColor: "var(--primary)",
            borderRadius: "var(--radius-xl)",
            color: "#ffffff",
            textAlign: "center",
            boxShadow: "0 20px 40px -10px var(--primary-glow)",
          }}
        >
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#ffffff", marginBottom: 12 }}>
            Agenda tu próxima cita hoy mismo
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "rgba(255, 255, 255, 0.9)", maxWidth: "560px", margin: "0 auto 28px", lineHeight: 1.6 }}>
            Elige a tu especialista y confirma tu horario en pocos minutos. Estamos listos para cuidar de ti.
          </p>
          <Link
            to="/reservar"
            className="btn btn-secondary"
            style={{
              padding: "14px 32px",
              fontSize: "1rem",
              backgroundColor: "#ffffff",
              color: "var(--primary)",
              fontWeight: 800,
              border: "none",
            }}
          >
            <Calendar size={18} />
            Reservar Cita Médica
          </Link>
        </div>
      </section>
    </div>
  );
}
