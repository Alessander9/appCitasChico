import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Phone,
  Search,
  List,
  LayoutGrid,
  Building2,
  Home,
  Clock,
} from "lucide-react";
import { useClinic, type Appointment } from "../context/ClinicContext";
import { StatusBadge } from "../components/ui/StatusBadge";
import { AppointmentDrawer } from "../components/ui/AppointmentDrawer";
import { NewAppointmentModal } from "../components/ui/NewAppointmentModal";
import { Pagination } from "../components/ui/Pagination";

export default function Agenda() {
  const {
    appointments,
    professionals,
    specialties,
    selectedDate,
    setSelectedDate,
  } = useClinic();

  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  const [search, setSearch] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");

  // Pagination for list view
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const hours = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  ];

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  const handleWhatsAppReminder = (app: Appointment, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = app.patient_phone.replace(/[^0-9]/g, "");
    const msg =
      `Hola *${app.patient_name}*, te recordamos tu cita de *${app.specialty_name}* programada para el día *${app.date}* a las *${app.time}*.\n` +
      `Modalidad: ${
        app.location_type === "domicilio"
          ? `A Domicilio (${app.address || "Dirección registrada"})`
          : `En Consultorio (${app.room || "Box Principal"})`
      }.\n` +
      `Tratamiento/Estímulo: ${
        app.stimulus_applied || "Terapia Especializada"
      }.\n` +
      `¡Te esperamos puntual! - Centro Terapéutico Vida`;
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const handleGoogleCalendar = (app: Appointment, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `${app.specialty_name} - ${app.patient_name}`
    )}&dates=${app.date.replace(/-/g, "")}T${app.time.replace(
      ":",
      ""
    )}00/${app.date.replace(/-/g, "")}T${(
      parseInt(app.time.split(":")[0]) + 1
    )
      .toString()
      .padStart(2, "0")}${app.time.split(":")[1]}00&details=${encodeURIComponent(
      `Paciente: ${app.patient_name}\nTeléfono: ${
        app.patient_phone
      }\nModalidad: ${
        app.location_type === "domicilio" ? "A Domicilio" : "En Consultorio"
      }\nEstímulo: ${app.stimulus_applied || "Terapia"}`
    )}&location=${encodeURIComponent(
      app.location_type === "domicilio"
        ? app.address || "Domicilio"
        : "Centro Terapéutico Vida"
    )}`;
    window.open(url, "_blank");
  };

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchDate = viewMode === "calendar" ? a.date === selectedDate : true;
      const matchSearch =
        a.patient_name.toLowerCase().includes(search.toLowerCase()) ||
        a.patient_phone.includes(search) ||
        a.professional_name.toLowerCase().includes(search.toLowerCase()) ||
        a.specialty_name.toLowerCase().includes(search.toLowerCase()) ||
        (a.stimulus_applied || "").toLowerCase().includes(search.toLowerCase());

      const matchSpec =
        filterSpecialty === "all" || a.specialty_id === filterSpecialty;
      const matchStatus =
        filterStatus === "all" || a.status === filterStatus;
      const matchLoc =
        filterLocation === "all" ||
        (a.location_type || "consultorio") === filterLocation;

      return matchDate && matchSearch && matchSpec && matchStatus && matchLoc;
    });
  }, [
    appointments,
    viewMode,
    selectedDate,
    search,
    filterSpecialty,
    filterStatus,
    filterLocation,
  ]);

  // Pagination for list view
  const totalPages = Math.ceil(filteredAppointments.length / pageSize) || 1;
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAppointments.slice(start, start + pageSize);
  }, [filteredAppointments, currentPage, pageSize]);

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Agenda Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Clínica</span>
            <span>/</span>
            <span className="text-indigo-600">Agenda & Citas</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Agenda Médica & Google Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Programación de citas, atención en consultorio o a domicilio, y recordatorios por WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Toggle view mode */}
          <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-xl shadow-2xs">
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === "calendar"
                  ? "bg-white text-indigo-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Vista Calendario"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grilla</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === "list"
                  ? "bg-white text-indigo-700 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Vista Lista"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lista</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-indigo-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Date navigation, Search & Filters */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Date Jump Controls (if in calendar mode) */}
        {viewMode === "calendar" && (
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0">
            <button
              onClick={handlePrevDay}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-white transition"
              title="Día anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg transition"
            >
              Hoy
            </button>
            <button
              onClick={handleNextDay}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-white transition"
              title="Día siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-l border-slate-200 pl-2 pr-1 py-1 text-xs font-bold text-indigo-600 outline-none cursor-pointer"
            />
          </div>
        )}

        {/* Search input with live typing filter */}
        <div className="flex items-center gap-2 flex-1 max-w-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
          <Search className="w-4 h-4 text-indigo-500 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por paciente, teléfono o estímulo..."
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

        {/* Filter Selects */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Location filter */}
          <select
            value={filterLocation}
            onChange={(e) => {
              setFilterLocation(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:bg-white focus:border-indigo-500 outline-none"
          >
            <option value="all">Todas las Modalidades</option>
            <option value="consultorio">🏥 En Consultorio</option>
            <option value="domicilio">🏠 A Domicilio</option>
          </select>

          {/* Specialty filter */}
          <select
            value={filterSpecialty}
            onChange={(e) => {
              setFilterSpecialty(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:bg-white focus:border-indigo-500 outline-none"
          >
            <option value="all">Todas las Especialidades</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:bg-white focus:border-indigo-500 outline-none"
          >
            <option value="all">Todos los Estados</option>
            <option value="confirmed">Confirmada</option>
            <option value="pending">Pendiente</option>
            <option value="attended">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
      </div>

      {/* VIEW MODE: CALENDAR GRID */}
      {viewMode === "calendar" ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-x-auto">
          <div
            style={{
              minWidth: "860px",
              display: "grid",
              gridTemplateColumns: `90px repeat(${professionals.length}, 1fr)`,
            }}
          >
            {/* Header: Professionals */}
            <div className="p-4 border-b border-r border-slate-200 bg-slate-50/80 font-bold text-xs text-slate-500 flex items-center justify-center">
              HORARIO
            </div>
            {professionals.map((pro) => (
              <div
                key={pro.id}
                className="p-3 border-b border-r border-slate-200 bg-slate-50/80 flex items-center gap-2.5"
              >
                <img
                  src={pro.avatar_url}
                  alt={pro.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <p className="font-bold text-xs text-slate-900">{pro.name}</p>
                  <p className="text-[10px] text-slate-500">{pro.title}</p>
                </div>
              </div>
            ))}

            {/* Time Rows */}
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                {/* Hour Label */}
                <div className="p-3 border-b border-r border-slate-100 text-xs font-bold text-slate-500 text-center bg-slate-50/40 flex items-center justify-center">
                  {hour}
                </div>

                {/* Columns per professional */}
                {professionals.map((pro) => {
                  const app = filteredAppointments.find(
                    (a) =>
                      a.professional_id === pro.id &&
                      a.time.startsWith(hour.substring(0, 2))
                  );

                  return (
                    <div
                      key={`${pro.id}-${hour}`}
                      className="p-1.5 border-b border-r border-slate-100 min-h-[96px] relative hover:bg-slate-50/40 transition"
                    >
                      {app ? (
                        <div
                          onClick={() => setSelectedApp(app)}
                          className={`p-2.5 rounded-xl border cursor-pointer h-full flex flex-col justify-between transition hover:shadow-sm ${
                            app.location_type === "domicilio"
                              ? "bg-purple-50/80 border-purple-200 text-purple-900"
                              : "bg-indigo-50/80 border-indigo-200 text-indigo-900"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs text-slate-900 truncate">
                                {app.patient_name}
                              </span>
                              <StatusBadge
                                status={app.status}
                                size="sm"
                                showIcon={false}
                              />
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                              <span className="font-semibold text-slate-700">{app.time}</span>
                              <span>•</span>
                              <span
                                className={`font-semibold ${
                                  app.location_type === "domicilio"
                                    ? "text-purple-600"
                                    : "text-indigo-600"
                                }`}
                              >
                                {app.location_type === "domicilio"
                                  ? "🏠 Domicilio"
                                  : "🏥 Consultorio"}
                              </span>
                            </div>
                            {app.stimulus_applied && (
                              <p className="text-[10px] text-slate-600 truncate mt-0.5 font-medium">
                                ⚡ {app.stimulus_applied}
                              </p>
                            )}
                          </div>

                          {/* Action shortcuts */}
                          <div className="flex items-center justify-end gap-1 mt-1.5 pt-1.5 border-t border-slate-200/60">
                            <button
                              onClick={(e) => handleWhatsAppReminder(app, e)}
                              className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded text-[10px] font-semibold transition"
                              title="Enviar recordatorio WhatsApp"
                            >
                              WA
                            </button>
                            <button
                              onClick={(e) => handleGoogleCalendar(app, e)}
                              className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded text-[10px] font-semibold transition"
                              title="Sincronizar Google Calendar"
                            >
                              GCal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => setIsNewModalOpen(true)}
                          className="w-full h-full flex items-center justify-center rounded-xl hover:bg-indigo-50/50 text-transparent hover:text-indigo-600 cursor-pointer text-xs font-semibold transition"
                        >
                          + Agendar
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        /* VIEW MODE: PAGINATED LIST */
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Fecha & Hora</th>
                  <th className="py-3.5 px-4">Paciente</th>
                  <th className="py-3.5 px-4">Modalidad</th>
                  <th className="py-3.5 px-4">Servicio & Terapia</th>
                  <th className="py-3.5 px-4">Terapeuta</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Sincronización</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedAppointments.length > 0 ? (
                  paginatedAppointments.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      {/* Date & Time */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 text-xs">
                            {app.date}
                          </p>
                          <p className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {app.time} hrs
                          </p>
                        </div>
                      </td>

                      {/* Patient */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              app.patient_avatar ||
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                            }
                            alt={app.patient_name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-xs">
                              {app.patient_name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {app.patient_phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Modality */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            app.location_type === "domicilio"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {app.location_type === "domicilio" ? (
                            <>
                              <Home className="w-3 h-3 text-purple-600" /> A Domicilio
                            </>
                          ) : (
                            <>
                              <Building2 className="w-3 h-3 text-blue-600" /> Consultorio
                            </>
                          )}
                        </span>
                      </td>

                      {/* Service & Stimulus */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900 text-xs">
                          {app.specialty_name}
                        </p>
                        {app.stimulus_applied && (
                          <p className="text-[11px] text-indigo-600 font-medium">
                            ⚡ {app.stimulus_applied}
                          </p>
                        )}
                      </td>

                      {/* Professional */}
                      <td className="py-3.5 px-4">
                        <p className="text-slate-800 font-medium">{app.professional_name}</p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={app.status} size="sm" />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => handleWhatsAppReminder(app, e)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition"
                            title="Enviar recordatorio WhatsApp"
                          >
                            <Phone className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={(e) => handleGoogleCalendar(app, e)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition"
                            title="Sincronizar Google Calendar"
                          >
                            <CalendarIcon className="w-3 h-3" />
                            <span>GCal</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      No se encontraron citas con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAppointments.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setCurrentPage(1);
            }}
            pageSizeOptions={[5, 8, 15, 25]}
          />
        </div>
      )}

      {/* Appointment Drawer */}
      <AppointmentDrawer
        appointment={selectedApp}
        onClose={() => setSelectedApp(null)}
      />

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />
    </div>
  );
}
