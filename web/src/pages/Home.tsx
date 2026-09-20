import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Stethoscope, Sparkles } from "lucide-react";
import { useClinic } from "../context/ClinicContext";

export default function Home() {
  const { specialties } = useClinic();

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-app)" }}>
      {/* Navigation Bar for Public */}
      <header
        style={{
          height: "64px",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
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
            <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontWeight: 600 }}>CENTRO MÉDICO & TERAPÉUTICO</div>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/reservar" className="btn btn-secondary" style={{ fontSize: "0.8125rem" }}>
            <Calendar size={15} />
            Reservar Cita
          </Link>
          <Link to="/admin" className="btn btn-primary" style={{ fontSize: "0.8125rem" }}>
            <span>Acceso Sistema SaaS</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "var(--primary-light)", color: "var(--primary)", padding: "6px 14px", borderRadius: "999px", fontSize: "0.8125rem", fontWeight: 700, marginBottom: 20 }}>
          <Sparkles size={14} />
          <span>Plataforma Clínica de Salud & Terapia</span>
        </div>

        <h1 style={{ fontSize: "2.75rem", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em", color: "#0f172a", marginBottom: 20 }}>
          Gestión moderna de citas médicas y atención integral de pacientes
        </h1>

        <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: "680px", margin: "0 auto 32px", lineHeight: 1.6 }}>
          Agenda consultas en segundos, accede a tu historial clínico y recibe recordatorios automáticos de tus sesiones terapéuticas.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <Link to="/reservar" className="btn btn-primary" style={{ padding: "12px 28px", fontSize: "1rem" }}>
            <Calendar size={18} />
            Reservar Cita en Línea
          </Link>
          <Link to="/admin" className="btn btn-secondary" style={{ padding: "12px 28px", fontSize: "1rem" }}>
            Ingresar al Panel Clínico →
          </Link>
        </div>
      </section>

      {/* Specialties Preview */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Nuestras Especialidades de Salud</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: 4 }}>
            Atención profesional con tecnología de vanguardia y especialistas certificados.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {specialties.map((esp) => (
            <div key={esp.id} className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ width: 44, height: 44, borderRadius: "12px", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Stethoscope size={22} />
                </div>
                <h3 style={{ fontSize: "1.0625rem", marginBottom: 6 }}>{esp.name}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {esp.description}
                </p>
              </div>

              <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 600 }}>{esp.duration_min} min</span>
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)" }}>S/ {esp.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
