import { useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { useClinic, type Professional } from "../context/ClinicContext";

export default function Profesionales() {
  const { professionals } = useClinic();
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: "0.8125rem", fontWeight: 600, marginBottom: 4 }}>
            <span>Clínica</span>
            <span>/</span>
            <span>Equipo Médico</span>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Profesionales & Especialistas</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Directorio del cuerpo médico, asignación de especialidades y turnos de atención.
          </p>
        </div>
      </div>

      {/* Grid of Professionals */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {professionals.map((pro) => (
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
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: "var(--success-text)", backgroundColor: "var(--success-bg)", padding: "2px 8px", borderRadius: "999px", marginTop: 6, fontWeight: 600 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--success)" }} />
                  Activo en Agenda
                </div>
              </div>
            </div>

            {/* Specialties Badges */}
            <div>
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Especialidades Atendidas:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {pro.specialties.map((esp, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      backgroundColor: "var(--primary-light)",
                      color: "var(--primary)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    {esp}
                  </span>
                ))}
              </div>
            </div>

            {/* Schedule Summary */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, fontSize: "0.8125rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={14} color="var(--primary)" />
                <span>Lunes a Viernes: 08:00 - 13:00 / 15:00 - 19:00</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Calendar size={14} color="var(--primary)" />
                <span>Sábados: 09:00 - 13:00</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: "0.8125rem" }}
                onClick={() => setSelectedPro(pro)}
              >
                Configurar Horarios
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      {selectedPro && (
        <div className="modal-overlay" onClick={() => setSelectedPro(null)}>
          <div className="modal-card" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "1.125rem", margin: 0 }}>Horarios y Disponibilidad</h3>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{selectedPro.name}</span>
              </div>
              <button className="btn-icon" onClick={() => setSelectedPro(null)}>✕</button>
            </div>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((dia) => (
                <div key={dia} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{dia}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                    <span>08:00 - 13:00</span>
                    <span>•</span>
                    <span>15:00 - 19:00</span>
                    <span style={{ color: "var(--success)", fontWeight: 700 }}>✓</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-primary" onClick={() => setSelectedPro(null)}>
                Guardar Horarios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
