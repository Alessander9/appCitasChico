"use client";

import { useCallback, useEffect, useState } from "react";

type Appt = {
  id: number;
  date: string;
  startMinute: number;
  status: string;
  notes: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  serviceDuration: number;
  servicePrice: number | null;
};

type Service = {
  id: number;
  name: string;
  description: string;
  durationMin: number;
  price: number | null;
  active: boolean;
};

type Window = { weekday: number; startMinute: number; endMinute: number };
type BlockedDate = { date: string; reason: string };

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function m2label(m: number) {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
function label2m(label: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(label.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}
function fmtPrice(c: number | null) {
  if (c === null || c === undefined) return "—";
  return `$${(c / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
}
function formatDateEs(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${dias[wd]} ${d} ${meses[m - 1]} ${y}`;
}

type Tab = "citas" | "servicios" | "horario" | "bloqueos";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("citas");

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Panel de administración</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ["citas", "📅 Citas"],
            ["servicios", "🛠️ Servicios"],
            ["horario", "🕐 Horario"],
            ["bloqueos", "🚫 Bloqueos"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={tab === key ? "btn-primary" : "btn-ghost"}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "citas" && <CitasTab />}
        {tab === "servicios" && <ServiciosTab />}
        {tab === "horario" && <HorarioTab />}
        {tab === "bloqueos" && <BloqueosTab />}
      </div>
    </main>
  );
}

/* ---------------- Citas ---------------- */

function CitasTab() {
  const [filter, setFilter] = useState("upcoming");
  const [rows, setRows] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/appointments?filter=${filter}`);
    const d = await res.json();
    setRows(d.appointments ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function cancel(id: number) {
    if (!confirm("¿Cancelar esta cita? Se le notificará al cliente.")) return;
    const res = await fetch(`/api/appointments/${id}?force=1`, { method: "DELETE" });
    if (res.ok) load();
    else {
      const d = await res.json();
      alert(d.error ?? "No se pudo cancelar");
    }
  }

  return (
    <section>
      <div className="flex items-center gap-3">
        <select className="input max-w-48" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="upcoming">Próximas confirmadas</option>
          <option value="today">Hoy</option>
          <option value="past">Canceladas</option>
          <option value="all">Todas</option>
        </select>
        <button onClick={load} className="btn-ghost">
          ↻ Actualizar
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Cargando…</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">No hay citas para este filtro.</p>
      ) : (
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap">{formatDateEs(a.date)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{m2label(a.startMinute)}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{a.clientName}</div>
                    <div className="text-xs text-slate-400">{a.clientEmail}</div>
                  </td>
                  <td className="px-4 py-3">
                    {a.serviceName}
                    {a.notes && <div className="text-xs text-slate-400">📝 {a.notes}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        a.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {a.status === "confirmed" ? "confirmada" : "cancelada"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {a.status === "confirmed" && (
                      <button onClick={() => cancel(a.id)} className="btn-danger px-3 py-1 text-xs">
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* ---------------- Servicios ---------------- */

function ServiciosTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", durationMin: 30, price: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", durationMin: 30, price: "" });
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/services");
    const d = await res.json();
    setServices(d.services ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const priceNum = form.price === "" ? null : Math.round(Number(form.price) * 100);
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        durationMin: Number(form.durationMin),
        price: priceNum,
      }),
    });
    const d = await res.json();
    if (!res.ok) {
      setError(d.error ?? "No se pudo crear");
      return;
    }
    setForm({ name: "", description: "", durationMin: 30, price: "" });
    load();
  }

  function startEdit(s: Service) {
    setEditingId(s.id);
    setEditForm({
      name: s.name,
      description: s.description,
      durationMin: s.durationMin,
      price: s.price === null ? "" : String(s.price / 100),
    });
  }

  async function saveEdit(id: number) {
    const priceNum = editForm.price === "" ? null : Math.round(Number(editForm.price) * 100);
    const res = await fetch(`/api/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        description: editForm.description,
        durationMin: Number(editForm.durationMin),
        price: priceNum,
      }),
    });
    if (res.ok) {
      setEditingId(null);
      load();
    } else {
      const d = await res.json();
      alert(d.error ?? "No se pudo guardar");
    }
  }

  async function toggleActive(s: Service) {
    const res = await fetch(`/api/services/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    if (res.ok) load();
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        {loading ? (
          <p className="text-sm text-slate-500">Cargando…</p>
        ) : (
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={s.id} className="card p-4">
                {editingId === s.id ? (
                  <div className="space-y-2">
                    <input
                      className="input"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                    <input
                      className="input"
                      placeholder="Descripción"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <input
                        className="input"
                        type="number"
                        min={10}
                        value={editForm.durationMin}
                        onChange={(e) => setEditForm({ ...editForm, durationMin: Number(e.target.value) })}
                      />
                      <input
                        className="input"
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="Precio (opcional)"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(s.id)} className="btn-primary">
                        Guardar
                      </button>
                      <button onClick={() => setEditingId(null)} className="btn-ghost">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">
                        {s.name}{" "}
                        {!s.active && (
                          <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                            inactivo
                          </span>
                        )}
                      </p>
                      {s.description && <p className="text-sm text-slate-500">{s.description}</p>}
                      <p className="mt-1 text-xs text-slate-400">
                        {s.durationMin} min · {fmtPrice(s.price)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(s)} className="btn-ghost px-3 py-1 text-xs">
                        Editar
                      </button>
                      <button onClick={() => toggleActive(s)} className="btn-ghost px-3 py-1 text-xs">
                        {s.active ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={create} className="card h-fit space-y-3 p-4">
        <h2 className="font-semibold text-slate-900">Nuevo servicio</h2>
        <div>
          <label className="label">Nombre</label>
          <input
            className="input"
            required
            minLength={2}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Descripción</label>
          <input
            className="input"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Duración (min)</label>
          <input
            className="input"
            type="number"
            min={10}
            max={240}
            value={form.durationMin}
            onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="label">Precio (opcional)</label>
          <input
            className="input"
            type="number"
            min={0}
            step="0.01"
            placeholder="Ej. 350.00"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full">
          Crear servicio
        </button>
      </form>
    </section>
  );
}

/* ---------------- Horario semanal ---------------- */

function HorarioTab() {
  const [windows, setWindows] = useState<Window[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((d) => {
        setWindows(
          (d.schedule ?? []).map((w: { weekday: number; startMinute: number; endMinute: number }) => ({
            weekday: w.weekday,
            startMinute: w.startMinute,
            endMinute: w.endMinute,
          }))
        );
        setLoading(false);
      });
  }, []);

  function addWindow(weekday: number) {
    setWindows((ws) => [...ws, { weekday, startMinute: 9 * 60, endMinute: 18 * 60 }]);
  }

  function updateWindow(index: number, field: "startMinute" | "endMinute", value: string) {
    const m = label2m(value);
    if (m === null) return;
    setWindows((ws) => ws.map((w, i) => (i === index ? { ...w, [field]: m } : w)));
  }

  function removeWindow(index: number) {
    setWindows((ws) => ws.filter((_, i) => i !== index));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          windows: windows.map((w) => ({
            weekday: w.weekday,
            start: m2label(w.startMinute),
            end: m2label(w.endMinute),
          })),
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        setMsg(d.error ?? "Error al guardar");
        return;
      }
      setWindows(
        (d.schedule ?? []).map((w: { weekday: number; startMinute: number; endMinute: number }) => ({
          weekday: w.weekday,
          startMinute: w.startMinute,
          endMinute: w.endMinute,
        }))
      );
      setMsg("✅ Horario guardado");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Cargando…</p>;

  return (
    <section>
      <p className="text-sm text-slate-500">
        Define los rangos de atención por día. Los turnos se generan cada 30 minutos dentro de cada rango.
      </p>
      <div className="mt-4 space-y-3">
        {DAYS.map((day, weekday) => {
          const dayWindows = windows
            .map((w, i) => ({ ...w, i }))
            .filter((w) => w.weekday === weekday);
          return (
            <div key={weekday} className="card flex flex-wrap items-center gap-3 p-4">
              <span className="w-24 font-medium text-slate-800">{day}</span>
              {dayWindows.length === 0 && <span className="text-sm text-slate-400">Cerrado</span>}
              {dayWindows.map((w) => (
                <div key={w.i} className="flex items-center gap-1">
                  <input
                    type="time"
                    className="input w-32"
                    value={m2label(w.startMinute)}
                    onChange={(e) => updateWindow(w.i, "startMinute", e.target.value)}
                  />
                  <span className="text-slate-400">–</span>
                  <input
                    type="time"
                    className="input w-32"
                    value={m2label(w.endMinute)}
                    onChange={(e) => updateWindow(w.i, "endMinute", e.target.value)}
                  />
                  <button
                    onClick={() => removeWindow(w.i)}
                    className="ml-1 text-slate-400 hover:text-red-600"
                    title="Quitar"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={() => addWindow(weekday)} className="btn-ghost px-3 py-1 text-xs">
                + Agregar
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? "Guardando…" : "Guardar horario"}
        </button>
        {msg && <span className="text-sm text-slate-600">{msg}</span>}
      </div>
    </section>
  );
}

/* ---------------- Bloqueos ---------------- */

function BloqueosTab() {
  const [rows, setRows] = useState<BlockedDate[]>([]);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/blocked-dates");
    const d = await res.json();
    setRows(d.blockedDates ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    const res = await fetch("/api/blocked-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, reason }),
    });
    if (res.ok) {
      setDate("");
      setReason("");
      load();
    } else {
      const d = await res.json();
      alert(d.error ?? "No se pudo bloquear");
    }
  }

  async function remove(dateStr: string) {
    const res = await fetch(`/api/blocked-dates/${dateStr}`, { method: "DELETE" });
    if (res.ok) load();
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        {loading ? (
          <p className="text-sm text-slate-500">Cargando…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-slate-500">No hay fechas bloqueadas.</p>
        ) : (
          <ul className="space-y-2">
            {rows.map((b) => (
              <li key={b.date} className="card flex items-center justify-between p-3">
                <div>
                  <span className="font-medium text-slate-800">{formatDateEs(b.date)}</span>
                  {b.reason && <span className="ml-2 text-sm text-slate-400">{b.reason}</span>}
                </div>
                <button onClick={() => remove(b.date)} className="btn-ghost px-3 py-1 text-xs">
                  Desbloquear
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={add} className="card h-fit space-y-3 p-4">
        <h2 className="font-semibold text-slate-900">Bloquear fecha</h2>
        <p className="text-xs text-slate-400">
          Útil para feriados o vacaciones: nadie podrá reservar ese día.
        </p>
        <div>
          <label className="label">Fecha</label>
          <input
            className="input"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Motivo (opcional)</label>
          <input
            className="input"
            maxLength={120}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Bloquear
        </button>
      </form>
    </section>
  );
}
