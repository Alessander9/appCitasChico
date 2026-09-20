export type ImcCategory = {
  label: string;
  color: string;
  bg: string;
  border: string;
  description: string;
};

export function getImcCategory(imc: number): ImcCategory {
  if (imc < 18.5) {
    return {
      label: "Bajo Peso",
      color: "#0284c7",
      bg: "#e0f2fe",
      border: "#bae6fd",
      description: "Por debajo del rango recomendado",
    };
  } else if (imc < 25.0) {
    return {
      label: "Peso Saludable / Normal",
      color: "#15803d",
      bg: "#dcfce7",
      border: "#86efac",
      description: "Rango óptimo según la OMS",
    };
  } else if (imc < 30.0) {
    return {
      label: "Sobrepeso (Pre-obesidad)",
      color: "#d97706",
      bg: "#fef3c7",
      border: "#fde68a",
      description: "Recomendado plan terapéutico y control",
    };
  } else if (imc < 35.0) {
    return {
      label: "Obesidad Grado I",
      color: "#ea580c",
      bg: "#ffedd5",
      border: "#fed7aa",
      description: "Atención prioritaria y cambio de hábitos",
    };
  } else {
    return {
      label: "Obesidad Grado II o Severa",
      color: "#dc2626",
      bg: "#fee2e2",
      border: "#fca5a5",
      description: "Riesgo metabólico y cardiovascular",
    };
  }
}

export function calculateImc(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

interface ImcIndicatorProps {
  weightKg: number;
  heightCm: number;
  showScaleBar?: boolean;
}

export function ImcIndicator({ weightKg, heightCm, showScaleBar = true }: ImcIndicatorProps) {
  const imc = calculateImc(weightKg, heightCm);
  if (!imc || imc <= 0) {
    return (
      <div style={{ padding: "10px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-app)", border: "1px dashed var(--border)", textAlign: "center", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
        Ingresa peso y altura para calcular el IMC automáticamente.
      </div>
    );
  }

  const category = getImcCategory(imc);

  // Position percentage for the scale bar (from IMC 15 to 40)
  const clampedImc = Math.min(40, Math.max(15, imc));
  const pinPercent = ((clampedImc - 15) / (40 - 15)) * 100;

  return (
    <div
      style={{
        padding: "14px 16px",
        borderRadius: "var(--radius-md)",
        backgroundColor: category.bg,
        border: `1.5px solid ${category.border}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "all 0.25s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: category.color,
              lineHeight: 1,
            }}
          >
            {imc.toFixed(1)}
          </div>
          <div>
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 800,
                color: category.color,
                display: "block",
              }}
            >
              {category.label}
            </span>
            <span style={{ fontSize: "0.75rem", color: category.color, opacity: 0.9 }}>
              {category.description}
            </span>
          </div>
        </div>

        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: category.color, backgroundColor: "#ffffff", padding: "4px 10px", borderRadius: "999px", border: `1px solid ${category.border}` }}>
          IMC Calculado
        </div>
      </div>

      {showScaleBar && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Multi-colored continuous bar */}
          <div
            style={{
              position: "relative",
              height: "10px",
              width: "100%",
              borderRadius: "999px",
              background: "linear-gradient(to right, #0284c7 0%, #10b981 35%, #f59e0b 60%, #ea580c 80%, #ef4444 100%)",
              overflow: "visible",
            }}
          >
            {/* Colored indicator pin */}
            <div
              style={{
                position: "absolute",
                left: `${pinPercent}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                border: `3.5px solid ${category.color}`,
                boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
                transition: "left 0.3s ease",
              }}
            />
          </div>

          {/* Scale Labels */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", marginTop: 2 }}>
            <span style={{ color: "#0284c7" }}>&lt;18.5 Bajo</span>
            <span style={{ color: "#10b981" }}>18.5 - 24.9 Normal</span>
            <span style={{ color: "#f59e0b" }}>25 - 29.9 Sobrepeso</span>
            <span style={{ color: "#ef4444" }}>&ge;30 Obesidad</span>
          </div>
        </div>
      )}
    </div>
  );
}
