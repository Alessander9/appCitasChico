import React, { useState, useMemo } from "react";
import {
  Search,
  FileText,
  UserPlus,
  Scale,
  Filter,
  User,
  Phone,
  Mail,
  MapPin,
  IdCard,
  Hash,
  Ruler,
  Activity,
  HeartPulse,
  Sparkles,
} from "lucide-react";
import { useClinic, type Patient } from "../context/ClinicContext";
import { StatusBadge } from "../components/ui/StatusBadge";
import { PatientDrawer } from "../components/ui/PatientDrawer";
import { NewAppointmentModal } from "../components/ui/NewAppointmentModal";
import { ImcIndicator, calculateImc } from "../components/ui/ImcIndicator";
import { Pagination } from "../components/ui/Pagination";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
];

export default function Pacientes() {
  const { patients, addPatient, sessionEvaluations } = useClinic();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [targetPatientForApp, setTargetPatientForApp] = useState<string | null>(null);

  // Form state for new patient
  const [name, setName] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(30);
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]);
  const [heightCm, setHeightCm] = useState(165);
  const [idealWeight, setIdealWeight] = useState(60.0);
  const [idealFat, setIdealFat] = useState(20.0);
  const [idealImc, setIdealImc] = useState(22.0);
  const [motivo, setMotivo] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [antecedentes, setAntecedentes] = useState("");

  // Filter patients by search term and status
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.dni.includes(search) ||
        p.phone.includes(search) ||
        (p.clinical_history?.diagnostico || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && p.status === "active") ||
        (statusFilter === "inactive" && p.status === "inactive");

      return matchesSearch && matchesStatus;
    });
  }, [patients, search, statusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPatients.slice(start, start + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dni) return;
    const created = addPatient({
      name,
      dni,
      phone: phone || "+51 900 000 000",
      email: email || `${dni}@correo.com`,
      age: Number(age),
      address: address || "Consultorio Central",
      avatar_url: avatarUrl,
      status: "active",
      reference_targets: {
        height_cm: Number(heightCm),
        ideal_weight: Number(idealWeight),
        ideal_fat_pct: Number(idealFat),
        ideal_imc: Number(idealImc),
      },
      clinical_history: {
        antecedentes: antecedentes || "Sin antecedentes patológicos relevantes.",
        motivo_consulta: motivo || "Evaluación general y plan terapéutico",
        evaluacion: "Evaluación física inicial y patrones observados",
        diagnostico: diagnostico || "Diagnóstico terapéutico inicial",
        tratamiento: "Plan integral de sesiones por determinar",
        evolucion: "Ingreso al centro terapéutico",
      },
    });
    setIsNewPatientModalOpen(false);
    setSelectedPatient(created);
    // Reset form
    setName("");
    setDni("");
    setPhone("");
    setEmail("");
    setAddress("");
    setMotivo("");
    setDiagnostico("");
    setAntecedentes("");
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Clínica</span>
            <span>/</span>
            <span className="text-indigo-600">Directorio de Pacientes</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pacientes & Fichas Clínicas 360°
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Expedientes integrales, bioimpedancia por sesión, metas de composición corporal y generación de reportes en PDF.
          </p>
        </div>

        <button
          onClick={() => setIsNewPatientModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-indigo-500/20 transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Nuevo Paciente</span>
        </button>
      </div>

      {/* Toolbar: Search, Filters & Stats */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input with icon */}
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
          <Search className="w-4 h-4 text-indigo-500 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por Nombre, DNI, teléfono o diagnóstico..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-transparent border-none outline-none text-slate-900 text-xs placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="text-xs text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-slate-500">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none outline-none text-slate-800 text-xs font-semibold cursor-pointer"
            >
              <option value="all">Todos ({patients.length})</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            <span className="text-slate-900 font-bold">{filteredPatients.length}</span> encontrados
          </div>
        </div>
      </div>

      {/* Patients Table Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Paciente</th>
                <th className="py-3.5 px-4">DNI / Documento</th>
                <th className="py-3.5 px-4">Contacto</th>
                <th className="py-3.5 px-4">Metas Ideales (Altura / Peso)</th>
                <th className="py-3.5 px-4">Último IMC</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPatients.length > 0 ? (
                paginatedPatients.map((patient) => {
                  const patSessions = sessionEvaluations.filter(
                    (s) => s.patient_id === patient.id
                  );
                  const latestSession = patSessions[patSessions.length - 1];
                  const currentWeight = latestSession?.weight ?? patient.reference_targets?.ideal_weight ?? 60;
                  const currentHeight = patient.reference_targets?.height_cm ?? 165;
                  const currentImc = calculateImc(currentWeight, currentHeight);

                  return (
                    <tr
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      {/* Name & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              patient.avatar_url ||
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                            }
                            alt={patient.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {patient.name}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {patient.age} años • {patient.address || "Consultorio"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DNI */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        {patient.dni}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="text-slate-800 font-medium">{patient.phone}</p>
                          <p className="text-[11px] text-slate-400">{patient.email}</p>
                        </div>
                      </td>

                      {/* Targets */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="text-slate-800 font-semibold">
                            {patient.reference_targets?.height_cm || 165} cm •{" "}
                            {patient.reference_targets?.ideal_weight || 60} kg
                          </span>
                          <p className="text-[11px] text-emerald-600 font-semibold">
                            Meta Grasa: {patient.reference_targets?.ideal_fat_pct || 20}%
                          </p>
                        </div>
                      </td>

                      {/* Latest IMC */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                            currentImc < 18.5
                              ? "bg-sky-50 text-sky-700 border border-sky-200"
                              : currentImc <= 24.9
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : currentImc <= 29.9
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {currentImc} IMC
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={patient.status} />
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(patient);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition shadow-2xs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Ficha 360°</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No se encontraron pacientes que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPatients.length}
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 8, 15, 25]}
        />
      </div>

      {/* Patient Drawer 360 */}
      <PatientDrawer
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onNewAppointment={(patId) => {
          setSelectedPatient(null);
          setTargetPatientForApp(patId);
          setIsNewAppointmentModalOpen(true);
        }}
      />

      {/* New Patient Modal: 2 Columns with Icons */}
      {isNewPatientModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in-50"
          onClick={() => setIsNewPatientModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Registrar Nuevo Paciente & Ficha Inicial
                  </h3>
                  <p className="text-xs text-slate-500">Formulario clínico en 2 columnas</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewPatientModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4 mt-4">
              {/* Photo Selector */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Foto de Perfil del Paciente</span>
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="avatar preset"
                      onClick={() => setAvatarUrl(url)}
                      className={`w-11 h-11 rounded-full object-cover cursor-pointer transition ${
                        avatarUrl === url
                          ? "ring-2 ring-indigo-600 ring-offset-2 ring-offset-white scale-105"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 2 Columns: Identification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Nombre Completo *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Rodrigo Silva Mendoza"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <IdCard className="w-3.5 h-3.5 text-indigo-600" />
                    <span>DNI / Documento *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="72849102"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Hash className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Edad (Años)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Teléfono / WhatsApp</span>
                  </label>
                  <input
                    type="text"
                    placeholder="+51 987 654 321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="paciente@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Dirección (para visitas a Domicilio)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Av. Primavera 540, Dpto 201, Surco"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Reference Targets & Auto IMC in 2-Column Grid */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-indigo-600" />
                    <span>Parámetros de Referencia (Metas Ideales)</span>
                  </span>
                  <span className="text-[11px] text-slate-500">Cálculo en vivo de IMC</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                      <Ruler className="w-3 h-3 text-indigo-600" />
                      <span>Altura (cm) *</span>
                    </label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => {
                        const h = Number(e.target.value);
                        setHeightCm(h);
                        setIdealImc(calculateImc(idealWeight, h));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                      <Scale className="w-3 h-3 text-indigo-600" />
                      <span>Peso Ideal (kg) *</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={idealWeight}
                      onChange={(e) => {
                        const w = Number(e.target.value);
                        setIdealWeight(w);
                        setIdealImc(calculateImc(w, heightCm));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                      <Activity className="w-3 h-3 text-indigo-600" />
                      <span>% Grasa Estimada</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={idealFat}
                      onChange={(e) => setIdealFat(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Real-time Colored IMC Bar */}
                <ImcIndicator weightKg={idealWeight} heightCm={heightCm} showScaleBar={true} />
              </div>

              {/* Clinical History Notes */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Motivo de Consulta & Patrones Observados</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Dolor lumbar agudo, contractura trapecios, insomnio..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <HeartPulse className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Diagnóstico Principal</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Lumbalgia mecánica con síndrome miofascial"
                  value={diagnostico}
                  onChange={(e) => setDiagnostico(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewPatientModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition"
                >
                  Registrar Paciente & Abrir Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isNewAppointmentModalOpen}
        onClose={() => {
          setIsNewAppointmentModalOpen(false);
          setTargetPatientForApp(null);
        }}
        preselectedPatientId={targetPatientForApp || undefined}
      />
    </div>
  );
}
