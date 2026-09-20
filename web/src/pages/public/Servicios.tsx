import { useState } from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Search, Clock, Calendar, CheckCircle2 } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

export default function Servicios() {
  const { specialties } = useClinic();
  const [search, setSearch] = useState("");

  const filtered = specialties.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Nuestros Servicios
        </span>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginTop: 4, letterSpacing: "-0.02em" }}>
          Especialidades Médicas & Terapias
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.0625rem", maxWidth: "600px", margin: "8px auto 24px" }}>
          Descubre los tratamientos especializados diseñados para tu bienestar y recuperación física.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: "420px", margin: "0 auto", position: "relative" }}>
          <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: 12 }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: "42px" }}
            placeholder="Buscar especialidad o terapia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Services */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {filtered.map((esp) => {
          const slug = esp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return (
            <div
              key={esp.id}
              className="card"
              style={{
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "14px",
                    backgroundColor: "var(--primary-light)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Stethoscope size={24} />
                </div>
                <h3 style={{ fontSize: "1.25rem", marginBottom: 8 }}>{esp.name}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {esp.description}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16 }}>
                  {["Evaluación diagnóstica personalizada", "Plan terapéutico por sesiones", "Seguimiento médico en tiempo real"].map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                      <CheckCircle2 size={14} color="var(--success)" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 28, paddingTop: 18, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    <Clock size={13} />
                    <span>{esp.duration_min} min por sesión</span>
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 2 }}>
                    S/ {esp.price.toFixed(2)}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Link to={`/servicios/${slug}`} className="btn btn-secondary" style={{ fontSize: "0.8125rem" }}>
                    Detalle
                  </Link>
                  <Link to="/reservar" className="btn btn-primary" style={{ fontSize: "0.8125rem" }}>
                    <Calendar size={14} />
                    Reservar
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
