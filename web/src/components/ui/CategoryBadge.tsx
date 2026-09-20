import React from "react";
import {
  Flame,
  Apple,
  Sparkles,
  Shield,
  Heart,
  Package,
  Magnet,
  Syringe,
  Droplets,
  Cpu,
  Building2,
  Home,
  Tag,
  Truck,
  Layers,
  Megaphone,
} from "lucide-react";

export type CategoryType =
  // Diets
  | "Pérdida de Grasa"
  | "Antiinflamatoria"
  | "Mantenimiento"
  | "Desintoxicante"
  | "Personalizada"
  // Inventory
  | "Agujas"
  | "Imanes"
  | "Insumos"
  | "Aceites & Cremas"
  | "Equipos"
  // Modality / Location
  | "consultorio"
  | "domicilio"
  | "Consultorio"
  | "Domicilio"
  // Expense
  | "Materiales e Insumos"
  | "Alquiler de Consultorio"
  | "Transporte Domiciliario"
  | "Servicios & Software"
  | "Publicidad"
  | "Otros"
  | string;

interface CategoryConfig {
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  bg: string;
  text: string;
  border: string;
}

const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  // --- DIETAS & NUTRICIÓN ---
  "pérdida de grasa": {
    label: "Pérdida de Grasa",
    icon: Flame,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  "perdida de grasa": {
    label: "Pérdida de Grasa",
    icon: Flame,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  "antiinflamatoria": {
    label: "Antiinflamatoria",
    icon: Shield,
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  "mantenimiento": {
    label: "Mantenimiento",
    icon: Apple,
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  "desintoxicante": {
    label: "Desintoxicante",
    icon: Sparkles,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  "personalizada": {
    label: "Personalizada",
    icon: Heart,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },

  // --- INVENTARIO ---
  "agujas": {
    label: "Agujas",
    icon: Syringe,
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  "imanes": {
    label: "Imanes",
    icon: Magnet,
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  "insumos": {
    label: "Insumos",
    icon: Package,
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
  },
  "aceites & cremas": {
    label: "Aceites & Cremas",
    icon: Droplets,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  "equipos": {
    label: "Equipos",
    icon: Cpu,
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },

  // --- MODALIDAD / AGENDA ---
  "consultorio": {
    label: "En Consultorio",
    icon: Building2,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "domicilio": {
    label: "A Domicilio",
    icon: Home,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },

  // --- GASTOS / PAGOS ---
  "materiales e insumos": {
    label: "Materiales e Insumos",
    icon: Package,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "alquiler de consultorio": {
    label: "Alquiler de Consultorio",
    icon: Building2,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  "transporte domiciliario": {
    label: "Transporte Domiciliario",
    icon: Truck,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  "servicios & software": {
    label: "Servicios & Software",
    icon: Layers,
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  "publicidad": {
    label: "Publicidad",
    icon: Megaphone,
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
  },
  "otros": {
    label: "Otros",
    icon: Tag,
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  },
};

interface CategoryBadgeProps {
  category: CategoryType;
  size?: "xs" | "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

export function CategoryBadge({
  category,
  size = "sm",
  showIcon = true,
  className = "",
}: CategoryBadgeProps) {
  if (!category) return null;

  const key = category.toLowerCase().trim();
  const config = CATEGORY_CONFIGS[key] || {
    label: category,
    icon: Tag,
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  };

  const Icon = config.icon;

  const sizeClasses = {
    xs: "px-2 py-0.5 text-[10px] gap-1",
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-xs gap-2",
  }[size];

  const iconSizes = {
    xs: 11,
    sm: 13,
    md: 14,
  }[size];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-lg border shadow-xs transition-all duration-150 ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
      title={config.label}
    >
      {showIcon && <Icon size={iconSizes} className="shrink-0" />}
      <span className="truncate">{config.label}</span>
    </span>
  );
}
