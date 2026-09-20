import { useState } from "react";
import { X, Printer, Share2, Check, Sparkles, Scale, Activity } from "lucide-react";
import { type Patient, type SessionEvaluation, type TreatmentPackage, type DietPlan } from "../../context/ClinicContext";

interface PatientClinicalPDFModalProps {
  patient: Patient;
  sessions: SessionEvaluation[];
  packageInfo?: TreatmentPackage;
  dietPlan?: DietPlan;
  onClose: () => void;
}

export function PatientClinicalPDFModal({
  patient,
  sessions,
  packageInfo,
  dietPlan,
  onClose,
}: PatientClinicalPDFModalProps) {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const latestSession = sessions[sessions.length - 1];
    const message = `*FICHA CLÍNICA & REPORTE BIOMÉTRICO - ${patient.name}*\n` +
      `📅 Fecha: ${latestSession ? latestSession.date : new Date().toISOString().split("T")[0]}\n` +
      `⚖️ Peso Actual: ${latestSession ? latestSession.weight + " kg" : "N/D"}\n` +
      `📊 IMC: ${latestSession ? latestSession.imc : "N/D"} | % Grasa: ${latestSession ? latestSession.fat_pct + "%" : "N/D"}\n` +
      `💧 % Agua: ${latestSession ? latestSession.water_pct + "%" : "N/D"} | 💪 % Músculo: ${latestSession ? latestSession.muscle_pct + "%" : "N/D"}\n` +
      `⚡ Edad Metabólica: ${latestSession ? latestSession.metabolic_age + " años" : "N/D"} | Kcal: ${latestSession ? latestSession.kcal + " kcal" : "N/D"}\n` +
      `🎯 Tratamiento: ${patient.clinical_history.diagnostico}\n` +
      `🩺 Centro Terapéutico Vida`;

    const encoded = encodeURIComponent(message);
    const cleanPhone = patient.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, "_blank");
  };

  const handleCopySummary = () => {
    const latestSession = sessions[sessions.length - 1];
    const text = `Ficha de ${patient.name} - DNI: ${patient.dni}. Peso: ${latestSession?.weight}kg, IMC: ${latestSession?.imc}, %Grasa: ${latestSession?.fat_pct}%, %Músculo: ${latestSession?.muscle_pct}%.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="drawer-overlay" style={{ zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={onClose}>
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "880px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          overflow: "hidden",
          backgroundColor: "#ffffff",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Toolbar (Screen only) */}
        <div
          className="no-print"
          style={{
            padding: "14px 20px",
            backgroundColor: "var(--bg-app)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
              📄 Vista Previa de Ficha Clínica & Bioimpedancia (PDF)
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={handleShareWhatsApp} title="Compartir reporte por WhatsApp">
              <Share2 size={14} />
              Enviar por WhatsApp
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleCopySummary}>
              {copied ? <Check size={14} color="#10b981" /> : <Sparkles size={14} />}
              {copied ? "Copiado" : "Copiar Resumen"}
            </button>
            <button className="btn btn-primary btn-sm" onClick={handlePrint} title="Imprimir o Guardar como PDF">
              <Printer size={14} />
              Descargar / Imprimir PDF
            </button>
            <button className="btn-icon btn-sm" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Document Content - Clean Professional Printable A4 Format */}
        <div
          id="clinical-pdf-document"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "36px 40px",
            backgroundColor: "#ffffff",
            color: "#1e293b",
            fontSize: "0.875rem",
            lineHeight: 1.5,
          }}
        >
          {/* Document Header with Clinic Branding */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #0284c7", paddingBottom: 20, marginBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#0284c7", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.25rem" }}>
                  +
                </div>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
                    CENTRO MÉDICO & TERAPÉUTICO VIDA
                  </h2>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                    HISTORIA CLÍNICA, COMPOSICIÓN CORPORAL Y SEGUIMIENTO INTEGRAL
                  </span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: "0.75rem", color: "#64748b" }}>
              <div><strong>Fecha de Emisión:</strong> {new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })}</div>
              <div><strong>Código HC:</strong> HC-{patient.dni}</div>
              <div><strong>Estado:</strong> {patient.status === "active" ? "Activo en Tratamiento" : "Alta Terapéutica"}</div>
            </div>
          </div>

          {/* Patient Personal Data Grid */}
          <div style={{ backgroundColor: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
              1. Ficha de Identificación del Paciente
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, fontSize: "0.8125rem" }}>
              <div><strong style={{ color: "#475569" }}>Paciente:</strong> <span style={{ fontWeight: 700, color: "#0f172a" }}>{patient.name}</span></div>
              <div><strong style={{ color: "#475569" }}>DNI:</strong> {patient.dni}</div>
              <div><strong style={{ color: "#475569" }}>Edad:</strong> {patient.age} años</div>
              <div><strong style={{ color: "#475569" }}>Teléfono:</strong> {patient.phone}</div>
              <div><strong style={{ color: "#475569" }}>Email:</strong> {patient.email}</div>
              <div><strong style={{ color: "#475569" }}>Dirección:</strong> {patient.address || "Consultorio Central"}</div>
            </div>
          </div>

          {/* Reference Targets Section (Metas y Parámetros Ideales) */}
          <div style={{ backgroundColor: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd", padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 800, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
              <Scale size={14} />
              2. Parámetros de Referencia y Metas Ideales
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              <div style={{ backgroundColor: "#ffffff", padding: "10px 14px", borderRadius: 6, border: "1px solid #e0f2fe", textAlign: "center" }}>
                <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 700 }}>ALTURA</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#0284c7" }}>{patient.reference_targets?.height_cm || 165} cm</div>
              </div>
              <div style={{ backgroundColor: "#ffffff", padding: "10px 14px", borderRadius: 6, border: "1px solid #e0f2fe", textAlign: "center" }}>
                <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 700 }}>PESO IDEAL</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#0284c7" }}>{patient.reference_targets?.ideal_weight || 60.0} kg</div>
              </div>
              <div style={{ backgroundColor: "#ffffff", padding: "10px 14px", borderRadius: 6, border: "1px solid #e0f2fe", textAlign: "center" }}>
                <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 700 }}>% GRASA IDEAL</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#0284c7" }}>{patient.reference_targets?.ideal_fat_pct || 20.0}%</div>
              </div>
              <div style={{ backgroundColor: "#ffffff", padding: "10px 14px", borderRadius: 6, border: "1px solid #e0f2fe", textAlign: "center" }}>
                <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 700 }}>IMC IDEAL</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 800, color: "#0284c7" }}>{patient.reference_targets?.ideal_imc || 22.0}</div>
              </div>
            </div>
          </div>

          {/* Clinical History Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            <div style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 8 }}>
              <strong style={{ fontSize: "0.75rem", color: "#0284c7", textTransform: "uppercase" }}>Antecedentes & Motivo:</strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.8125rem", color: "#334155" }}>
                {patient.clinical_history.antecedentes} - {patient.clinical_history.motivo_consulta}
              </p>
            </div>
            <div style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 8 }}>
              <strong style={{ fontSize: "0.75rem", color: "#0284c7", textTransform: "uppercase" }}>Diagnóstico & Tratamiento:</strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.8125rem", color: "#334155" }}>
                {patient.clinical_history.diagnostico}
                {packageInfo && ` • Contrató: ${packageInfo.name} (${packageInfo.used_sessions}/${packageInfo.total_sessions} sesiones realizadas)`}
              </p>
            </div>
          </div>

          {/* Biometric Sessions Table (Tabla de Métricas de Composición Corporal y Gasto) */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 800, color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
              <Activity size={14} />
              3. Historial de Evaluaciones de Composición Corporal & Sesiones
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", textAlign: "center", border: "1px solid #cbd5e1" }}>
              <thead>
                <tr style={{ backgroundColor: "#0284c7", color: "#ffffff", fontWeight: 700 }}>
                  <th style={{ padding: "8px 6px", border: "1px solid #0369a1" }}>#</th>
                  <th style={{ padding: "8px 6px", border: "1px solid #0369a1" }}>Fecha</th>
                  <th style={{ padding: "8px 6px", border: "1px solid #0369a1" }}>Peso (kg)</th>
                  <th style={{ padding: "8px 6px", border: "1px solid #0369a1" }}>IMC</th>
                  <th style={{ padding: "8px 6px", border: "1px solid #0369a1" }}>% Grasa</th>
                  <th style={{ padding: "8px 6px", border: "1px solid #0369a1" }}>% Agua</th>
                  <th style={{ padding: "8px 6px", border: "1px solid #0369a1" }}>% Músculo</th>
                  <th style={{ padding: "8px 6px", border: "1px solid #0369a1" }}>Edad Met.</th>
                  <th style={{ padding: "8px 6px", border: "1px solid #0369a1" }}>Kcal</th>
                  <th style={{ padding: "8px 6px", border: "1px solid #0369a1" }}>Estímulo / Tto.</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: "16px", color: "#94a3b8" }}>
                      No hay registros de bioimpedancia aún.
                    </td>
                  </tr>
                ) : (
                  sessions.map((s, idx) => (
                    <tr key={s.id || idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                      <td style={{ padding: "8px 6px", border: "1px solid #e2e8f0", fontWeight: 700 }}>{s.session_number || idx + 1}</td>
                      <td style={{ padding: "8px 6px", border: "1px solid #e2e8f0" }}>{s.date}</td>
                      <td style={{ padding: "8px 6px", border: "1px solid #e2e8f0", fontWeight: 700, color: "#0f172a" }}>{s.weight}</td>
                      <td style={{ padding: "8px 6px", border: "1px solid #e2e8f0", fontWeight: 600 }}>{s.imc}</td>
                      <td style={{ padding: "8px 6px", border: "1px solid #e2e8f0" }}>{s.fat_pct}%</td>
                      <td style={{ padding: "8px 6px", border: "1px solid #e2e8f0" }}>{s.water_pct}%</td>
                      <td style={{ padding: "8px 6px", border: "1px solid #e2e8f0", fontWeight: 600, color: "#059669" }}>{s.muscle_pct}%</td>
                      <td style={{ padding: "8px 6px", border: "1px solid #e2e8f0" }}>{s.metabolic_age}</td>
                      <td style={{ padding: "8px 6px", border: "1px solid #e2e8f0" }}>{s.kcal}</td>
                      <td style={{ padding: "8px 6px", border: "1px solid #e2e8f0", textAlign: "left", fontSize: "0.6875rem" }}>
                        {s.stimulus_applied || "Acupuntura"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Observations, Lifestyle notes & Dietary Plan */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div style={{ padding: "14px", backgroundColor: "#fffbeb", border: "1px solid #fef3c7", borderRadius: 8 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#d97706", textTransform: "uppercase", marginBottom: 6 }}>
                4. Patrones & Factores de Estilo de Vida
              </div>
              <div style={{ fontSize: "0.8125rem", color: "#78350f" }}>
                {sessions.length > 0 && sessions[sessions.length - 1].lifestyle_notes
                  ? sessions[sessions.length - 1].lifestyle_notes
                  : "Estrés laboral controlado, pautas de descanso nocturno y hábitos de hidratación."}
              </div>
              {sessions.length > 0 && sessions[sessions.length - 1].patterns_observed && (
                <div style={{ marginTop: 6, fontSize: "0.75rem", color: "#92400e" }}>
                  <strong>Patrones observados:</strong> {sessions[sessions.length - 1].patterns_observed}
                </div>
              )}
            </div>

            <div style={{ padding: "14px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#16a34a", textTransform: "uppercase", marginBottom: 6 }}>
                5. Dieta & Pauta Nutricional Asignada
              </div>
              <div style={{ fontSize: "0.8125rem", color: "#166534", fontWeight: 600 }}>
                {dietPlan ? dietPlan.title : "Pauta Nutricional Personalizada"}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#15803d", marginTop: 4 }}>
                {dietPlan ? dietPlan.description : "Consumo adecuado de antioxidantes, hidratación constante y balance proteico."}
              </div>
            </div>
          </div>

          {/* Professional Signatures */}
          <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 20, borderTop: "1px solid #e2e8f0" }}>
            <div style={{ textAlign: "center", width: "240px" }}>
              <div style={{ borderBottom: "1px solid #94a3b8", height: "40px", marginBottom: "6px" }} />
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>Firma del Terapeuta / Fisiatra</div>
              <div style={{ fontSize: "0.6875rem", color: "#64748b" }}>C.M.P / Lic. Terapia Especializada</div>
            </div>
            <div style={{ textAlign: "center", width: "240px" }}>
              <div style={{ borderBottom: "1px solid #94a3b8", height: "40px", marginBottom: "6px" }} />
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>Firma del Paciente</div>
              <div style={{ fontSize: "0.6875rem", color: "#64748b" }}>DNI: {patient.dni}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
