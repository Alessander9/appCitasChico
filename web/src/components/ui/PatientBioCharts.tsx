import { type SessionEvaluation } from "../../context/ClinicContext";

interface PatientBioChartsProps {
  sessions: SessionEvaluation[];
}

export function PatientBioCharts({ sessions }: PatientBioChartsProps) {
  if (sessions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        No hay suficientes sesiones registradas para generar la gráfica de correlación.
      </div>
    );
  }

  // Sort sessions by session_number or date
  const sortedSessions = [...sessions].sort((a, b) => a.session_number - b.session_number);

  // SVG dimensions
  const width = 540;
  const height = 220;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Extract min and max values for scaling
  const weights = sortedSessions.map((s) => s.weight);
  const imcs = sortedSessions.map((s) => s.imc);
  const muscles = sortedSessions.map((s) => s.muscle_pct);

  const minWeight = Math.min(...weights) - 2;
  const maxWeight = Math.max(...weights) + 2;

  const minImc = Math.min(...imcs) - 1;
  const maxImc = Math.max(...imcs) + 1;

  const minMuscle = Math.min(...muscles) - 2;
  const maxMuscle = Math.max(...muscles) + 2;

  // Coordinate helper functions
  const getX = (index: number) => {
    if (sortedSessions.length === 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (sortedSessions.length - 1)) * chartWidth;
  };

  const getYWeight = (val: number) => {
    const range = maxWeight - minWeight || 1;
    return paddingTop + chartHeight - ((val - minWeight) / range) * chartHeight;
  };

  const getYImc = (val: number) => {
    const range = maxImc - minImc || 1;
    return paddingTop + chartHeight - ((val - minImc) / range) * chartHeight;
  };

  const getYMuscle = (val: number) => {
    const range = maxMuscle - minMuscle || 1;
    return paddingTop + chartHeight - ((val - minMuscle) / range) * chartHeight;
  };

  // Build SVG path strings
  const weightPoints = sortedSessions.map((s, i) => `${getX(i)},${getYWeight(s.weight)}`).join(" ");
  const imcPoints = sortedSessions.map((s, i) => `${getX(i)},${getYImc(s.imc)}`).join(" ");
  const musclePoints = sortedSessions.map((s, i) => `${getX(i)},${getYMuscle(s.muscle_pct)}`).join(" ");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Legend & Summary */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, padding: "12px 16px", backgroundColor: "#f8fafc", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
        <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-primary)" }}>
          📈 Gráfico de Control Estadístico & Correlación
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: "0.75rem", fontWeight: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 3, backgroundColor: "#0284c7", borderRadius: 2 }} />
            <span style={{ color: "#0284c7" }}>Peso (kg)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 3, backgroundColor: "#8b5cf6", borderRadius: 2 }} />
            <span style={{ color: "#8b5cf6" }}>IMC</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 3, backgroundColor: "#10b981", borderRadius: 2 }} />
            <span style={{ color: "#10b981" }}>% Masa Muscular</span>
          </div>
        </div>
      </div>

      {/* SVG Multi-Axis Chart */}
      <div style={{ width: "100%", overflowX: "auto", backgroundColor: "#ffffff", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxHeight: "240px", display: "block" }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + ratio * chartHeight;
            return (
              <line
                key={i}
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Session points on X axis */}
          {sortedSessions.map((s, i) => {
            const x = getX(i);
            return (
              <g key={s.id || i}>
                <line x1={x} y1={paddingTop} x2={x} y2={height - paddingBottom} stroke="#f1f5f9" />
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748b"
                  fontWeight="600"
                >
                  S#{s.session_number} ({s.date.slice(5)})
                </text>
              </g>
            );
          })}

          {/* Lines */}
          {sortedSessions.length > 1 && (
            <>
              {/* Peso Line */}
              <polyline
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={weightPoints}
              />
              {/* IMC Line */}
              <polyline
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={imcPoints}
              />
              {/* Masa Muscular Line */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={musclePoints}
              />
            </>
          )}

          {/* Point Dots & Values */}
          {sortedSessions.map((s, i) => {
            const x = getX(i);
            const yWeight = getYWeight(s.weight);
            const yImc = getYImc(s.imc);
            const yMuscle = getYMuscle(s.muscle_pct);

            return (
              <g key={`dots-${i}`}>
                {/* Weight Point */}
                <circle cx={x} cy={yWeight} r="4.5" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
                <text x={x} y={yWeight - 8} textAnchor="middle" fontSize="9" fill="#0284c7" fontWeight="bold">
                  {s.weight}kg
                </text>

                {/* IMC Point */}
                <circle cx={x} cy={yImc} r="4" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2.5" />
                <text x={x} y={yImc + 14} textAnchor="middle" fontSize="9" fill="#8b5cf6" fontWeight="bold">
                  {s.imc}
                </text>

                {/* Muscle Point */}
                <circle cx={x} cy={yMuscle} r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
                <text x={x} y={yMuscle - 8} textAnchor="middle" fontSize="9" fill="#10b981" fontWeight="bold">
                  {s.muscle_pct}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Progress Cards */}
      {sortedSessions.length >= 2 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {(() => {
            const first = sortedSessions[0];
            const latest = sortedSessions[sortedSessions.length - 1];
            const diffWeight = (latest.weight - first.weight).toFixed(1);
            const diffImc = (latest.imc - first.imc).toFixed(1);
            const diffMuscle = (latest.muscle_pct - first.muscle_pct).toFixed(1);

            return (
              <>
                <div style={{ padding: "12px", backgroundColor: "#f0f9ff", borderRadius: "var(--radius-md)", border: "1px solid #bae6fd" }}>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#0369a1" }}>CAMBIO EN PESO</span>
                  <div style={{ fontSize: "1.125rem", fontWeight: 800, color: Number(diffWeight) <= 0 ? "#059669" : "#d97706", marginTop: 2 }}>
                    {Number(diffWeight) > 0 ? `+${diffWeight}` : diffWeight} kg
                  </div>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#f5f3ff", borderRadius: "var(--radius-md)", border: "1px solid #ddd6fe" }}>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#6d28d9" }}>CAMBIO EN IMC</span>
                  <div style={{ fontSize: "1.125rem", fontWeight: 800, color: Number(diffImc) <= 0 ? "#059669" : "#d97706", marginTop: 2 }}>
                    {Number(diffImc) > 0 ? `+${diffImc}` : diffImc}
                  </div>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#f0fdf4", borderRadius: "var(--radius-md)", border: "1px solid #bbf7d0" }}>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#15803d" }}>GANANCIA MUSCULAR</span>
                  <div style={{ fontSize: "1.125rem", fontWeight: 800, color: Number(diffMuscle) >= 0 ? "#059669" : "#dc2626", marginTop: 2 }}>
                    {Number(diffMuscle) > 0 ? `+${diffMuscle}` : diffMuscle}%
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
