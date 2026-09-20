"use client";

import { useCallback, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";

type Appt = {
  id: number;
  date: string;
  startMinute: number;
  status: string;
  notes: string;
  serviceName: string;
  serviceDuration: number;
  servicePrice: number | null;
};

function fmtPrice(centavos: number | null) {
  if (centavos === null || centavos === undefined) return null;
  return `$${(centavos / 100).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
}

function minutesToLabel(m: number) {
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
}

function formatDateEs(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${dias[wd]} ${d} ${meses[m - 1]} ${y}`;
}

/** Área del cliente: próximas citas + histórico, con cancelación. */
export default function MisCitasPage() {
  const [upcoming, setUpcoming] = useState<Appt[]>([]);
  const [past, setPast] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauth, setUnauth] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [uRes, pRes] = await Promise.all([
      fetch("/api/appointments/mine?scope=upcoming"),
      fetch("/api/appointments/mine?scope=past"),
    ]);
    if (uRes.status === 401) {
      setUnauth(true);
      setLoading(false);
      return;
    }
    const u = await uRes.json();
    const p = await pRes.json();
    setUpcoming(u.appointments ?? []);
    setPast(p.appointments ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function cancel(id: number) {
    if (!confirm("¿Cancelar esta cita?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      if (res.ok) await load();
      else {
        const d = await res.json();
        alert(d.error ?? "No se pudo cancelar");
      }
    } finally {
      setBusyId(null);
    }
  }

  if (unauth) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-16 text-center">
          <p className="text-slate-600">Inicia sesión para ver tus citas.</p>
          <a href="/login?next=/mis-citas" className="btn-primary mt-4">
            Iniciar sesión
          </a>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Mis citas</h1>

        {loading && <p className="mt-6 text-sm text-slate-500">Cargando…</p>}

        {!loading && (
          <>
            <section className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Próximas</h2>
              {upcoming.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  No tienes citas próximas. <a href="/reservar" className="text-indigo-600">Reserva una →</a>
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {upcoming.map((a) => (
                    <li key={a.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                      <div>
                        <p className="font-medium text-slate-900">{a.serviceName}</p>
                        <p className="text-sm text-slate-500">
                          {formatDateEs(a.date)} · {minutesToLabel(a.startMinute)} · {a.serviceDuration} min
                          {fmtPrice(a.servicePrice) && ` · ${fmtPrice(a.servicePrice)}`}
                        </p>
                        {a.notes && <p className="mt-1 text-xs text-slate-400">📝 {a.notes}</p>}
                      </div>
                      <button
                        onClick={() => cancel(a.id)}
                        disabled={busyId === a.id}
                        className="btn-danger"
                      >
                        {busyId === a.id ? "…" : "Cancelar"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {past.length > 0 && (
              <section className="mt-10">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Canceladas
                </h2>
                <ul className="mt-3 space-y-2">
                  {past.map((a) => (
                    <li key={a.id} className="card p-3 text-sm text-slate-400 line-through">
                      {a.serviceName} · {formatDateEs(a.date)} · {minutesToLabel(a.startMinute)}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}
