import { useParams, Link } from "react-router-dom";
import { Stethoscope, Clock, CheckCircle2, Calendar, UserCheck, ChevronLeft } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function ServicioDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const { specialties, professionals } = useClinic();

  // Match by slug or fallback to first
  const service = specialties.find(
    (s) => s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  ) || specialties[0];

  const assignedDoctors = professionals.filter((p) =>
    p.specialties.includes(service.name)
  );

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24 }}>
        <Link to="/servicios" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none", fontWeight: 600 }}>
          <ChevronLeft size={16} />
          Volver a todos los servicios
        </Link>
      </div>

      {/* Hero Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 36, alignItems: "center", marginBottom: 48 }} className="hero-grid">
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "var(--primary-light)", color: "var(--primary)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, marginBottom: 12 }}>
            <Stethoscope size={14} />
            <span>Especialidad Médica</span>
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            {service.name}
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
            {service.description}. Tratamiento especializado con enfoque terapéutico integral orientado a la recuperación biomecánica y el bienestar del paciente.
          </p>

          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <Link to="/reservar" className="btn btn-primary" style={{ padding: "12px 28px", fontSize: "1rem" }}>
              <Calendar size={18} />
              Reservar Cita Ahora
            </Link>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
              S/ {service.price.toFixed(2)}{" "}
              <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text-muted)" }}>/ sesión</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="card" style={{ padding: "28px", backgroundColor: "#ffffff" }}>
          <h3 style={{ fontSize: "1.125rem", marginBottom: 16 }}>Detalles de la Consulta</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Clock size={18} color="var(--primary)" />
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Duración</span>
                <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{service.duration_min} Minutos</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <UserCheck size={18} color="var(--primary)" />
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Modalidad</span>
                <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Presencial en Clínica</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Calendar size={18} color="var(--primary)" />
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Disponibilidad</span>
                <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--success-text)" }}>Lunes a Sábado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Qué Incluye & Beneficios */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
        <div className="card" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "1.125rem", marginBottom: 16 }}>¿Qué incluye la sesión?</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Evaluación física y postural completa",
              "Diagnóstico biomecánico y funcional",
              "Aplicación de técnicas y terapias específicas",
              "Pautas de ejercicios y ergonomía para el hogar",
              "Registro en historia clínica digital",
            ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "1.125rem", marginBottom: 16 }}>Beneficios del Tratamiento</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Alivio progresivo y duradero del dolor",
              "Recuperación del rango articular y fuerza muscular",
              "Prevención de recaídas y lesiones futuras",
              "Mejora sustancial en la calidad de vida y movilidad",
            ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Especialistas que atienden este servicio */}
      <div style={{ marginBottom: 48 }}>
        <h3 style={{ fontSize: "1.25rem", marginBottom: 20 }}>Especialistas Disponibles</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          {(assignedDoctors.length > 0 ? assignedDoctors : professionals).map((pro) => (
            <div key={pro.id} className="card" style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={pro.avatar_url}
                  alt={pro.name}
                  style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{pro.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{pro.title}</div>
                </div>
              </div>
              <Link to="/reservar" className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                Reservar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
