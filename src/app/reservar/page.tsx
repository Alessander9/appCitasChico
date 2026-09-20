"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";

type Service = {
  id: number;
  name: string;
  description: string;
  durationMin: number;
  price: number | null;
};

type Slot = { minute: number; label: string; available: boolean };

type Availability = { date: string; blocked: boolean; reason?: string; slots: Slot[] };

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function fmtPrice(centavos: number | null) {
  if (centavos === null || centavos === undefined) return null;
  return `$${(centavos / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
}

function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function fmtDay(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { wd: WEEKDAYS[wd], day: d, month: MONTHS[m - 1] };
}

/** Página pública de reserva: servicio -> fecha -> hora -> confirmar. */
export default function ReservarPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [slotMinute, setSlotMinute] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [me, setMe] = useState<{ id: number } | null>(null);
  const [msg, setMsg] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Carga inicial: servicios y sesión
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => {
        setServices(d.services ?? []);
        if (d.services?.length > 0) setServiceId(d.services[0].id);
      });
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMe(d.user));
    // Fecha por defecto: hoy local del navegador
    const now = new Date();
    setDate(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
    );
  }, []);

  // Disponibilidad al cambiar fecha
  useEffect(() => {
    if (!date) return;
    setSlotMinute(null);
    setAvailability(null);
    fetch(`/api/availability?date=${date}`)
      .then((r) => r.json())
      .then(setAvailability);
  }, [date]);

  const dates = useMemo(() => {
    if (!date) return [];
    return Array.from({ length: 14 }, (_, i) => addDays(date, i));
  }, [date]);

  async function submit() {
    if (!serviceId || !date || slotMinute === null) return;
    if (!me) {
      router.push("/login?next=/reservar");
      return;
    }
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, date, startMinute: slotMinute, notes: notes || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ kind: "error", text: data.error ?? "No se pudo reservar" });
      } else {
        setMsg({ kind: "success", text: "¡Cita confirmada! Revisa tu email." });
        router.push("/mis-citas");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const selectedService = services.find((s) => s.id === serviceId);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Reservar una cita</h1>
        <p className="mt-1 text-sm text-slate-500">Paso a paso: servicio, día y hora.</p>

        {/* 1. Servicio */}
        <section className="mt-6">
          <h2 className="label">1 · Elige tu servicio</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setServiceId(s.id)}
                className={`card p-4 text-left transition ${
                  serviceId === s.id ? "ring-2 ring-indigo-500" : "hover:border-indigo-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-slate-900">{s.name}</span>
                  {fmtPrice(s.price) && (
                    <span className="text-sm font-semibold text-indigo-600">{fmtPrice(s.price)}</span>
                  )}
                </div>
                {s.description && <p className="mt-1 text-sm text-slate-500">{s.description}</p>}
                <p className="mt-2 text-xs text-slate-400">{s.durationMin} min</p>
              </button>
            ))}
            {services.length === 0 && (
              <p className="text-sm text-slate-500">No hay servicios disponibles por ahora.</p>
            )}
          </div>
        </section>

        {/* 2. Fecha */}
        <section className="mt-8">
          <h2 className="label">2 · Elige el día</h2>
          <div className="card flex gap-2 overflow-x-auto p-3">
            {dates.map((d) => {
              const info = fmtDay(d);
              const selected = d === date;
              return (
                <button
                  key={d}
                  onClick={() => setDate(d)}
                  className={`flex min-w-16 flex-col items-center rounded-xl border px-3 py-2 transition ${
                    selected
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
                  }`}
                >
                  <span className="text-xs">{info.wd}</span>
                  <span className="text-lg font-semibold">{info.day}</span>
                  <span className="text-xs opacity-70">{info.month}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Hora */}
        <section className="mt-8">
          <h2 className="label">3 · Elige la hora</h2>
          {availability?.blocked ? (
            <p className="card p-4 text-sm text-slate-600">
              🚫 No hay atención este día{availability.reason ? `: ${availability.reason}` : ""}.
            </p>
          ) : availability && availability.slots.length === 0 ? (
            <p className="card p-4 text-sm text-slate-600">Este día no hay horarios de atención.</p>
          ) : (
            <div className="card flex flex-wrap gap-2 p-3">
              {availability?.slots.map((s) => (
                <button
                  key={s.minute}
                  disabled={!s.available}
                  onClick={() => setSlotMinute(s.minute)}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    slotMinute === s.minute
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : s.available
                        ? "border-slate-200 text-slate-700 hover:border-indigo-400"
                        : "cursor-not-allowed border-slate-100 text-slate-300 line-through"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 4. Confirmar */}
        <section className="mt-8">
          <h2 className="label">4 · Confirma</h2>
          <div className="card p-4">
            <textarea
              className="input"
              rows={2}
              placeholder="Notas opcionales para el negocio (ej. alergias, preferencias…)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                {selectedService ? selectedService.name : "—"} · {date || "—"}
                {slotMinute !== null && ` · ${availability?.slots.find((s) => s.minute === slotMinute)?.label}`}
              </p>
              <button
                onClick={submit}
                disabled={!serviceId || slotMinute === null || submitting}
                className="btn-primary"
              >
                {submitting ? "Reservando…" : me ? "Confirmar cita" : "Inicia sesión para confirmar"}
              </button>
            </div>
            {msg && (
              <p className={`mt-3 text-sm ${msg.kind === "error" ? "text-red-600" : "text-green-600"}`}>
                {msg.text}
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
