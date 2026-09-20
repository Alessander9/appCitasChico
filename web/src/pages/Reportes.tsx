import { Download, CheckCircle2, XCircle } from "lucide-react";
import { useClinic } from "../context/ClinicContext";

export default function Reportes() {
  const { appointments, specialties } = useClinic();

  const handleExportCSV = () => {
    const rows = [
      ["ID Cita", "Paciente", "Especialidad", "Profesional", "Fecha", "Hora", "Estado", "Monto"],
      ...appointments.map((a) => [
        a.id,
        a.patient_name,
        a.specialty_name,
        a.professional_name,
        a.date,
        a.time,
        a.status,
        `S/ ${a.price.toFixed(2)}`,
      ]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reporte_citas_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: "0.8125rem", fontWeight: 600, marginBottom: 4 }}>
            <span>Administración</span>
            <span>/</span>
            <span>Analítica</span>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Reportes & Métricas Clínicas</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Estadísticas de demanda de servicios, asistencia de pacientes y rendimiento.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={handleExportCSV}>
          <Download size={16} />
          Exportar Reporte (CSV)
        </button>
      </div>

      {/* Analytics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {/* Specialty Demand */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: "1rem", margin: 0 }}>Demanda por Especialidad</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {specialties.map((esp) => {
              const count = appointments.filter((a) => a.specialty_id === esp.id).length;
              const percent = Math.round((count / (appointments.length || 1)) * 100);
              return (
                <div key={esp.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                    <span style={{ fontWeight: 600 }}>{esp.name}</span>
                    <span style={{ fontWeight: 700, color: "var(--primary)" }}>{count} citas ({percent}%)</span>
                  </div>
                  <div style={{ width: "100%", height: 8, backgroundColor: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${Math.max(percent, 8)}%`, height: "100%", backgroundColor: esp.color || "var(--primary)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance Rates */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: "1rem", margin: 0 }}>Tasa de Asistencia & Adherencia</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", backgroundColor: "#f0fdf4", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={20} color="#16a34a" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#14532d" }}>Asistencia Efectiva</div>
                  <div style={{ fontSize: "0.75rem", color: "#15803d" }}>Citas confirmadas y atendidas</div>
                </div>
              </div>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#166534" }}>92.4%</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", backgroundColor: "#fef2f2", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <XCircle size={20} color="#dc2626" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#7f1d1d" }}>Cancelaciones / No Show</div>
                  <div style={{ fontSize: "0.75rem", color: "#991b1b" }}>Reprogramaciones a tiempo</div>
                </div>
              </div>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#991b1b" }}>7.6%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
