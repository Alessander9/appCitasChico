import { useCallback, useEffect, useState, useMemo } from "react";
import {
  adminAppointments,
  cancelAppointment,
  listServices,
  createService,
  updateService,
  listSchedule,
  replaceSchedule,
  listBlockedDates,
  blockDate,
  unblockDate,
  getSettings,
  updateSetting,
  type Appointment,
  type Service,
  type ScheduleWindow,
} from "../lib/api";
import { fmtPrice, formatDateEs, labelToMinutes, minutesToLabel } from "../lib/format";
import { uploadImage, optimizeUrl } from "../lib/cloudinary";
import { supabase } from "../lib/supabase";
import { Pagination } from "../components/ui/Pagination";
import { Search, Sparkles, Clock, DollarSign, FileText, Image, RefreshCw } from "lucide-react";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

type Tab = "citas" | "servicios" | "horario" | "bloqueos" | "apariencia";

function notifyEmail(kind: "cancellation", apt: Appointment) {
  supabase.functions
    .invoke("send-booking-email", {
      body: {
        kind,
        to: apt.profiles?.email,
        name: apt.profiles?.name,
        serviceName: apt.services?.name,
        date: apt.date,
        startMinute: apt.start_minute,
        endMinute: apt.start_minute + (apt.services?.duration_min ?? 30),
      },
    })
    .catch(() => undefined);
}

export default function Admin() {
  const [tab, setTab] = useState<Tab>("citas");

  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <h1 style={{ fontSize: 26, margin: 0 }}>Panel de administración</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
        {(
          [
            ["citas", "📅 Citas"],
            ["servicios", "🛠️ Servicios"],
            ["horario", "🕐 Horario"],
            ["bloqueos", "🚫 Bloqueos"],
            ["apariencia", "🎨 Apariencia"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            className={tab === key ? "btn btn-primary" : "btn btn-ghost"}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        {tab === "citas" && <CitasTab />}
        {tab === "servicios" && <ServiciosTab />}
        {tab === "horario" && <HorarioTab />}
        {tab === "bloqueos" && <BloqueosTab />}
        {tab === "apariencia" && <AparienciaTab />}
      </div>
    </main>
  );
}

/* ---------------- Citas ---------------- */

function CitasTab() {
  const [rows, setRows] = useState<Appointment[] | null>(null);
  const [filter, setFilter] = useState<"upcoming" | "cancelled" | "all">("upcoming");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setRows(await adminAppointments());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function cancel(apt: Appointment) {
    if (!confirm("¿Cancelar esta cita? Se notificará al cliente.")) return;
    setBusyId(apt.id);
    try {
      await cancelAppointment(apt.id);
      notifyEmail("cancellation", { ...apt, status: "cancelled" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cancelar");
    } finally {
      setBusyId(null);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const filtered = useMemo(() => {
    return (rows ?? []).filter((a) => {
      const matchFilter =
        filter === "all"
          ? true
          : filter === "cancelled"
          ? a.status === "cancelled"
          : a.status === "confirmed" && a.date >= today;

      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        (a.profiles?.name || "").toLowerCase().includes(q) ||
        (a.profiles?.email || "").toLowerCase().includes(q) ||
        (a.services?.name || "").toLowerCase().includes(q) ||
        a.date.includes(q);

      return matchFilter && matchSearch;
    });
  }, [rows, filter, search, today]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 max-w-sm bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white">
          <Search className="w-4 h-4 text-emerald-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por cliente, servicio o fecha..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="input"
            style={{ maxWidth: 220 }}
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as typeof filter);
              setCurrentPage(1);
            }}
          >
            <option value="upcoming">Próximas confirmadas</option>
            <option value="cancelled">Canceladas</option>
            <option value="all">Todas</option>
          </select>
          <button className="btn btn-ghost" onClick={load}>
            <RefreshCw className="w-3.5 h-3.5 inline mr-1" /> Actualizar
          </button>
        </div>
      </div>
      {error && <p className="error-text">{error}</p>}

      {rows === null ? (
        <p className="muted">Cargando…</p>
      ) : filtered.length === 0 ? (
        <p className="muted">No hay citas para este filtro.</p>
      ) : (
        <div className="card" style={{ marginTop: 16, overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((a) => (
                <tr key={a.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{formatDateEs(a.date)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{minutesToLabel(a.start_minute)}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{a.profiles?.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{a.profiles?.email}</div>
                  </td>
                  <td>
                    {a.services?.name}
                    {a.notes && <div style={{ fontSize: 12, color: "#94a3b8" }}>📝 {a.notes}</div>}
                  </td>
                  <td>
                    <span className={`badge ${a.status === "confirmed" ? "badge-green" : "badge-gray"}`}>
                      {a.status === "confirmed" ? "confirmada" : "cancelada"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {a.status === "confirmed" && (
                      <button className="btn btn-danger" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => cancel(a)} disabled={busyId === a.id}>
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setCurrentPage(1);
            }}
            pageSizeOptions={[4, 8, 16, 32]}
          />
        </div>
      )}
    </section>
  );
}

/* ---------------- Servicios ---------------- */

function ServiciosTab() {
  const [rows, setRows] = useState<Service[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", durationMin: 30, price: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", durationMin: 30, price: "" });
  const [uploadingFor, setUploadingFor] = useState<number | "new" | null>(null);
  const [progress, setProgress] = useState(0);

  const load = useCallback(async () => {
    try {
      setRows(await listServices({ includeInactive: true }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleImage(file: File, serviceId: number | "new") {
    setUploadingFor(serviceId);
    setProgress(0);
    setError(null);
    try {
      const { url } = await uploadImage(file, setProgress);
      if (serviceId === "new") {
        setForm((f) => ({ ...f, imageUrl: url } as typeof f & { imageUrl: string }));
        // guardamos en estado aparte vía dataset
        (window as any).__newServiceImage = url;
      } else {
        await updateService(serviceId, { image_url: url });
        await load();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir imagen");
    } finally {
      setUploadingFor(null);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createService({
        name: form.name,
        description: form.description,
        duration_min: Number(form.durationMin),
        price_cents: form.price === "" ? null : Math.round(Number(form.price) * 100),
        image_url: (window as any).__newServiceImage ?? null,
      });
      (window as any).__newServiceImage = null;
      setForm({ name: "", description: "", durationMin: 30, price: "" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo crear");
    }
  }

  async function saveEdit(id: number) {
    setError(null);
    try {
      await updateService(id, {
        name: editForm.name,
        description: editForm.description,
        duration_min: Number(editForm.durationMin),
        price_cents: editForm.price === "" ? null : Math.round(Number(editForm.price) * 100),
      });
      setEditingId(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar");
    }
  }

  async function toggleActive(s: Service) {
    await updateService(s.id, { active: !s.active });
    await load();
  }

  return (
    <section style={{ display: "grid", gap: 28, gridTemplateColumns: "1fr", alignItems: "start" }}>
      <div>
        {error && <p className="error-text">{error}</p>}
        {rows === null ? (
          <p className="muted">Cargando…</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {rows.map((s) => (
              <div key={s.id} className="card" style={{ padding: 16 }}>
                {editingId === s.id ? (
                  <div style={{ display: "grid", gap: 8 }}>
                    <input className="input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                    <input className="input" placeholder="Descripción" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <input className="input" type="number" min={10} value={editForm.durationMin} onChange={(e) => setEditForm({ ...editForm, durationMin: Number(e.target.value) })} />
                      <input className="input" type="number" min={0} step="0.01" placeholder="Precio" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-primary" onClick={() => saveEdit(s.id)}>Guardar</button>
                      <button className="btn btn-ghost" onClick={() => setEditingId(null)}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    {s.image_url && (
                      <img src={optimizeUrl(s.image_url, 160)} alt={s.name} style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover" }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <strong>
                        {s.name}{" "}
                        {!s.active && <span className="badge badge-gray">inactivo</span>}
                      </strong>
                      {s.description && <p className="muted" style={{ margin: "2px 0 0" }}>{s.description}</p>}
                      <p style={{ margin: "6px 0 0", fontSize: 12, color: "#94a3b8" }}>
                        {s.duration_min} min · {fmtPrice(s.price_cents) ?? "sin precio"}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <label className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>
                        {uploadingFor === s.id ? `${progress}%` : "📷 Foto"}
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleImage(f, s.id);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => { setEditingId(s.id); setEditForm({ name: s.name, description: s.description, durationMin: s.duration_min, price: s.price_cents == null ? "" : String(s.price_cents / 100) }); }}>
                        Editar
                      </button>
                      <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => toggleActive(s)}>
                        {s.active ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nuevo servicio */}
      <form onSubmit={create} className="card" style={{ padding: 20, display: "grid", gap: 14, maxWidth: 580 }}>
        <h2 style={{ margin: 0, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={18} color="var(--primary)" />
          <span>Nuevo Servicio / Tratamiento</span>
        </h2>

        <div>
          <label className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Image size={14} /> Foto o Imagen del Servicio (Cloudinary)
          </label>
          <label className="btn btn-ghost" style={{ cursor: "pointer", display: "inline-flex", gap: 6, alignItems: "center" }}>
            {uploadingFor === "new" ? `Subiendo… ${progress}%` : "📷 Subir imagen"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImage(f, "new");
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FileText size={14} /> Nombre del Servicio *
            </label>
            <input className="input" required minLength={2} placeholder="Ej: Acupuntura Clínica" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={14} /> Duración (minutos) *
            </label>
            <input className="input" type="number" min={10} max={240} value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
          <div>
            <label className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FileText size={14} /> Descripción del Servicio
            </label>
            <input className="input" placeholder="Descripción breve..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <DollarSign size={14} /> Precio en S/ (opcional)
            </label>
            <input className="input" type="number" min={0} step="0.01" placeholder="120.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ justifySelf: "end", marginTop: 4 }}>
          Crear servicio
        </button>
      </form>
    </section>
  );
}

/* ---------------- Horario ---------------- */

function HorarioTab() {
  const [windows, setWindows] = useState<ScheduleWindow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listSchedule()
      .then((w: ScheduleWindow[]) => {
        setWindows(w);
        setLoading(false);
      })
      .catch((e: any) => setError(e.message));
  }, []);

  function add(weekday: number) {
    setWindows((ws) => [...ws, { id: -Date.now(), weekday, start_minute: 540, end_minute: 1080 }]);
  }
  function update(index: number, field: "start_minute" | "end_minute", value: string) {
    const m = labelToMinutes(value);
    if (m === null) return;
    setWindows((ws) => ws.map((w, i) => (i === index ? { ...w, [field]: m } : w)));
  }
  function remove(index: number) {
    setWindows((ws) => ws.filter((_, i) => i !== index));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    setError(null);
    try {
      await replaceSchedule(windows.map(({ weekday, start_minute, end_minute }) => ({ weekday, start_minute, end_minute })));
      setWindows(await listSchedule());
      setMsg("✅ Horario guardado");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="muted">Cargando…</p>;

  return (
    <section style={{ display: "grid", gap: 10 }}>
      <p className="muted">Rangos de atención por día. Los turnos se generan cada 30 minutos.</p>
      {error && <p className="error-text">{error}</p>}
      {DAYS.map((day, weekday) => {
        const dayWindows = windows.map((w, i) => ({ ...w, i })).filter((w) => w.weekday === weekday);
        return (
          <div key={weekday} className="card" style={{ padding: 14, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <strong style={{ width: 96 }}>{day}</strong>
            {dayWindows.length === 0 && <span className="muted">Cerrado</span>}
            {dayWindows.map((w) => (
              <div key={w.i} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <input type="time" className="input" style={{ width: 110 }} value={minutesToLabel(w.start_minute)} onChange={(e) => update(w.i, "start_minute", e.target.value)} />
                <span className="muted">–</span>
                <input type="time" className="input" style={{ width: 110 }} value={minutesToLabel(w.end_minute)} onChange={(e) => update(w.i, "end_minute", e.target.value)} />
                <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => remove(w.i)} title="Quitar">✕</button>
              </div>
            ))}
            <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => add(weekday)}>+ Agregar</button>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? "Guardando…" : "Guardar horario"}
        </button>
        {msg && <span className="success-text">{msg}</span>}
      </div>
    </section>
  );
}

/* ---------------- Bloqueos ---------------- */

function BloqueosTab() {
  const [rows, setRows] = useState<{ date: string; reason: string }[]>([]);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setRows(await listBlockedDates());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    try {
      await blockDate(date, reason);
      setDate("");
      setReason("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo bloquear");
    }
  }

  async function remove(d: string) {
    await unblockDate(d);
    await load();
  }

  return (
    <section style={{ display: "grid", gap: 24, gridTemplateColumns: "1fr", alignItems: "start" }}>
      <div style={{ display: "grid", gap: 8 }}>
        {error && <p className="error-text">{error}</p>}
        {rows.length === 0 ? (
          <p className="muted">No hay fechas bloqueadas.</p>
        ) : (
          rows.map((b) => (
            <div key={b.date} className="card" style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>
                <strong>{formatDateEs(b.date)}</strong>
                {b.reason && <span className="muted" style={{ marginLeft: 8 }}>{b.reason}</span>}
              </span>
              <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => remove(b.date)}>
                Desbloquear
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={add} className="card" style={{ padding: 16, display: "grid", gap: 10, maxWidth: 360 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Bloquear fecha</h2>
        <p className="muted" style={{ margin: 0 }}>Feriados, vacaciones… nadie podrá reservar ese día.</p>
        <div>
          <label className="label">Fecha</label>
          <input className="input" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="label">Motivo (opcional)</label>
          <input className="input" maxLength={120} value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Bloquear</button>
      </form>
    </section>
  );
}

/* ---------------- Apariencia ---------------- */

function AparienciaTab() {
  const [branding, setBranding] = useState<{ logo_url?: string | null; hero_url?: string | null }>({});
  const [tz, setTz] = useState("America/Mexico_City");
  const [uploading, setUploading] = useState<"logo" | "hero" | null>(null);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSettings()
      .then((s: any) => {
        setBranding(s.branding ?? {});
        if (s.business?.tz) setTz(s.business.tz);
      })
      .catch((e: any) => setError(e.message));
  }, []);

  async function handleUpload(kind: "logo" | "hero", file: File) {
    setUploading(kind);
    setProgress(0);
    setError(null);
    try {
      const { url } = await uploadImage(file, setProgress);
      const next = { ...branding, [`${kind}_url`]: url };
      await updateSetting("branding", next);
      setBranding(next);
      setMsg(kind === "logo" ? "Logo actualizado" : "Imagen de portada actualizada");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setUploading(null);
    }
  }

  async function saveTz() {
    setError(null);
    try {
      await updateSetting("business", { tz });
      setMsg("Zona horaria guardada");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    }
  }

  return (
    <section style={{ display: "grid", gap: 16, maxWidth: 560 }}>
      {msg && <p className="success-text">{msg}</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="card" style={{ padding: 20, display: "grid", gap: 14 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Logo</h2>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {branding.logo_url && <img src={optimizeUrl(branding.logo_url, 128)} alt="logo" style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover" }} />}
          <label className="btn btn-ghost" style={{ cursor: "pointer" }}>
            {uploading === "logo" ? `Subiendo… ${progress}%` : "📷 Subir logo"}
            <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload("logo", f); e.target.value = ""; }} />
          </label>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #f1f5f9" }} />

        <h2 style={{ margin: 0, fontSize: 16 }}>Imagen de portada (hero)</h2>
        {branding.hero_url && <img src={optimizeUrl(branding.hero_url, 640)} alt="hero" style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 10 }} />}
        <label className="btn btn-ghost" style={{ cursor: "pointer", justifySelf: "start" }}>
          {uploading === "hero" ? `Subiendo… ${progress}%` : "📷 Subir portada"}
          <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload("hero", f); e.target.value = ""; }} />
        </label>
      </div>

      <div className="card" style={{ padding: 20, display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Zona horaria del negocio</h2>
        <p className="muted" style={{ margin: 0 }}>
          Define qué cuenta como "hoy" y "hora pasada" para la disponibilidad.
        </p>
        <input className="input" value={tz} onChange={(e) => setTz(e.target.value)} placeholder="America/Mexico_City" />
        <button className="btn btn-primary" style={{ justifySelf: "start" }} onClick={saveTz}>
          Guardar zona horaria
        </button>
      </div>
    </section>
  );
}
