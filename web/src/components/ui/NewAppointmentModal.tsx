import React, { useState } from "react";
import {
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Plus,
  Home,
  Building2,
  Calendar,
  Clock,
  User,
  CreditCard,
  FileText,
  Sparkles,
  MapPin,
  IdCard,
  Phone,
  Hash,
} from "lucide-react";
import {
  useClinic,
  type Specialty,
  type Professional,
  type PaymentMethod,
  type AppointmentLocation,
} from "../../context/ClinicContext";
import { SearchableSelect, type SearchableOption } from "./SearchableSelect";

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  preselectedPatientId,
}: NewAppointmentModalProps) {
  const {
    patients,
    specialties,
    professionals,
    stimuliList,
    treatmentPackages,
    addAppointment,
    addPatient,
  } = useClinic();

  const [step, setStep] = useState(1);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    preselectedPatientId || ""
  );

  // New patient inline creation state
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDni, setNewDni] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAge, setNewAge] = useState(30);

  const [locationType, setLocationType] = useState<AppointmentLocation>("consultorio");
  const [address, setAddress] = useState("");
  const [stimulus, setStimulus] = useState(stimuliList[0] || "Acupuntura");
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(
    specialties[0] || null
  );
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(
    professionals[0] || null
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [notes, setNotes] = useState("");
  const [room] = useState("Box 1 - Terapéutico");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Yape");
  const [markPaid, setMarkPaid] = useState(false);

  if (!isOpen) return null;

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || null;

  // Options for SearchableSelect (Patient selection)
  const patientOptions: SearchableOption[] = patients.map((p) => ({
    value: p.id,
    label: p.name,
    sublabel: `DNI: ${p.dni} • Tel: ${p.phone}`,
    badge: p.status === "active" ? "Activo" : "Inactivo",
    badgeColor:
      p.status === "active"
        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        : "bg-slate-800 text-slate-400",
    icon: <User className="w-4 h-4" />,
  }));

  // Options for SearchableSelect (Stimulus selection)
  const stimulusOptions: SearchableOption[] = stimuliList.map((st) => ({
    value: st,
    label: st,
    icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
  }));

  // Options for SearchableSelect (Time selection)
  const availableTimes = [
    "08:00", "08:45", "09:30", "10:15", "11:00", "11:45",
    "14:00", "14:45", "15:30", "16:15", "17:00", "17:45",
  ];
  const timeOptions: SearchableOption[] = availableTimes.map((t) => ({
    value: t,
    label: `${t} hrs`,
    icon: <Clock className="w-4 h-4 text-emerald-400" />,
  }));

  // Options for Payment Method
  const paymentOptions: SearchableOption[] = [
    { value: "Yape", label: "Yape", icon: <CreditCard className="w-4 h-4" /> },
    { value: "Plin", label: "Plin", icon: <CreditCard className="w-4 h-4" /> },
    { value: "Efectivo", label: "Efectivo", icon: <CreditCard className="w-4 h-4" /> },
    { value: "Tarjeta", label: "Tarjeta de Crédito/Débito", icon: <CreditCard className="w-4 h-4" /> },
    { value: "Transferencia", label: "Transferencia Bancaria", icon: <CreditCard className="w-4 h-4" /> },
  ];

  const patientPackages = selectedPatient
    ? treatmentPackages.filter(
        (p) => p.patient_id === selectedPatient.id && p.status === "active"
      )
    : [];

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDni) return;
    const p = addPatient({
      name: newName,
      dni: newDni,
      phone: newPhone || "+51 900 000 000",
      email: `${newDni}@correo.com`,
      age: Number(newAge),
      status: "active",
      reference_targets: {
        height_cm: 165,
        ideal_weight: 60.0,
        ideal_fat_pct: 20.0,
        ideal_imc: 22.0,
      },
      clinical_history: {
        antecedentes: "Sin antecedentes registrados",
        motivo_consulta: "Ingreso nuevo",
        evaluacion: "Pendiente",
        diagnostico: "Por determinar en primera sesión",
        tratamiento: "Por definir",
        evolucion: "Primera atención",
      },
    });
    setSelectedPatientId(p.id);
    setIsCreatingPatient(false);
  };

  const handleConfirmAppointment = () => {
    if (!selectedPatient || !selectedSpecialty || !selectedProfessional) return;

    addAppointment({
      patient_id: selectedPatient.id,
      patient_name: selectedPatient.name,
      patient_phone: selectedPatient.phone,
      patient_avatar: selectedPatient.avatar_url,
      professional_id: selectedProfessional.id,
      professional_name: selectedProfessional.name,
      professional_avatar: selectedProfessional.avatar_url,
      specialty_id: selectedSpecialty.id,
      specialty_name: selectedSpecialty.name,
      date: selectedDate,
      time: selectedTime,
      duration_min: selectedSpecialty.duration_min,
      status: "confirmed",
      location_type: locationType,
      address:
        locationType === "domicilio"
          ? address || selectedPatient.address || "Domicilio del paciente"
          : undefined,
      stimulus_applied: stimulus,
      package_id: patientPackages[0]?.id,
      notes,
      room: locationType === "consultorio" ? room : "Atención Domiciliaria",
      price:
        locationType === "domicilio"
          ? selectedSpecialty.price + 30
          : selectedSpecialty.price,
      payment_status: markPaid ? "paid" : "pending",
      payment_method: markPaid ? paymentMethod : undefined,
    });

    onClose();
    setStep(1);
    setSelectedPatientId("");
  };

  // Google Calendar Link generator
  const googleCalendarUrl =
    selectedPatient && selectedSpecialty
      ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
          `${selectedSpecialty.name} - ${selectedPatient.name}`
        )}&dates=${selectedDate.replace(/-/g, "")}T${selectedTime.replace(
          ":",
          ""
        )}00/${selectedDate.replace(/-/g, "")}T${(
          parseInt(selectedTime.split(":")[0]) + 1
        )
          .toString()
          .padStart(2, "0")}${selectedTime.split(":")[1]}00&details=${encodeURIComponent(
          `Paciente: ${selectedPatient.name}\nTeléfono: ${
            selectedPatient.phone
          }\nModalidad: ${
            locationType === "domicilio" ? "Visita a Domicilio" : "Consultorio"
          }\nEstímulo: ${stimulus}\nNotas: ${notes}`
        )}&location=${encodeURIComponent(
          locationType === "domicilio"
            ? address || selectedPatient.address || "Domicilio"
            : "Centro Terapéutico Vida"
        )}`
      : "#";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Agendar Nueva Cita</h3>
              <p className="text-xs text-slate-400">
                Paso {step} de 3 •{" "}
                {step === 1
                  ? "Seleccionar Paciente"
                  : step === 2
                  ? "Servicio, Modalidad y Estímulo"
                  : "Fecha, Horario y Confirmación"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progress */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40 text-xs font-semibold">
          {[
            { num: 1, label: "1. Paciente" },
            { num: 2, label: "2. Servicio & Terapia" },
            { num: 3, label: "3. Fecha & Horario" },
          ].map((s) => (
            <div
              key={s.num}
              className={`py-2.5 text-center transition ${
                step === s.num
                  ? "border-b-2 border-emerald-500 text-emerald-400 bg-emerald-500/5"
                  : step > s.num
                  ? "text-slate-300 border-b-2 border-slate-700"
                  : "text-slate-500"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: SELECT OR CREATE PATIENT */}
          {step === 1 && (
            <div className="space-y-4">
              {!isCreatingPatient ? (
                <>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>Buscar o Seleccionar Paciente</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCreatingPatient(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Nuevo Paciente
                    </button>
                  </div>

                  {/* Searchable Select with max 2 visible options */}
                  <SearchableSelect
                    options={patientOptions}
                    value={selectedPatientId}
                    onChange={(val) => setSelectedPatientId(val)}
                    placeholder="Escribe el nombre o DNI del paciente..."
                    icon={<User className="w-4 h-4" />}
                    maxResults={2}
                  />

                  {/* Selected Patient Card Preview */}
                  {selectedPatient && (
                    <div className="p-4 bg-slate-950/60 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            selectedPatient.avatar_url ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                          }
                          alt={selectedPatient.name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {selectedPatient.name}
                          </h4>
                          <p className="text-xs text-slate-400">
                            DNI: {selectedPatient.dni} • Tel: {selectedPatient.phone}
                          </p>
                          {selectedPatient.address && (
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-emerald-400" />{" "}
                              {selectedPatient.address}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold">
                        Seleccionado
                      </span>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      disabled={!selectedPatient}
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-slate-950 bg-emerald-500 rounded-xl hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <span>Continuar a Servicios</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                /* Form in 2 Columns with Icons */
                <form onSubmit={handleCreatePatient} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>Registro Rápido de Paciente</span>
                    </h4>
                    <span className="text-xs text-slate-400">Formulario en 2 columnas</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full name */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Nombre Completo *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: María Santos Ramos"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* DNI */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                        <IdCard className="w-3.5 h-3.5 text-emerald-400" />
                        <span>DNI / Documento *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 71234567"
                        value={newDni}
                        onChange={(e) => setNewDni(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Teléfono / WhatsApp</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: +51 987 654 321"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* Age */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                        <Hash className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Edad (Años)</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={newAge}
                        onChange={(e) => setNewAge(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingPatient(false)}
                      className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 rounded-xl hover:bg-emerald-400 transition"
                    >
                      Guardar y Seleccionar
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: SERVICE, LOCATION & STIMULUS */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Modality in 2 Columns */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Modalidad de Atención *</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setLocationType("consultorio")}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                      locationType === "consultorio"
                        ? "bg-emerald-500/10 border-emerald-500 text-white"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        locationType === "consultorio"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">En Consultorio</p>
                      <p className="text-[11px] text-slate-400">
                        Atención en sede clínica principal
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setLocationType("domicilio")}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                      locationType === "domicilio"
                        ? "bg-purple-500/10 border-purple-500 text-white"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        locationType === "domicilio"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">A Domicilio</p>
                      <p className="text-[11px] text-slate-400">
                        Visita en casa del paciente (+S/ 30.00)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Domicile Address if applicable */}
              {locationType === "domicilio" && (
                <div className="space-y-1.5 animate-in fade-in-50">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span>Dirección Exacta de la Visita Domiciliaria</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Av. Benavides 2840, Dpto 402, Miraflores"
                    value={address || selectedPatient?.address || ""}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Form 2-Column Grid: Stimulus & Specialty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stimulus with SearchableSelect (max 2 results) */}
                <SearchableSelect
                  label="Estímulo Terapéutico Principal"
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                  options={stimulusOptions}
                  value={stimulus}
                  onChange={(val) => setStimulus(val)}
                  placeholder="Buscar estímulo (Acupuntura, Magnetoterapia...)"
                  maxResults={2}
                />

                {/* Specialty Select with SearchableSelect */}
                <SearchableSelect
                  label="Especialidad / Servicio *"
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                  options={specialties.map((s) => ({
                    value: String(s.id),
                    label: s.name,
                    sublabel: `${s.duration_min} min • S/ ${s.price.toFixed(2)}`,
                    icon: <Building2 className="w-4 h-4" />,
                  }))}
                  value={selectedSpecialty ? String(selectedSpecialty.id) : ""}
                  onChange={(val) => {
                    const sp = specialties.find((s) => String(s.id) === val);
                    if (sp) setSelectedSpecialty(sp);
                  }}
                  placeholder="Seleccionar especialidad..."
                  maxResults={2}
                />
              </div>

              {/* Form 2-Column Grid: Professional Selection */}
              <div className="space-y-1.5">
                <SearchableSelect
                  label="Profesional Tratante *"
                  icon={<User className="w-3.5 h-3.5" />}
                  options={professionals.map((pr) => ({
                    value: String(pr.id),
                    label: pr.name,
                    sublabel: pr.title,
                    icon: <User className="w-4 h-4" />,
                  }))}
                  value={
                    selectedProfessional ? String(selectedProfessional.id) : ""
                  }
                  onChange={(val) => {
                    const pro = professionals.find((p) => String(p.id) === val);
                    if (pro) setSelectedProfessional(pro);
                  }}
                  placeholder="Seleccionar profesional..."
                  maxResults={2}
                />
              </div>

              {/* Active Package notification */}
              {patientPackages.length > 0 && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between text-xs text-blue-300">
                  <span>
                    📦 Paquete Activo: <strong>{patientPackages[0].name}</strong>
                  </span>
                  <span className="font-bold">
                    {patientPackages[0].total_sessions -
                      patientPackages[0].used_sessions}{" "}
                    sesiones restantes
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Volver
                </button>
                <button
                  type="button"
                  disabled={!selectedSpecialty || !selectedProfessional}
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-500 rounded-xl hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <span>Continuar a Horario</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DATE, TIME & CONFIRM */}
          {step === 3 && (
            <div className="space-y-4">
              {/* 2 Columns: Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fecha de la Cita *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Time selector with SearchableSelect */}
                <SearchableSelect
                  label="Hora de Atención *"
                  icon={<Clock className="w-3.5 h-3.5" />}
                  options={timeOptions}
                  value={selectedTime}
                  onChange={(val) => setSelectedTime(val)}
                  placeholder="Seleccionar hora..."
                  maxResults={2}
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Notas Adicionales o Motivo de Atención</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Paciente refiere dolor lumbar al agacharse..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Payment Section */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                  <input
                    type="checkbox"
                    checked={markPaid}
                    onChange={(e) => setMarkPaid(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/20"
                  />
                  <span>Marcar consulta como cobrada/pagada de inmediato</span>
                </label>

                {markPaid && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <SearchableSelect
                      label="Método de Pago"
                      icon={<CreditCard className="w-3.5 h-3.5" />}
                      options={paymentOptions}
                      value={paymentMethod}
                      onChange={(val) => setPaymentMethod(val as PaymentMethod)}
                      placeholder="Seleccionar método de pago..."
                      maxResults={2}
                    />
                  </div>
                )}
              </div>

              {/* Google Calendar Direct Link */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Google Calendar:</strong> Genera y sincroniza la cita con tu calendario.
                  </span>
                </div>
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition shrink-0"
                >
                  + Google Calendar
                </a>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700 transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Volver
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAppointment}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-500 rounded-xl hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirmar & Agendar Cita</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
