import { Link } from "react-router-dom";
import { Calendar, ShieldCheck } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function Especialistas() {
  const { professionals } = useClinic();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Cuerpo Médico
        </span>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginTop: 4, letterSpacing: "-0.02em" }}>
          Nuestros Especialistas de Salud
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.0625rem", maxWidth: "600px", margin: "8px auto 0" }}>
          Médicos y terapeutas certificados dedicados a brindarte un diagnóstico preciso y una atención humana.
        </p>
      </div>

      {/* Grid of Specialists */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
        {professionals.map((pro) => {
          const slug = pro.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return (
            <div
              key={pro.id}
              className="card"
              style={{
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <img
                  src={pro.avatar_url}
                  alt={pro.name}
                  style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `2px solid ${pro.color}` }}
                />
                <div>
                  <h3 style={{ fontSize: "1.1875rem", margin: 0 }}>{pro.name}</h3>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: 2 }}>
                    {pro.title}
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.75rem", color: "var(--success-text)", backgroundColor: "var(--success-bg)", padding: "2px 8px", borderRadius: "999px", marginTop: 6, fontWeight: 700 }}>
                    <ShieldCheck size={12} />
                    Colegiado & Certificado
                  </div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                  Áreas de Especialidad:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {pro.specialties.map((esp, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor: "var(--primary-light)",
                        color: "var(--primary)",
                        padding: "4px 10px",
                        borderRadius: "6px",
                      }}
                    >
                      {esp}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", gap: 10, marginTop: "auto" }}>
                <Link
                  to={`/profesionales/${slug}`}
                  className="btn btn-secondary"
                  style={{ flex: 1, fontSize: "0.875rem" }}
                >
                  Ver Perfil
                </Link>
                <Link
                  to="/reservar"
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: "0.875rem" }}
                >
                  <Calendar size={15} />
                  Reservar
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
