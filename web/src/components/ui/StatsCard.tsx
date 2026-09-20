import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  comparisonText?: string;
  icon: React.ReactNode;
  color?: string;
}

export function StatsCard({
  title,
  value,
  trend,
  comparisonText = "respecto a ayer",
  icon,
  color = "#4f46e5",
}: StatsCardProps) {
  return (
    <div
      className="card"
      style={{
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>
          {title}
        </span>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "10px",
            backgroundColor: `${color}14`,
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            marginBottom: 6,
          }}
        >
          {value}
        </div>

        {trend && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontWeight: 700,
                color: trend.isPositive ? "var(--success-text)" : "var(--danger-text)",
                backgroundColor: trend.isPositive ? "var(--success-bg)" : "var(--danger-bg)",
                padding: "2px 6px",
                borderRadius: "6px",
              }}
            >
              {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend.value}
            </span>
            <span style={{ color: "var(--text-muted)" }}>{comparisonText}</span>
          </div>
        )}
      </div>
    </div>
  );
}
