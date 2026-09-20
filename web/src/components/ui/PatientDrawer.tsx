import { useState } from "react";
import {
  X,
  Calendar,
  Phone,
  Mail,
  Plus,
  FileText,
  Scale,
  Edit2,
  Trash2,
  MapPin,
  Sparkles,
  Flame,
  Droplets,
  Ruler,
  DollarSign,
  Package,
  Activity,
  HeartPulse,
} from "lucide-react";
import {
  useClinic,
  type Patient,
  type SessionEvaluation,
} from "../../context/ClinicContext";
import { StatusBadge } from "./StatusBadge";
import { PatientBioCharts } from "./PatientBioCharts";
import { PatientClinicalPDFModal } from "./PatientClinicalPDFModal";
import { ImcIndicator, calculateImc } from "./ImcIndicator";
import { SearchableSelect } from "./SearchableSelect";

interface PatientDrawerProps {
  patient: Patient | null;
  onClose: () => void;
  onNewAppointment?: (patientId: string) => void;
}

type TabType = "resumen" | "sesiones" | "grafico" | "paquetes" | "dietas" | "citas" | "historia" | "pagos";

export function PatientDrawer({ patient, onClose, onNewAppointment }: PatientDrawerProps) {
  const {
    appointments,
    payments,
    sessionEvaluations,
    treatmentPackages,
    dietPlans,
    stimuliList,
    addSessionEvaluation,
    updateSessionEvaluation,
    deleteSessionEvaluation,
    addTreatmentPackage,
    updatePatient,
  } = useClinic();

  const [activeTab, setActiveTab] = useState<TabType>("resumen");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionEvaluation | null>(null);

  // New session form states
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [sessionWeight, setSessionWeight] = useState(65.0);
  const [sessionFat, setSessionFat] = useState(25.0);
  const [sessionWater, setSessionWater] = useState(52.0);
  const [sessionMuscle, setSessionMuscle] = useState(30.0);
  const [sessionMetabolicAge, setSessionMetabolicAge] = useState(35);
  const [sessionKcal, setSessionKcal] = useState(1450);
  const [sessionStimulus, setSessionStimulus] = useState(stimuliList[0] || "Acupuntura");
  const [sessionPatterns, setSessionPatterns] = useState("");
  const [sessionLifestyle, setSessionLifestyle] = useState("");
  const [sessionDiet, setSessionDiet] = useState("");
  const [sessionObs, setSessionObs] = useState("");

  // Edit patient reference targets state
  const [isEditingTargets, setIsEditingTargets] = useState(false);
  const [targetHeight, setTargetHeight] = useState(patient?.reference_targets?.height_cm || 165);
  const [targetWeight, setTargetWeight] = useState(patient?.reference_targets?.ideal_weight || 60);
  const [targetFat, setTargetFat] = useState(patient?.reference_targets?.ideal_fat_pct || 20);
  const [targetImc, setTargetImc] = useState(patient?.reference_targets?.ideal_imc || 22);

  // New package modal state
  const [isNewPkgModalOpen, setIsNewPkgModalOpen] = useState(false);
  const [pkgName, setPkgName] = useState("Paquete Terapéutico Integral (10 Sesiones)");
  const [pkgTotal, setPkgTotal] = useState(10);
  const [pkgPrice, setPkgPrice] = useState(750);

  if (!patient) return null;

  const patientAppointments = appointments.filter((a) => a.patient_id === patient.id);
  const patientPayments = payments.filter((p) => p.patient_name === patient.name);
  const patientSessions = sessionEvaluations.filter((s) => s.patient_id === patient.id);
  const patientPackages = treatmentPackages.filter((p) => p.patient_id === patient.id);
  const activePackage = patientPackages.find((p) => p.status === "active") || patientPackages[0];
  const patientDiet = dietPlans.find((d) => d.patient_id === patient.id) || dietPlans[0];

  // Calculate IMC dynamically based on height
  const heightM = (patient.reference_targets?.height_cm || 165) / 100;
  const calculatedImc = heightM > 0 ? Number((sessionWeight / (heightM * heightM)).toFixed(1)) : 23.0;

  const handleOpenNewSession = () => {
    setEditingSession(null);
    setSessionDate(new Date().toISOString().split("T")[0]);
    const lastSession = patientSessions[patientSessions.length - 1];
    if (lastSession) {
      setSessionWeight(lastSession.weight);
      setSessionFat(lastSession.fat_pct);
      setSessionWater(lastSession.water_pct);
      setSessionMuscle(lastSession.muscle_pct);
      setSessionMetabolicAge(lastSession.metabolic_age);
      setSessionKcal(lastSession.kcal);
      setSessionStimulus(lastSession.stimulus_applied || stimuliList[0]);
      setSessionPatterns(lastSession.patterns_observed || "");
      setSessionLifestyle(lastSession.lifestyle_notes || "");
    }
    setIsNewSessionModalOpen(true);
  };

  const handleOpenEditSession = (session: SessionEvaluation) => {
    setEditingSession(session);
    setSessionDate(session.date);
    setSessionWeight(session.weight);
    setSessionFat(session.fat_pct);
    setSessionWater(session.water_pct);
    setSessionMuscle(session.muscle_pct);
    setSessionMetabolicAge(session.metabolic_age);
    setSessionKcal(session.kcal);
    setSessionStimulus(session.stimulus_applied);
    setSessionPatterns(session.patterns_observed);
    setSessionLifestyle(session.lifestyle_notes);
    setSessionDiet(session.diet_assigned || "");
    setSessionObs(session.observations || "");
    setIsNewSessionModalOpen(true);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSession) {
      updateSessionEvaluation(editingSession.id, {
        date: sessionDate,
        weight: Number(sessionWeight),
        imc: calculatedImc,
        fat_pct: Number(sessionFat),
        water_pct: Number(sessionWater),
        muscle_pct: Number(sessionMuscle),
        metabolic_age: Number(sessionMetabolicAge),
        kcal: Number(sessionKcal),
        stimulus_applied: sessionStimulus,
        patterns_observed: sessionPatterns,
        lifestyle_notes: sessionLifestyle,
        diet_assigned: sessionDiet,
        observations: sessionObs,
      });
    } else {
      addSessionEvaluation({
        patient_id: patient.id,
        session_number: patientSessions.length + 1,
        date: sessionDate,
        weight: Number(sessionWeight),
        imc: calculatedImc,
        fat_pct: Number(sessionFat),
        water_pct: Number(sessionWater),
        muscle_pct: Number(sessionMuscle),
        metabolic_age: Number(sessionMetabolicAge),
        kcal: Number(sessionKcal),
        stimulus_applied: sessionStimulus,
        patterns_observed: sessionPatterns,
        lifestyle_notes: sessionLifestyle,
        diet_assigned: sessionDiet,
        observations: sessionObs,
      });
    }
    setIsNewSessionModalOpen(false);
  };

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient(patient.id, {
      reference_targets: {
        height_cm: Number(targetHeight),
        ideal_weight: Number(targetWeight),
        ideal_fat_pct: Number(targetFat),
        ideal_imc: Number(targetImc),
      },
    });
    setIsEditingTargets(false);
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    addTreatmentPackage({
      patient_id: patient.id,
      name: pkgName,
      total_sessions: Number(pkgTotal),
      used_sessions: 0,
      price: Number(pkgPrice),
      status: "active",
      start_date: new Date().toISOString().split("T")[0],
    });
    setIsNewPkgModalOpen(false);
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}>
        <div className="drawer-panel" style={{ maxWidth: 740 }} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div
            style={{
              padding: "18px 24px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              backgroundColor: "var(--surface)",
            }}
          >
            <div style={{ display: "flex", gap: 14 }}>
              <img
                src={patient.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                alt={patient.name}
                style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: "1.125rem", margin: 0 }}>{patient.name}</h3>
                  <StatusBadge status={patient.status} size="sm" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.8125rem", color: "var(--text-secondary)", flexWrap: "wrap" }}>
                  <span>DNI: <strong>{patient.dni}</strong></span>
                  <span>•</span>
                  <span>{patient.age} años</span>
                  <span>•</span>
                  <span>{patient.reference_targets?.height_cm || 165} cm</span>
                  <span>•</span>
                  <span>{patientSessions.length} evaluaciones</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsPdfModalOpen(true)}
                style={{ color: "var(--primary)", borderColor: "var(--primary)" }}
              >
                <FileText size={14} />
                Ficha PDF
              </button>
              <button className="btn-icon" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Contact Strip */}
          <div style={{ padding: "10px 24px", backgroundColor: "var(--bg-app)", borderBottom: "1px solid var(--border)", display: "flex", gap: 20, fontSize: "0.8125rem", color: "var(--text-secondary)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Phone size={13} color="var(--primary)" />
              <span>{patient.phone}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Mail size={13} color="var(--primary)" />
              <span>{patient.email}</span>
            </div>
            {patient.address && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={13} color="var(--primary)" />
                <span>{patient.address}</span>
              </div>
            )}
          </div>

          {/* Reference Targets Bar (Metas & Rangos Ideales) */}
          <div style={{ padding: "12px 24px", backgroundColor: "#f0fdf4", borderBottom: "1px solid #bbf7d0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: "0.8125rem" }}>
              <span style={{ fontWeight: 700, color: "#166534", display: "flex", alignItems: "center", gap: 4 }}>
                <Scale size={14} /> Metas Ideales:
              </span>
              <span style={{ color: "#15803d" }}>Peso: <strong>{patient.reference_targets?.ideal_weight || 60} kg</strong></span>
              <span style={{ color: "#15803d" }}>Grasa: <strong>{patient.reference_targets?.ideal_fat_pct || 20}%</strong></span>
              <span style={{ color: "#15803d" }}>IMC: <strong>{patient.reference_targets?.ideal_imc || 22}</strong></span>
            </div>
            <button
              style={{ background: "none", border: "none", color: "#166534", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
              onClick={() => {
                setTargetHeight(patient.reference_targets?.height_cm || 165);
                setTargetWeight(patient.reference_targets?.ideal_weight || 60);
                setTargetFat(patient.reference_targets?.ideal_fat_pct || 20);
                setTargetImc(patient.reference_targets?.ideal_imc || 22);
                setIsEditingTargets(true);
              }}
            >
              <Edit2 size={12} /> Editar Metas
            </button>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 24px", gap: 18, overflowX: "auto" }}>
            {[
              { id: "resumen", label: "Resumen 360°" },
              { id: "sesiones", label: `Bioimpedancia (${patientSessions.length})` },
              { id: "grafico", label: "Gráfico Estadístico" },
              { id: "paquetes", label: `Paquetes (${patientPackages.length})` },
              { id: "dietas", label: "Dietas" },
              { id: "citas", label: `Citas (${patientAppointments.length})` },
              { id: "historia", label: "Historia Clínica" },
              { id: "pagos", label: `Pagos (${patientPayments.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                style={{
                  padding: "12px 0",
                  fontSize: "0.8125rem",
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? "var(--primary)" : "var(--text-secondary)",
                  borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
                  background: "transparent",
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>
            {/* TAB 1: RESUMEN */}
            {activeTab === "resumen" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Top Metrics Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", textAlign: "center" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)" }}>PESO ACTUAL</span>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", marginTop: 2 }}>
                      {patientSessions.length > 0 ? `${patientSessions[patientSessions.length - 1].weight} kg` : "N/D"}
                    </div>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", textAlign: "center" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)" }}>% GRASA</span>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#8b5cf6", marginTop: 2 }}>
                      {patientSessions.length > 0 ? `${patientSessions[patientSessions.length - 1].fat_pct}%` : "N/D"}
                    </div>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", textAlign: "center" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)" }}>% MÚSCULO</span>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#10b981", marginTop: 2 }}>
                      {patientSessions.length > 0 ? `${patientSessions[patientSessions.length - 1].muscle_pct}%` : "N/D"}
                    </div>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", textAlign: "center" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)" }}>EDAD METABÓLICA</span>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f59e0b", marginTop: 2 }}>
                      {patientSessions.length > 0 ? `${patientSessions[patientSessions.length - 1].metabolic_age} años` : "N/D"}
                    </div>
                  </div>
                </div>

                {/* Active Package Tracker */}
                {activePackage && (
                  <div style={{ padding: "16px", backgroundColor: "#f0f9ff", borderRadius: "var(--radius-md)", border: "1px solid #bae6fd" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0369a1" }}>{activePackage.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#0284c7" }}>Inició: {activePackage.start_date}</div>
                      </div>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 800, color: "#0369a1" }}>
                        {activePackage.used_sessions} de {activePackage.total_sessions} Sesiones ({activePackage.total_sessions - activePackage.used_sessions} restantes)
                      </span>
                    </div>
                    <div style={{ width: "100%", height: 8, backgroundColor: "#bae6fd", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(100, (activePackage.used_sessions / activePackage.total_sessions) * 100)}%`, height: "100%", backgroundColor: "#0284c7" }} />
                    </div>
                  </div>
                )}

                <div>
                  <h4 style={{ fontSize: "0.875rem", marginBottom: 6 }}>Diagnóstico Principal</h4>
                  <div style={{ padding: "12px", backgroundColor: "#eef2ff", borderRadius: "var(--radius-md)", border: "1px solid #c7d2fe", color: "#3730a3", fontSize: "0.875rem", fontWeight: 600 }}>
                    {patient.clinical_history.diagnostico}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: "0.875rem", marginBottom: 6 }}>Tratamiento & Evolución</h4>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                    {patient.clinical_history.tratamiento} — {patient.clinical_history.evolucion}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: BIOIMPEDANCIA & SESIONES */}
            {activeTab === "sesiones" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    Registro Cronológico de Evaluaciones por Sesión
                  </span>
                  <button className="btn btn-primary btn-sm" onClick={handleOpenNewSession}>
                    <Plus size={14} />
                    + Nueva Evaluación
                  </button>
                </div>

                {patientSessions.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)", fontSize: "0.875rem", border: "1px dashed var(--border)", borderRadius: "var(--radius-md)" }}>
                    No hay evaluaciones biométricas registradas. Haz clic en <strong>+ Nueva Evaluación</strong> para agregar la primera.
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", textAlign: "center" }}>
                      <thead>
                        <tr style={{ backgroundColor: "var(--bg-app)", borderBottom: "2px solid var(--border)", color: "var(--text-muted)", fontWeight: 700 }}>
                          <th style={{ padding: "8px 6px" }}>#</th>
                          <th style={{ padding: "8px 6px" }}>Fecha</th>
                          <th style={{ padding: "8px 6px" }}>Peso</th>
                          <th style={{ padding: "8px 6px" }}>IMC</th>
                          <th style={{ padding: "8px 6px" }}>% Grasa</th>
                          <th style={{ padding: "8px 6px" }}>% Agua</th>
                          <th style={{ padding: "8px 6px" }}>% Músculo</th>
                          <th style={{ padding: "8px 6px" }}>Edad Met.</th>
                          <th style={{ padding: "8px 6px" }}>Kcal</th>
                          <th style={{ padding: "8px 6px" }}>Estímulo</th>
                          <th style={{ padding: "8px 6px" }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patientSessions.map((s, idx) => (
                          <tr key={s.id} style={{ borderBottom: "1px solid var(--border)" }}>
                            <td style={{ padding: "8px 6px", fontWeight: 700 }}>{s.session_number || idx + 1}</td>
                            <td style={{ padding: "8px 6px" }}>{s.date}</td>
                            <td style={{ padding: "8px 6px", fontWeight: 700 }}>{s.weight} kg</td>
                            <td style={{ padding: "8px 6px", fontWeight: 600 }}>{s.imc}</td>
                            <td style={{ padding: "8px 6px" }}>{s.fat_pct}%</td>
                            <td style={{ padding: "8px 6px" }}>{s.water_pct}%</td>
                            <td style={{ padding: "8px 6px", fontWeight: 600, color: "#059669" }}>{s.muscle_pct}%</td>
                            <td style={{ padding: "8px 6px" }}>{s.metabolic_age}</td>
                            <td style={{ padding: "8px 6px" }}>{s.kcal}</td>
                            <td style={{ padding: "8px 6px", textAlign: "left", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {s.stimulus_applied}
                            </td>
                            <td style={{ padding: "8px 6px" }}>
                              <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                                <button
                                  className="btn-icon btn-sm"
                                  onClick={() => handleOpenEditSession(s)}
                                  title="Editar sesión"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  className="btn-icon btn-sm"
                                  onClick={() => deleteSessionEvaluation(s.id)}
                                  title="Eliminar sesión"
                                  style={{ color: "var(--danger-text)" }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: GRÁFICO ESTADÍSTICO */}
            {activeTab === "grafico" && (
              <PatientBioCharts sessions={patientSessions} />
            )}

            {/* TAB 4: PAQUETES DE TRATAMIENTO */}
            {activeTab === "paquetes" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700 }}>Planes & Paquetes Contratados</span>
                  <button className="btn btn-primary btn-sm" onClick={() => setIsNewPkgModalOpen(true)}>
                    <Plus size={14} /> + Asignar Paquete
                  </button>
                </div>

                {patientPackages.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                    Este paciente no tiene paquetes contratados (atiende bajo sesiones individuales).
                  </div>
                ) : (
                  patientPackages.map((pkg) => (
                    <div key={pkg.id} style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{pkg.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Iniciado el {pkg.start_date} • Precio: S/ {pkg.price.toFixed(2)}</div>
                        </div>
                        <StatusBadge status={pkg.status === "active" ? "confirmed" : "attended"} size="sm" />
                      </div>
                      <div style={{ width: "100%", height: 8, backgroundColor: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(100, (pkg.used_sessions / pkg.total_sessions) * 100)}%`, height: "100%", backgroundColor: "var(--primary)" }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 600 }}>
                        <span>Sesiones Realizadas: {pkg.used_sessions} / {pkg.total_sessions}</span>
                        <span style={{ color: "var(--primary)" }}>{pkg.total_sessions - pkg.used_sessions} sesiones por realizar</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 5: DIETAS ASIGNADAS */}
            {activeTab === "dietas" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {patientDiet ? (
                  <div style={{ padding: "16px", border: "1px solid #bbf7d0", backgroundColor: "#f0fdf4", borderRadius: "var(--radius-md)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: "0.9375rem", color: "#166534" }}>{patientDiet.title}</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, backgroundColor: "#dcfce7", color: "#15803d", padding: "2px 8px", borderRadius: 4 }}>
                        {patientDiet.calories_target} kcal / día
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8125rem", color: "#166534", margin: "0 0 12px" }}>{patientDiet.description}</p>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "0.8125rem" }}>
                      <div style={{ padding: "8px 12px", backgroundColor: "#ffffff", borderRadius: 6, border: "1px solid #bbf7d0" }}>
                        <strong>Desayuno:</strong> {patientDiet.meals.desayuno}
                      </div>
                      {patientDiet.meals.media_manana && (
                        <div style={{ padding: "8px 12px", backgroundColor: "#ffffff", borderRadius: 6, border: "1px solid #bbf7d0" }}>
                          <strong>Media Mañana:</strong> {patientDiet.meals.media_manana}
                        </div>
                      )}
                      <div style={{ padding: "8px 12px", backgroundColor: "#ffffff", borderRadius: 6, border: "1px solid #bbf7d0" }}>
                        <strong>Almuerzo:</strong> {patientDiet.meals.almuerzo}
                      </div>
                      {patientDiet.meals.merienda && (
                        <div style={{ padding: "8px 12px", backgroundColor: "#ffffff", borderRadius: 6, border: "1px solid #bbf7d0" }}>
                          <strong>Merienda:</strong> {patientDiet.meals.merienda}
                        </div>
                      )}
                      <div style={{ padding: "8px 12px", backgroundColor: "#ffffff", borderRadius: 6, border: "1px solid #bbf7d0" }}>
                        <strong>Cena:</strong> {patientDiet.meals.cena}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                    No hay dieta asignada para este paciente.
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: CITAS */}
            {activeTab === "citas" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {patientAppointments.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                    No hay citas registradas.
                  </div>
                ) : (
                  patientAppointments.map((app) => (
                    <div key={app.id} style={{ padding: "14px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{app.specialty_name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 4 }}>
                          <Calendar size={12} />
                          <span>{app.date} a las {app.time}</span>
                          <span>•</span>
                          <span style={{ fontWeight: 700, color: app.location_type === "domicilio" ? "#8b5cf6" : "#0284c7" }}>
                            {app.location_type === "domicilio" ? "🏠 A Domicilio" : "🏥 Consultorio"}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={app.status} size="sm" />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 7: HISTORIA CLÍNICA */}
            {activeTab === "historia" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ padding: 14, border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>1. Antecedentes Médicos</span>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: 4 }}>{patient.clinical_history.antecedentes}</p>
                </div>
                <div style={{ padding: 14, border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>2. Motivo de Consulta</span>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: 4 }}>{patient.clinical_history.motivo_consulta}</p>
                </div>
                <div style={{ padding: 14, border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase" }}>3. Diagnóstico Clínico</span>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: 4, fontWeight: 600 }}>{patient.clinical_history.diagnostico}</p>
                </div>
              </div>
            )}

            {/* TAB 8: PAGOS */}
            {activeTab === "pagos" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {patientPayments.map((p) => (
                  <div key={p.id} style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>S/ {p.amount.toFixed(2)}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                        {p.date} • {p.method} • {p.location_type === "domicilio" ? "Domicilio" : "Consultorio"}
                      </div>
                    </div>
                    <StatusBadge status={p.status} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", backgroundColor: "var(--surface)" }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar Ficha
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setIsPdfModalOpen(true)}>
                <FileText size={16} />
                Exportar PDF
              </button>
              {onNewAppointment && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onClose();
                    onNewAppointment(patient.id);
                  }}
                >
                  <Plus size={16} />
                  + Nueva Cita
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Editar Metas Ideales */}
      {isEditingTargets && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50" onClick={() => setIsEditingTargets(false)}>
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Ruler className="w-5 h-5 text-emerald-400" />
                <span>Parámetros de Referencia (Metas Ideales)</span>
              </h3>
              <button onClick={() => setIsEditingTargets(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTargets} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Ruler className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Altura (cm) *</span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    value={targetHeight}
                    onChange={(e) => {
                      const h = Number(e.target.value);
                      setTargetHeight(h);
                      setTargetImc(calculateImc(targetWeight, h));
                    }}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Scale className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Peso Ideal (kg) *</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    value={targetWeight}
                    onChange={(e) => {
                      const w = Number(e.target.value);
                      setTargetWeight(w);
                      setTargetImc(calculateImc(w, targetHeight));
                    }}
                    required
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>% Grasa Ideal de Referencia</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    value={targetFat}
                    onChange={(e) => setTargetFat(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              {/* Live Colored IMC Indicator */}
              <ImcIndicator weightKg={targetWeight} heightCm={targetHeight} showScaleBar={true} />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition" onClick={() => setIsEditingTargets(false)}>
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 rounded-xl hover:bg-emerald-400 transition">
                  Guardar Metas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar / Editar Evaluación de Sesión */}
      {isNewSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50" onClick={() => setIsNewSessionModalOpen(false)}>
          <div className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>
                  {editingSession ? `Editar Evaluación (Sesión #${editingSession.session_number})` : `Nueva Evaluación Biométrica (Sesión #${patientSessions.length + 1})`}
                </span>
              </h3>
              <button onClick={() => setIsNewSessionModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4 mt-4">
              {/* Row 1: Date & Stimulus (2 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fecha de Evaluación *</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    required
                  />
                </div>

                {/* Stimulus with SearchableSelect (max 2 results) */}
                <SearchableSelect
                  label="Estímulo o Tratamiento *"
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                  options={stimuliList.map((st) => ({
                    value: st,
                    label: st,
                    icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
                  }))}
                  value={sessionStimulus}
                  onChange={(val) => setSessionStimulus(val)}
                  placeholder="Buscar tratamiento..."
                  maxResults={2}
                />
              </div>

              {/* Row 2: Biometrics in 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Scale className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Peso Actual (kg) *</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    value={sessionWeight}
                    onChange={(e) => setSessionWeight(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>% Grasa Corporal</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    value={sessionFat}
                    onChange={(e) => setSessionFat(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                    <span>% Agua Corporal</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    value={sessionWater}
                    onChange={(e) => setSessionWater(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>% Masa Muscular</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    value={sessionMuscle}
                    onChange={(e) => setSessionMuscle(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Edad Metabólica</span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    value={sessionMetabolicAge}
                    onChange={(e) => setSessionMetabolicAge(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Flame className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Gasto Calórico Estimado (Kcal)</span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    value={sessionKcal}
                    onChange={(e) => setSessionKcal(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              {/* Dynamic Colored IMC Indicator during session input */}
              <ImcIndicator
                weightKg={sessionWeight}
                heightCm={patient.reference_targets?.height_cm || 165}
                showScaleBar={true}
              />

              {/* Clinical Notes (2 Columns & Full Span) */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Patrones Observados & Evaluación Física</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Ej: Puntos gatillo en trapecio, rigidez paravertebral..."
                  value={sessionPatterns}
                  onChange={(e) => setSessionPatterns(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Notas Clínicas & Estilo de Vida (Estrés, insomnio, bruxismo...)</span>
                </label>
                <textarea
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  rows={2}
                  placeholder="Registro de hábitos, estrés, calidad de sueño..."
                  value={sessionLifestyle}
                  onChange={(e) => setSessionLifestyle(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition" onClick={() => setIsNewSessionModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-500 rounded-xl hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition">
                  Guardar Evaluación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Asignar Paquete */}
      {isNewPkgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50" onClick={() => setIsNewPkgModalOpen(false)}>
          <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>Asignar Paquete Terapéutico</span>
              </h3>
              <button onClick={() => setIsNewPkgModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nombre del Paquete *</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Plan Terapéutico Integral 10 Sesiones"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Total Sesiones *</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    value={pkgTotal}
                    onChange={(e) => setPkgTotal(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Precio Total (S/) *</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition" onClick={() => setIsNewPkgModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 rounded-xl hover:bg-emerald-400 transition">
                  Asignar Paquete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Clinical Report Modal */}
      {isPdfModalOpen && (
        <PatientClinicalPDFModal
          patient={patient}
          sessions={patientSessions}
          packageInfo={activePackage}
          dietPlan={patientDiet}
          onClose={() => setIsPdfModalOpen(false)}
        />
      )}
    </>
  );
}
