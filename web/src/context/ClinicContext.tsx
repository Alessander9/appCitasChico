import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useToast } from "./ToastContext";

export type AppointmentStatus = "confirmed" | "pending" | "attended" | "cancelled" | "no_show";
export type AppointmentLocation = "consultorio" | "domicilio";
export type PaymentMethod = "Yape" | "Plin" | "Efectivo" | "Tarjeta" | "Transferencia";
export type PaymentStatus = "paid" | "pending" | "partial";

// 1. Parámetros de Referencia e Historia del Paciente
export type PatientReferenceTargets = {
  height_cm: number; // Altura en cm
  ideal_weight: number; // Peso ideal (kg)
  ideal_fat_pct: number; // Grasa ideal (%)
  ideal_imc: number; // IMC ideal
};

// 2. Métricas de Composición Corporal y Gasto por Sesión
export type SessionEvaluation = {
  id: string;
  patient_id: string;
  session_number: number;
  date: string; // YYYY-MM-DD
  weight: number; // Peso (kg)
  imc: number; // Índice de Masa Corporal
  fat_pct: number; // % Grasa corporal
  water_pct: number; // % Agua corporal
  muscle_pct: number; // % Masa muscular
  metabolic_age: number; // Edad metabólica
  kcal: number; // Gasto calórico estimado (Kcal)
  stimulus_applied: string; // Estímulo o tratamiento aplicado
  patterns_observed: string; // Patrones observados y evaluación
  lifestyle_notes: string; // Síntomas/factores: estrés, insomnio, agotamiento, respiración, bruxismo, ansiedad...
  diet_assigned?: string; // Dieta o pauta nutricional
  observations?: string; // Observaciones generales
};

// 4. Paquetes y Tratamientos
export type TreatmentPackage = {
  id: string;
  patient_id: string;
  name: string; // Ej: "Paquete Terapéutico Integral (10 Sesiones)"
  total_sessions: number;
  used_sessions: number;
  price: number;
  status: "active" | "completed";
  start_date: string;
};

// 6. Dietas y Planes Nutricionales
export type DietPlan = {
  id: string;
  patient_id?: string;
  patient_name?: string;
  title: string;
  category: "Pérdida de Grasa" | "Antiinflamatoria" | "Mantenimiento" | "Desintoxicante" | "Personalizada";
  description: string;
  calories_target: number;
  meals: {
    desayuno: string;
    media_manana?: string;
    almuerzo: string;
    merienda?: string;
    cena: string;
  };
  recommendations: string[];
  created_at: string;
};

// 9. Inventario & Insumos Terapéuticos
export type InventoryItem = {
  id: string;
  name: string;
  category: "Agujas" | "Imanes" | "Insumos" | "Aceites & Cremas" | "Equipos";
  stock: number;
  min_stock: number;
  unit: string; // "unidades", "cajas", "frascos"
  price_cost: number;
  last_updated: string;
};

// 8. Gastos del Negocio
export type Expense = {
  id: string;
  description: string;
  category: "Materiales e Insumos" | "Alquiler de Consultorio" | "Transporte Domiciliario" | "Servicios & Software" | "Publicidad" | "Otros";
  amount: number;
  date: string;
  receipt_number?: string;
};

export type Patient = {
  id: string;
  name: string;
  dni: string;
  email: string;
  phone: string;
  age: number;
  avatar_url?: string;
  status: "active" | "inactive";
  registered_at: string;
  address?: string;
  notes?: string;
  reference_targets: PatientReferenceTargets;
  clinical_history: {
    antecedentes: string;
    motivo_consulta: string;
    evaluacion: string;
    diagnostico: string;
    tratamiento: string;
    evolucion: string;
  };
};

export type Professional = {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  avatar_url: string;
  email: string;
  phone: string;
  active: boolean;
  color: string;
};

export type Specialty = {
  id: string;
  name: string;
  description: string;
  duration_min: number;
  price: number; // in S/ Soles
  color: string;
};

export type Appointment = {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_phone: string;
  patient_avatar?: string;
  professional_id: string;
  professional_name: string;
  professional_avatar?: string;
  specialty_id: string;
  specialty_name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (e.g. "09:00")
  duration_min: number;
  status: AppointmentStatus;
  location_type: AppointmentLocation;
  address?: string;
  stimulus_applied?: string;
  package_id?: string;
  notes?: string;
  room?: string;
  price: number;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
};

export type Payment = {
  id: string;
  appointment_id: string;
  patient_name: string;
  location_type: AppointmentLocation;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
};

type ClinicContextType = {
  patients: Patient[];
  professionals: Professional[];
  specialties: Specialty[];
  appointments: Appointment[];
  payments: Payment[];
  sessionEvaluations: SessionEvaluation[];
  treatmentPackages: TreatmentPackage[];
  dietPlans: DietPlan[];
  inventory: InventoryItem[];
  expenses: Expense[];
  stimuliList: string[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Actions - Citas
  addAppointment: (app: Omit<Appointment, "id">) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, date: string, time: string) => void;
  cancelAppointment: (id: string, reason?: string) => void;

  // Actions - Pacientes
  addPatient: (patient: Omit<Patient, "id" | "registered_at">) => Patient;
  updatePatient: (id: string, patch: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // Actions - Sesiones Biomédicas
  addSessionEvaluation: (session: Omit<SessionEvaluation, "id">) => SessionEvaluation;
  updateSessionEvaluation: (id: string, patch: Partial<SessionEvaluation>) => void;
  deleteSessionEvaluation: (id: string) => void;

  // Actions - Paquetes
  addTreatmentPackage: (pkg: Omit<TreatmentPackage, "id">) => TreatmentPackage;
  updateTreatmentPackage: (id: string, patch: Partial<TreatmentPackage>) => void;

  // Actions - Dietas
  addDietPlan: (diet: Omit<DietPlan, "id" | "created_at">) => DietPlan;
  updateDietPlan: (id: string, patch: Partial<DietPlan>) => void;
  deleteDietPlan: (id: string) => void;

  // Actions - Inventario
  addInventoryItem: (item: Omit<InventoryItem, "id" | "last_updated">) => InventoryItem;
  updateInventoryItem: (id: string, patch: Partial<InventoryItem>) => void;
  adjustStock: (id: string, delta: number) => void;
  deleteInventoryItem: (id: string) => void;

  // Actions - Gastos & Finanzas
  addExpense: (expense: Omit<Expense, "id">) => Expense;
  deleteExpense: (id: string) => void;
  recordPayment: (payment: Omit<Payment, "id" | "date">) => void;

  // Actions - Estímulos
  addStimulus: (name: string) => void;

  // Actions - Especialidades
  addSpecialty: (specialty: Omit<Specialty, "id">) => Specialty;
  updateSpecialty: (id: string, patch: Partial<Specialty>) => void;
  deleteSpecialty: (id: string) => void;

  // KPIs
  kpiStats: {
    todayAppointments: number;
    confirmed: number;
    pending: number;
    attended: number;
    todayRevenue: number;
    monthlyRevenue: number;
    consultorioRevenue: number;
    domicilioRevenue: number;
    totalExpenses: number;
    netProfit: number;
    lowStockCount: number;
  };
};

export const DEFAULT_STIMULI = [
  "Acupuntura",
  "Magnetoterapia (Imanes decorativos)",
  "Magnetoterapia (Imanes de plata)",
  "Electroestimulación (TENS/EMS)",
  "Terapia Manual & Miofascial",
  "Punción Seca",
  "Moxibustión",
  "Ventosas / Cupping",
  "Auriculoterapia",
  "Termoterapia & Ultrasonido",
];

const INITIAL_SPECIALTIES: Specialty[] = [
  { id: "esp-1", name: "Terapia Física & Rehabilitación", description: "Recuperación motora y fortalecimiento", duration_min: 45, price: 80, color: "#4f46e5" },
  { id: "esp-2", name: "Terapia Manual Ortopédica", description: "Alivio de dolor articular y muscular", duration_min: 45, price: 90, color: "#06b6d4" },
  { id: "esp-3", name: "Psicología Clínica", description: "Evaluación y acompañamiento terapéutico", duration_min: 50, price: 100, color: "#8b5cf6" },
  { id: "esp-4", name: "Acupuntura & Medicina China", description: "Tratamiento holístico del dolor", duration_min: 45, price: 85, color: "#10b981" },
  { id: "esp-5", name: "Nutrición y Dietética", description: "Planes nutricionales personalizados", duration_min: 30, price: 70, color: "#f59e0b" },
];

const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: "pro-1",
    name: "Dr. Carlos Pérez",
    title: "Médico Fisiatra & Acupunturista",
    specialties: ["Terapia Física & Rehabilitación", "Acupuntura & Medicina China"],
    avatar_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    email: "carlos.perez@clinica.com",
    phone: "+51 987 654 321",
    active: true,
    color: "#4f46e5",
  },
  {
    id: "pro-2",
    name: "Lic. Ana García",
    title: "Terapeuta Holística & Fisioterapeuta",
    specialties: ["Terapia Física & Rehabilitación", "Terapia Manual Ortopédica"],
    avatar_url: "https://images.unsplash.com/photo-1594824813627-99446f33d7b4?w=150&auto=format&fit=crop&q=80",
    email: "ana.garcia@clinica.com",
    phone: "+51 912 345 678",
    active: true,
    color: "#06b6d4",
  },
  {
    id: "pro-3",
    name: "Mg. Roberto Mendoza",
    title: "Especialista en Nutrición & Bienestar",
    specialties: ["Nutrición y Dietética", "Psicología Clínica"],
    avatar_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
    email: "roberto.mendoza@clinica.com",
    phone: "+51 933 221 100",
    active: true,
    color: "#8b5cf6",
  },
];

const INITIAL_PATIENTS: Patient[] = [
  {
    id: "pat-1",
    name: "María López Fernández",
    dni: "74892301",
    email: "maria.lopez@gmail.com",
    phone: "+51 991 223 344",
    age: 34,
    address: "Calle Los Pinos 142, Dpto 301, San Isidro",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    status: "active",
    registered_at: "2025-01-15",
    notes: "Paciente con antecedente de lumbalgia mecánica y estrés laboral",
    reference_targets: {
      height_cm: 165,
      ideal_weight: 60.0,
      ideal_fat_pct: 22.0,
      ideal_imc: 22.0,
    },
    clinical_history: {
      antecedentes: "Sin cirugías previas. Sedentarismo moderado, trabajo de oficina 8h sentado.",
      motivo_consulta: "Dolor lumbar agudo tras esfuerzo físico y contractura cervical por estrés.",
      evaluacion: "Dolor a la palpación L4-L5 con contractura paravertebral bilateral y puntos gatillo en trapecios.",
      diagnostico: "Lumbalgia mecánica con síndrome miofascial cervical.",
      tratamiento: "Paquete de 10 sesiones con Magnetoterapia, Acupuntura y Reeducación postural.",
      evolucion: "Disminución notable del dolor en EVA (de 8/10 a 2/10). Gran mejora en calidad del sueño.",
    },
  },
  {
    id: "pat-2",
    name: "Juan Torres Ramos",
    dni: "41982345",
    email: "juan.torres@outlook.com",
    phone: "+51 984 556 778",
    age: 42,
    address: "Av. Benavides 2840, Miraflores",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "active",
    registered_at: "2025-02-01",
    notes: "Postoperatorio LCA rodilla izquierda y sobrepeso grado 1",
    reference_targets: {
      height_cm: 178,
      ideal_weight: 75.0,
      ideal_fat_pct: 18.0,
      ideal_imc: 23.7,
    },
    clinical_history: {
      antecedentes: "Reconstrucción LCA hace 6 semanas.",
      motivo_consulta: "Rehabilitación funcional de rodilla y control de masa corporal.",
      evaluacion: "Flexión activa de rodilla 110°, leve edema perirrotuliano.",
      diagnostico: "Postoperatorio de plastia LCA rodilla izquierda en fase de fortalecimiento.",
      tratamiento: "Electroestimulación (EMS), Magnetoterapia y pauta nutricional antiinflamatoria.",
      evolucion: "Ganancia de rango articular progresiva, marcha simétrica.",
    },
  },
  {
    id: "pat-3",
    name: "Elena Valdivia Cruz",
    dni: "10874523",
    email: "elena.valdivia@gmail.com",
    phone: "+51 977 889 900",
    age: 28,
    address: "Jr. Huáscar 890, Jesús María",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "active",
    registered_at: "2025-02-10",
    notes: "Bruxismo severo, insomnio y ansiedad nerviosa",
    reference_targets: {
      height_cm: 160,
      ideal_weight: 55.0,
      ideal_fat_pct: 21.0,
      ideal_imc: 21.5,
    },
    clinical_history: {
      antecedentes: "Bruxismo con férula de descarga nocturna.",
      motivo_consulta: "Cefaleas tensionales, ansiedad y agotamiento crónico.",
      evaluacion: "Puntos gatillo activos en maseteros, trapecios y esternocleidomastoideo.",
      diagnostico: "Cervicobraquialgia tensional y somatización por estrés.",
      tratamiento: "Acupuntura, Auriculoterapia e Imanes de plata.",
      evolucion: "Gran alivio de cefaleas desde la primera intervención, sueño reparador.",
    },
  },
];

const INITIAL_SESSIONS: SessionEvaluation[] = [
  {
    id: "ses-1",
    patient_id: "pat-1",
    session_number: 1,
    date: "2025-02-05",
    weight: 68.5,
    imc: 25.2,
    fat_pct: 28.4,
    water_pct: 50.1,
    muscle_pct: 29.5,
    metabolic_age: 39,
    kcal: 1420,
    stimulus_applied: "Acupuntura",
    patterns_observed: "Tensión muscular generalizada en trapecios y cuadrado lumbar.",
    lifestyle_notes: "Insomnio de conciliación, estrés laboral alto, comidas irregulares.",
    diet_assigned: "Plan Antiinflamatorio Base",
    observations: "Primera evaluación. Buena respuesta a la colocación de agujas.",
  },
  {
    id: "ses-2",
    patient_id: "pat-1",
    session_number: 2,
    date: "2025-02-12",
    weight: 67.2,
    imc: 24.7,
    fat_pct: 27.2,
    water_pct: 51.0,
    muscle_pct: 30.2,
    metabolic_age: 37,
    kcal: 1460,
    stimulus_applied: "Magnetoterapia (Imanes de plata)",
    patterns_observed: "Disminución notable de la contractura paravertebral.",
    lifestyle_notes: "Refiere mejor descanso nocturno (6 horas seguidas).",
    diet_assigned: "Plan Antiinflamatorio Base",
    observations: "Aplicación de imanes en meridianos de vejiga e intestino grueso.",
  },
  {
    id: "ses-3",
    patient_id: "pat-1",
    session_number: 3,
    date: "2025-02-19",
    weight: 66.0,
    imc: 24.2,
    fat_pct: 26.0,
    water_pct: 52.3,
    muscle_pct: 31.0,
    metabolic_age: 35,
    kcal: 1490,
    stimulus_applied: "Electroestimulación (TENS/EMS)",
    patterns_observed: "Excelente tono postural, movilidad lumbar sin dolor.",
    lifestyle_notes: "Ansiedad controlada, inició caminatas diarias de 20 min.",
    diet_assigned: "Pauta Mediterránea Rica en Antioxidantes",
    observations: "Paciente muy motivada con los avances biométricos.",
  },
  {
    id: "ses-4",
    patient_id: "pat-1",
    session_number: 4,
    date: "2025-02-26",
    weight: 64.8,
    imc: 23.8,
    fat_pct: 24.8,
    water_pct: 53.2,
    muscle_pct: 31.8,
    metabolic_age: 33,
    kcal: 1510,
    stimulus_applied: "Magnetoterapia (Imanes decorativos)",
    patterns_observed: "Flexión activa completa de columna sin restricciones.",
    lifestyle_notes: "Hábitos ordenados, nivel de energía óptimo durante la jornada.",
    diet_assigned: "Pauta Mediterránea Rica en Antioxidantes",
    observations: "Refuerzo en puntos auriculares y biomagnetismo.",
  },
  {
    id: "ses-5",
    patient_id: "pat-2",
    session_number: 1,
    date: "2025-02-10",
    weight: 84.0,
    imc: 26.5,
    fat_pct: 24.5,
    water_pct: 54.0,
    muscle_pct: 35.0,
    metabolic_age: 46,
    kcal: 1780,
    stimulus_applied: "Electroestimulación (TENS/EMS)",
    patterns_observed: "Inhibición refleja de cuádriceps izquierdo postquirúrgico.",
    lifestyle_notes: "Agotamiento por muletas, apetito normal.",
    diet_assigned: "Proteica & Reparación Tisular",
    observations: "EMS cuádriceps 20 min y crioterapia.",
  },
  {
    id: "ses-6",
    patient_id: "pat-2",
    session_number: 2,
    date: "2025-02-20",
    weight: 82.5,
    imc: 26.0,
    fat_pct: 23.2,
    water_pct: 55.1,
    muscle_pct: 36.2,
    metabolic_age: 43,
    kcal: 1820,
    stimulus_applied: "Magnetoterapia (Imanes de plata)",
    patterns_observed: "Activación isométrica potente de vasto medial.",
    lifestyle_notes: "Menor dolor articular, retomó trabajo remoto con pausas.",
    diet_assigned: "Proteica & Reparación Tisular",
    observations: "Imanes peripatelares para reducción de edema residual.",
  },
];

const INITIAL_PACKAGES: TreatmentPackage[] = [
  {
    id: "pkg-1",
    patient_id: "pat-1",
    name: "Paquete Terapéutico Integral (10 Sesiones)",
    total_sessions: 10,
    used_sessions: 4,
    price: 720,
    status: "active",
    start_date: "2025-02-05",
  },
  {
    id: "pkg-2",
    patient_id: "pat-2",
    name: "Paquete Rehabilitación & Fortalecimiento (8 Sesiones)",
    total_sessions: 8,
    used_sessions: 2,
    price: 600,
    status: "active",
    start_date: "2025-02-10",
  },
];

const INITIAL_DIETS: DietPlan[] = [
  {
    id: "diet-1",
    patient_id: "pat-1",
    patient_name: "María López Fernández",
    title: "Plan Antiinflamatorio y Reducción de Grasa",
    category: "Antiinflamatoria",
    calories_target: 1500,
    description: "Enfocado en reducir marcadores inflamatorios musculares y optimizar el metabolismo basal.",
    meals: {
      desayuno: "Huevos revueltos con espinacas y cúrcuma + infusión de jengibre y manzana verde.",
      media_manana: "Puñado de nueces y almendras (30g) + té verde.",
      almuerzo: "Filete de salmón o trucha a la plancha con quinoa tricolor y ensalada de hojas verdes con aceite de oliva extra virgen.",
      merienda: "Yogur griego natural con semillas de chía y arándanos.",
      cena: "Crema de calabacín y poro con pechuga de pavo al vapor.",
    },
    recommendations: [
      "Beber al menos 2.2 litros de agua mineral al día.",
      "Evitar azúcares refinados, ultraprocesados y harinas blancas.",
      "Cenar al menos 2 horas y media antes de ir a dormir.",
    ],
    created_at: "2025-02-05",
  },
  {
    id: "diet-2",
    patient_id: "pat-2",
    patient_name: "Juan Torres Ramos",
    title: "Pauta Proteica y Recuperación Muscular",
    category: "Personalizada",
    calories_target: 1850,
    description: "Diseñado para estimular la síntesis de colágeno y recuperación del cuádriceps tras cirugía de LCA.",
    meals: {
      desayuno: "Omelette de 3 claras y 1 huevo entero con avena cocida, canela y frutos rojos.",
      media_manana: "Batido de proteína aislado o yogur alto en proteína con plátano.",
      almuerzo: "Pechuga de pollo a la parrilla con camote al horno y brócoli al vapor con sésamo.",
      merienda: "Tostada integral con aguacate/palta y queso fresco light.",
      cena: "Filete de pescado blanco con espárragos salteados y ensalada de tomate y orégano.",
    },
    recommendations: [
      "Suplementar con Vitamina C y Colágeno hidrolizado en ayunas.",
      "Mantener hidratación constante durante las sesiones de fisioterapia.",
    ],
    created_at: "2025-02-10",
  },
  {
    id: "diet-3",
    title: "Pauta Digestiva y Desintoxicante Base",
    category: "Desintoxicante",
    calories_target: 1400,
    description: "Plantilla para pacientes con digestión pesada, hinchazón o sobrecarga metabólica.",
    meals: {
      desayuno: "Papaya picada con semillas de lino molidas y té de manzanilla o boldo.",
      media_manana: "1 pera o manzana cocida con canela.",
      almuerzo: "Pechuga a la plancha con puré de calabaza/zapallo y ensalada de zanahoria rallada.",
      merienda: "Infusión de hinojo y galleta de arroz con hummus.",
      cena: "Sopa ligera de verduras con trozos de pollo sin piel.",
    },
    recommendations: [
      "Comer despacio masticando 20 veces cada bocado.",
      "Evitar bebidas frías durante las comidas.",
    ],
    created_at: "2025-02-01",
  },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "inv-1", name: "Agujas de Acupuntura 0.25 x 25mm (Caja x 100)", category: "Agujas", stock: 18, min_stock: 5, unit: "cajas", price_cost: 32.0, last_updated: "2025-02-25" },
  { id: "inv-2", name: "Agujas de Acupuntura 0.30 x 40mm (Caja x 100)", category: "Agujas", stock: 12, min_stock: 5, unit: "cajas", price_cost: 35.0, last_updated: "2025-02-24" },
  { id: "inv-3", name: "Imanes de Plata de Alta Intensidad (4000 Gauss)", category: "Imanes", stock: 35, min_stock: 10, unit: "unidades", price_cost: 15.0, last_updated: "2025-02-26" },
  { id: "inv-4", name: "Imanes Decorativos Terapéuticos Auriculares", category: "Imanes", stock: 60, min_stock: 15, unit: "unidades", price_cost: 8.5, last_updated: "2025-02-26" },
  { id: "inv-5", name: "Semillas de Mostaza para Auriculoterapia (Pack)", category: "Insumos", stock: 4, min_stock: 8, unit: "paquetes", price_cost: 18.0, last_updated: "2025-02-20" },
  { id: "inv-6", name: "Gel Conductor para Ultrasonido / TENS (Galón 4L)", category: "Insumos", stock: 3, min_stock: 2, unit: "frascos", price_cost: 45.0, last_updated: "2025-02-15" },
  { id: "inv-7", name: "Aceite Esencial de Romero & Árnica para Masaje (500ml)", category: "Aceites & Cremas", stock: 8, min_stock: 3, unit: "frascos", price_cost: 38.0, last_updated: "2025-02-22" },
  { id: "inv-8", name: "Cintas Kinesiológicas / Kinesiotape (Rollos)", category: "Insumos", stock: 2, min_stock: 6, unit: "unidades", price_cost: 22.0, last_updated: "2025-02-18" },
];

const INITIAL_EXPENSES: Expense[] = [
  { id: "exp-1", description: "Reposición de 5 cajas de agujas de acupuntura y gel", category: "Materiales e Insumos", amount: 205.0, date: "2025-02-24", receipt_number: "F001-492" },
  { id: "exp-2", description: "Movilidad / Combustible para 4 visitas a domicilio", category: "Transporte Domiciliario", amount: 75.0, date: "2025-02-25", receipt_number: "T-892" },
  { id: "exp-3", description: "Alquiler mensual de consultorio (proporcional)", category: "Alquiler de Consultorio", amount: 950.0, date: "2025-02-01", receipt_number: "REC-2025-02" },
  { id: "exp-4", description: "Suscripción a plataforma clínica y mensajería", category: "Servicios & Software", amount: 65.0, date: "2025-02-05", receipt_number: "SUB-881" },
];

const todayStr = new Date().toISOString().split("T")[0];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "app-1",
    patient_id: "pat-1",
    patient_name: "María López Fernández",
    patient_phone: "+51 991 223 344",
    patient_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    professional_id: "pro-1",
    professional_name: "Dr. Carlos Pérez",
    specialty_id: "esp-4",
    specialty_name: "Acupuntura & Medicina China",
    date: todayStr,
    time: "09:00",
    duration_min: 45,
    status: "confirmed",
    location_type: "consultorio",
    stimulus_applied: "Acupuntura",
    package_id: "pkg-1",
    notes: "Sesión 5 del paquete. Enfoque en lumbalgia y relajación del sistema nervioso.",
    room: "Box 1 - Terapéutico",
    price: 85,
    payment_status: "paid",
    payment_method: "Yape",
  },
  {
    id: "app-2",
    patient_id: "pat-2",
    patient_name: "Juan Torres Ramos",
    patient_phone: "+51 984 556 778",
    patient_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    professional_id: "pro-2",
    professional_name: "Lic. Ana García",
    specialty_id: "esp-1",
    specialty_name: "Terapia Física & Rehabilitación",
    date: todayStr,
    time: "11:00",
    duration_min: 60,
    status: "confirmed",
    location_type: "domicilio",
    address: "Av. Benavides 2840, Miraflores",
    stimulus_applied: "Electroestimulación (TENS/EMS)",
    package_id: "pkg-2",
    notes: "Atención a domicilio con equipo portátil de EMS e imanes.",
    price: 120,
    payment_status: "paid",
    payment_method: "Transferencia",
  },
  {
    id: "app-3",
    patient_id: "pat-3",
    patient_name: "Elena Valdivia Cruz",
    patient_phone: "+51 977 889 900",
    patient_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    professional_id: "pro-3",
    professional_name: "Mg. Roberto Mendoza",
    specialty_id: "esp-5",
    specialty_name: "Nutrición y Dietética",
    date: todayStr,
    time: "15:00",
    duration_min: 45,
    status: "pending",
    location_type: "consultorio",
    stimulus_applied: "Magnetoterapia (Imanes de plata)",
    notes: "Revisión de dieta antiestrés y colocación de imanes en puntos de ansiedad.",
    room: "Consultorio 2",
    price: 90,
    payment_status: "pending",
  },
];

const INITIAL_PAYMENTS: Payment[] = [
  { id: "pay-1", appointment_id: "app-1", patient_name: "María López Fernández", location_type: "consultorio", amount: 85, method: "Yape", status: "paid", date: todayStr },
  { id: "pay-2", appointment_id: "app-2", patient_name: "Juan Torres Ramos", location_type: "domicilio", amount: 120, method: "Transferencia", status: "paid", date: todayStr },
  { id: "pay-3", appointment_id: "pkg-1", patient_name: "María López Fernández", location_type: "consultorio", amount: 720, method: "Tarjeta", status: "paid", date: "2025-02-05" },
];

const ClinicContext = createContext<ClinicContextType | null>(null);

const STORAGE_KEYS = {
  PATIENTS: "klinic_patients_v2",
  APPOINTMENTS: "klinic_appointments_v2",
  PAYMENTS: "klinic_payments_v2",
  SESSIONS: "klinic_sessions_v2",
  PACKAGES: "klinic_packages_v2",
  DIETS: "klinic_diets_v2",
  INVENTORY: "klinic_inventory_v2",
  EXPENSES: "klinic_expenses_v2",
  STIMULI: "klinic_stimuli_v2",
  SPECIALTIES: "klinic_specialties_v2",
};

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function ClinicProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const [patients, setPatients] = useState<Patient[]>(() => loadStored(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS));
  const [professionals] = useState<Professional[]>(INITIAL_PROFESSIONALS);
  const [specialties, setSpecialties] = useState<Specialty[]>(() => loadStored(STORAGE_KEYS.SPECIALTIES, INITIAL_SPECIALTIES));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadStored(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS));
  const [payments, setPayments] = useState<Payment[]>(() => loadStored(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS));
  const [sessionEvaluations, setSessionEvaluations] = useState<SessionEvaluation[]>(() => loadStored(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS));
  const [treatmentPackages, setTreatmentPackages] = useState<TreatmentPackage[]>(() => loadStored(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES));
  const [dietPlans, setDietPlans] = useState<DietPlan[]>(() => loadStored(STORAGE_KEYS.DIETS, INITIAL_DIETS));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadStored(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadStored(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES));
  const [stimuliList, setStimuliList] = useState<string[]>(() => loadStored(STORAGE_KEYS.STIMULI, DEFAULT_STIMULI));
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Sync state to local storage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessionEvaluations)); }, [sessionEvaluations]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(treatmentPackages)); }, [treatmentPackages]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DIETS, JSON.stringify(dietPlans)); }, [dietPlans]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.STIMULI, JSON.stringify(stimuliList)); }, [stimuliList]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SPECIALTIES, JSON.stringify(specialties)); }, [specialties]);

  // Actions - Citas
  const addAppointment = (appData: Omit<Appointment, "id">): Appointment => {
    const newApp: Appointment = {
      ...appData,
      id: "app-" + Math.random().toString(36).substring(2, 9),
    };
    setAppointments((prev) => [newApp, ...prev]);
    toast(`Cita programada para ${newApp.patient_name} (${newApp.time}) en ${newApp.location_type === "domicilio" ? "Domicilio" : "Consultorio"}`, "success", "Cita creada");
    return newApp;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
    const statusLabels: Record<AppointmentStatus, string> = {
      confirmed: "Cita confirmada",
      pending: "Cita marcada como pendiente",
      attended: "Atención finalizada con éxito",
      cancelled: "Cita cancelada",
      no_show: "Marcado como No asistió",
    };
    toast(statusLabels[status], "info");
  };

  const rescheduleAppointment = (id: string, date: string, time: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, date, time, status: "confirmed" } : app))
    );
    toast(`Cita reprogramada para el ${date} a las ${time}`, "success", "Reprogramación exitosa");
  };

  const cancelAppointment = (id: string) => {
    updateAppointmentStatus(id, "cancelled");
  };

  // Actions - Pacientes
  const addPatient = (patientData: Omit<Patient, "id" | "registered_at">): Patient => {
    const newPatient: Patient = {
      ...patientData,
      id: "pat-" + Math.random().toString(36).substring(2, 9),
      registered_at: todayStr,
    };
    setPatients((prev) => [newPatient, ...prev]);
    toast(`Paciente ${newPatient.name} registrado correctamente`, "success", "Paciente registrado");
    return newPatient;
  };

  const updatePatient = (id: string, patch: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
    toast("Ficha del paciente actualizada", "success");
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    toast("Paciente eliminado", "info");
  };

  // Actions - Sesiones Biomédicas
  const addSessionEvaluation = (sessionData: Omit<SessionEvaluation, "id">): SessionEvaluation => {
    const newSession: SessionEvaluation = {
      ...sessionData,
      id: "ses-" + Math.random().toString(36).substring(2, 9),
    };
    setSessionEvaluations((prev) => [...prev, newSession]);

    // Update package progress if patient has active package
    setTreatmentPackages((prev) =>
      prev.map((pkg) => {
        if (pkg.patient_id === sessionData.patient_id && pkg.status === "active") {
          const nextUsed = pkg.used_sessions + 1;
          return {
            ...pkg,
            used_sessions: nextUsed,
            status: nextUsed >= pkg.total_sessions ? "completed" : "active",
          };
        }
        return pkg;
      })
    );

    toast(`Evaluación de sesión #${newSession.session_number} guardada con éxito`, "success", "Métricas registradas");
    return newSession;
  };

  const updateSessionEvaluation = (id: string, patch: Partial<SessionEvaluation>) => {
    setSessionEvaluations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
    toast("Métricas de la sesión actualizadas", "success");
  };

  const deleteSessionEvaluation = (id: string) => {
    setSessionEvaluations((prev) => prev.filter((s) => s.id !== id));
    toast("Registro de sesión eliminado", "info");
  };

  // Actions - Paquetes
  const addTreatmentPackage = (pkgData: Omit<TreatmentPackage, "id">): TreatmentPackage => {
    const newPkg: TreatmentPackage = {
      ...pkgData,
      id: "pkg-" + Math.random().toString(36).substring(2, 9),
    };
    setTreatmentPackages((prev) => [newPkg, ...prev]);
    toast(`Paquete "${newPkg.name}" asignado con ${newPkg.total_sessions} sesiones`, "success");
    return newPkg;
  };

  const updateTreatmentPackage = (id: string, patch: Partial<TreatmentPackage>) => {
    setTreatmentPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  };

  // Actions - Dietas
  const addDietPlan = (dietData: Omit<DietPlan, "id" | "created_at">): DietPlan => {
    const newDiet: DietPlan = {
      ...dietData,
      id: "diet-" + Math.random().toString(36).substring(2, 9),
      created_at: todayStr,
    };
    setDietPlans((prev) => [newDiet, ...prev]);
    toast(`Plan nutricional "${newDiet.title}" guardado`, "success");
    return newDiet;
  };

  const updateDietPlan = (id: string, patch: Partial<DietPlan>) => {
    setDietPlans((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...patch } : d))
    );
    toast("Dieta actualizada", "success");
  };

  const deleteDietPlan = (id: string) => {
    setDietPlans((prev) => prev.filter((d) => d.id !== id));
    toast("Plan nutricional eliminado", "info");
  };

  // Actions - Inventario
  const addInventoryItem = (itemData: Omit<InventoryItem, "id" | "last_updated">): InventoryItem => {
    const newItem: InventoryItem = {
      ...itemData,
      id: "inv-" + Math.random().toString(36).substring(2, 9),
      last_updated: todayStr,
    };
    setInventory((prev) => [newItem, ...prev]);
    toast(`Insumo "${newItem.name}" agregado al stock`, "success");
    return newItem;
  };

  const updateInventoryItem = (id: string, patch: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...patch, last_updated: todayStr } : i))
    );
    toast("Inventario actualizado", "success");
  };

  const adjustStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const newStock = Math.max(0, i.stock + delta);
          return { ...i, stock: newStock, last_updated: todayStr };
        }
        return i;
      })
    );
  };

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
    toast("Insumo eliminado del stock", "info");
  };

  // Actions - Gastos & Pagos
  const addExpense = (expenseData: Omit<Expense, "id">): Expense => {
    const newExp: Expense = {
      ...expenseData,
      id: "exp-" + Math.random().toString(36).substring(2, 9),
    };
    setExpenses((prev) => [newExp, ...prev]);
    toast(`Gasto de S/ ${newExp.amount.toFixed(2)} registrado`, "info");
    return newExp;
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast("Gasto eliminado", "info");
  };

  const recordPayment = (paymentData: Omit<Payment, "id" | "date">) => {
    const newPay: Payment = {
      ...paymentData,
      id: "pay-" + Math.random().toString(36).substring(2, 9),
      date: todayStr,
    };
    setPayments((prev) => [newPay, ...prev]);
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === paymentData.appointment_id
          ? { ...app, payment_status: paymentData.status, payment_method: paymentData.method }
          : app
      )
    );
    toast(`Pago de S/ ${newPay.amount.toFixed(2)} registrado vía ${newPay.method} (${paymentData.location_type === "domicilio" ? "Domicilio" : "Consultorio"})`, "success", "Pago confirmado");
  };

  // Actions - Estímulos
  const addStimulus = (name: string) => {
    if (!name.trim() || stimuliList.includes(name.trim())) return;
    setStimuliList((prev) => [...prev, name.trim()]);
    toast(`Estímulo "${name.trim()}" agregado al catálogo`, "success");
  };

  // Actions - Especialidades
  const addSpecialty = (specialtyData: Omit<Specialty, "id">): Specialty => {
    const newSpecialty: Specialty = {
      ...specialtyData,
      id: "esp-" + Math.random().toString(36).substring(2, 9),
    };
    setSpecialties((prev) => [...prev, newSpecialty]);
    toast(`Especialidad ${newSpecialty.name} creada`, "success");
    return newSpecialty;
  };

  const updateSpecialty = (id: string, patch: Partial<Specialty>) => {
    setSpecialties((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  };

  const deleteSpecialty = (id: string) => {
    setSpecialties((prev) => prev.filter((s) => s.id !== id));
    toast("Especialidad eliminada", "info");
  };

  // Calculations
  const todayApps = appointments.filter((a) => a.date === todayStr && a.status !== "cancelled");
  const confirmedCount = todayApps.filter((a) => a.status === "confirmed").length;
  const pendingCount = todayApps.filter((a) => a.status === "pending").length;
  const attendedCount = todayApps.filter((a) => a.status === "attended").length;

  const todayRevenue = payments
    .filter((p) => p.date === todayStr && p.status === "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const consultorioRevenue = payments
    .filter((p) => p.status === "paid" && (p.location_type === "consultorio" || !p.location_type))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const domicilioRevenue = payments
    .filter((p) => p.status === "paid" && p.location_type === "domicilio")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = monthlyRevenue - totalExpenses;
  const lowStockCount = inventory.filter((i) => i.stock <= i.min_stock).length;

  return (
    <ClinicContext.Provider
      value={{
        patients,
        professionals,
        specialties,
        appointments,
        payments,
        sessionEvaluations,
        treatmentPackages,
        dietPlans,
        inventory,
        expenses,
        stimuliList,
        selectedDate,
        setSelectedDate,
        addAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        cancelAppointment,
        addPatient,
        updatePatient,
        deletePatient,
        addSessionEvaluation,
        updateSessionEvaluation,
        deleteSessionEvaluation,
        addTreatmentPackage,
        updateTreatmentPackage,
        addDietPlan,
        updateDietPlan,
        deleteDietPlan,
        addInventoryItem,
        updateInventoryItem,
        adjustStock,
        deleteInventoryItem,
        addExpense,
        deleteExpense,
        recordPayment,
        addStimulus,
        addSpecialty,
        updateSpecialty,
        deleteSpecialty,
        kpiStats: {
          todayAppointments: todayApps.length,
          confirmed: confirmedCount,
          pending: pendingCount,
          attended: attendedCount,
          todayRevenue,
          monthlyRevenue,
          consultorioRevenue,
          domicilioRevenue,
          totalExpenses,
          netProfit,
          lowStockCount,
        },
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error("useClinic debe usarse dentro de ClinicProvider");
  return ctx;
}
