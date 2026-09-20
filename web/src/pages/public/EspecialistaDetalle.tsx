import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, ShieldCheck, ChevronLeft, CheckCircle2 } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function EspecialistaDetalle() {
  const { slug } = useParams<{ slug: string }>();
  const { professionals } = useClinic();

  const doctor = professionals.find(
    (p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  ) || professionals[0];

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24 }}>
        <Link to="/profesionales" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none", fontWeight: 600 }}>
          <ChevronLeft size={16} />
          Volver a todos los especialistas
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="card doctor-header-grid" style={{ padding: "36px", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 28, alignItems: "center", marginBottom: 36 }}>
        <img
          src={doctor.avatar_url}
          alt={doctor.name}
          style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover", border: `3px solid ${doctor.color}` }}
        />

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>{doctor.name}</h1>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "var(--success-text)", backgroundColor: "var(--success-bg)", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>
              <ShieldCheck size={13} />
              Verificado
            </div>
          </div>
          <div style={{ fontSize: "1rem", color: "var(--text-secondary)", fontWeight: 600 }}>
            {doctor.title}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            {doctor.specialties.map((esp, i) => (
              <span key={i} style={{ fontSize: "0.75rem", fontWeight: 600, backgroundColor: "var(--primary-light)", color: "var(--primary)", padding: "4px 10px", borderRadius: "6px" }}>
                {esp}
              </span>
            ))}
          </div>
        </div>

        <div>
          <Link to="/reservar" className="btn btn-primary" style={{ padding: "12px 24px", fontSize: "0.9375rem" }}>
            <Calendar size={16} />
            Reservar Cita
          </Link>
        </div>
      </div>

      {/* Bio, Experience & Schedule */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "1.125rem", marginBottom: 12 }}>Sobre el Especialista</h3>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Especialista con más de 8 años de trayectoria clínica en el diagnóstico, tratamiento y rehabilitación funcional de pacientes. Enfoque holístico y biomecánico basado en la evidencia médica.
            </p>
          </div>

          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "1.125rem", marginBottom: 16 }}>Formación & Trayectoria</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "Médico Cirujano / Licenciado titulado con honores",
                "Miembro activo del Colegio Profesional de la Salud",
                "Certificación internacional en Terapia Manual y Rehabilitación",
                "Más de 3,500 pacientes atendidos con éxito",
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  <CheckCircle2 size={16} color="var(--primary)" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule & Location Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "1.125rem", marginBottom: 16 }}>Horarios de Atención</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.8125rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontWeight: 600 }}>Lunes a Viernes</span>
                <span style={{ color: "var(--text-secondary)" }}>08:00 - 13:00 / 15:00 - 19:00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontWeight: 600 }}>Sábados</span>
                <span style={{ color: "var(--text-secondary)" }}>09:00 - 13:00</span>
              </div>
            </div>

            <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              <MapPin size={16} color="var(--primary)" />
              <span>Sede Principal San Borja</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
