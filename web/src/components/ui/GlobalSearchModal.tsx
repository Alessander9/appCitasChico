import { useState, useEffect } from "react";
import { Search, User, Calendar, Stethoscope, ArrowRight } from "lucide-react";
import { useClinic } from "../../context/ClinicContext";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPatient: (id: string) => void;
  onSelectAppointment: (id: string) => void;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  onSelectPatient,
  onSelectAppointment,
}: GlobalSearchModalProps) {
  const { patients, appointments, professionals } = useClinic();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedPatients = q
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.dni.includes(q) ||
          p.phone.includes(q) ||
          p.clinical_history.diagnostico.toLowerCase().includes(q)
      )
    : [];

  const matchedAppointments = q
    ? appointments.filter(
        (a) =>
          a.patient_name.toLowerCase().includes(q) ||
          a.professional_name.toLowerCase().includes(q) ||
          a.specialty_name.toLowerCase().includes(q)
      )
    : [];

  const matchedProfessionals = q
    ? professionals.filter(
        (pr) =>
          pr.name.toLowerCase().includes(q) ||
          pr.specialties.some((s) => s.toLowerCase().includes(q))
      )
    : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 580, marginTop: "10vh", alignSelf: "flex-start" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Search size={20} color="var(--primary)" />
          <input
            type="text"
            className="form-input"
            style={{
              border: "none",
              boxShadow: "none",
              fontSize: "1rem",
              padding: 0,
            }}
            placeholder="Buscar pacientes, citas, historias clínicas o doctores..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <span
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              backgroundColor: "var(--surface-hover)",
              padding: "2px 6px",
              borderRadius: "4px",
              color: "var(--text-muted)",
            }}
          >
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: "400px", overflowY: "auto", padding: "12px 16px" }}>
          {!q ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Escribe un nombre, DNI, teléfono o diagnóstico para buscar instantáneamente.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Patients Group */}
              {matchedPatients.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>
                    Pacientes & Historias Clínicas ({matchedPatients.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {matchedPatients.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectPatient(p.id);
                          onClose();
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: "var(--radius-md)",
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          transition: "background var(--transition-fast)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <User size={16} color="var(--primary)" />
                          <div>
                            <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{p.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              DNI: {p.dni} • Diagnóstico: {p.clinical_history.diagnostico}
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={14} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointments Group */}
              {matchedAppointments.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>
                    Citas Programadas ({matchedAppointments.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {matchedAppointments.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onSelectAppointment(a.id);
                          onClose();
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: "var(--radius-md)",
                          cursor: "pointer",
                          transition: "background var(--transition-fast)",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--surface-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Calendar size={16} color="var(--info)" />
                          <div>
                            <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                              {a.patient_name} — {a.specialty_name}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              {a.date} a las {a.time} con {a.professional_name}
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={14} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctors Group */}
              {matchedProfessionals.length > 0 && (
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase" }}>
                    Profesionales de Salud ({matchedProfessionals.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {matchedProfessionals.map((pr) => (
                      <div
                        key={pr.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Stethoscope size={16} color="var(--success)" />
                          <div>
                            <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{pr.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{pr.title}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchedPatients.length === 0 && matchedAppointments.length === 0 && matchedProfessionals.length === 0 && (
                <div style={{ padding: "24px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                  No se encontraron resultados para "{query}".
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
