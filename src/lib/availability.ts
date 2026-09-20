import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { appointments, schedule, blockedDates, services } from "@/db/schema";
import { isDateStr, isSlotPast, weekdayOf } from "./time";

export type Slot = { minute: number; label: string; available: boolean };

const STEP_MIN = 30;

/**
 * Disponibilidad = horario semanal del día, menos fecha bloqueada,
 * menos citas ya confirmadas, menos horarios pasados.
 */
export async function getAvailability(date: string): Promise<{
  date: string;
  blocked: boolean;
  reason?: string;
  slots: Slot[];
}> {
  if (!isDateStr(date)) throw new Error("Fecha inválida");

  const blocked = await db
    .select()
    .from(blockedDates)
    .where(eq(blockedDates.date, date))
    .limit(1);

  if (blocked.length > 0) {
    return { date, blocked: true, reason: blocked[0].reason, slots: [] };
  }

  const weekday = weekdayOf(date);
  const windows = await db
    .select()
    .from(schedule)
    .where(eq(schedule.weekday, weekday));

  if (windows.length === 0) {
    return { date, blocked: false, slots: [] };
  }

  const taken = await db
    .select({ startMinute: appointments.startMinute })
    .from(appointments)
    .where(and(eq(appointments.date, date), eq(appointments.status, "confirmed")));
  const takenSet = new Set(taken.map((t) => t.startMinute));

  const slots: Slot[] = [];
  const seen = new Set<number>();
  for (const w of windows) {
    for (let m = w.startMinute; m + STEP_MIN <= w.endMinute; m += STEP_MIN) {
      if (seen.has(m)) continue;
      seen.add(m);
      slots.push({
        minute: m,
        label: minutesLabel(m),
        available: !takenSet.has(m) && !isSlotPast(date, m),
      });
    }
  }
  slots.sort((a, b) => a.minute - b.minute);
  return { date, blocked: false, slots };
}

function minutesLabel(minute: number): string {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

/** Valida y reserva una cita; lanza Error con mensaje legible si no se puede. */
export async function bookAppointment(opts: {
  userId: number;
  serviceId: number;
  date: string;
  startMinute: number;
  notes?: string;
}) {
  const { userId, serviceId, date, startMinute } = opts;
  if (!isDateStr(date)) throw new Error("Fecha inválida");

  const [service] = await db
    .select()
    .from(services)
    .where(and(eq(services.id, serviceId), eq(services.active, true)))
    .limit(1);
  if (!service) throw new Error("Servicio no disponible");

  if (isSlotPast(date, startMinute)) throw new Error("No puedes reservar un horario pasado");

  const availability = await getAvailability(date);
  const slot = availability.slots.find((s) => s.minute === startMinute);
  if (availability.blocked) throw new Error("La fecha está bloqueada");
  if (!slot) throw new Error("El horario no pertenece al horario de atención");
  if (!slot.available) throw new Error("El horario ya no está disponible");

  const [created] = await db
    .insert(appointments)
    .values({
      userId,
      serviceId,
      date,
      startMinute,
      notes: opts.notes?.slice(0, 500) ?? "",
      status: "confirmed",
    })
    .returning();

  return { appointment: created, service };
}

export async function cancelAppointment(appointmentId: number, opts: { userId?: number; force?: boolean }) {
  const [apt] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, appointmentId))
    .limit(1);
  if (!apt) throw new Error("Cita no encontrada");
  if (!opts.force && opts.userId !== undefined && apt.userId !== opts.userId) {
    throw new Error("No puedes cancelar esta cita");
  }
  if (apt.status === "cancelled") return apt;

  const [updated] = await db
    .update(appointments)
    .set({ status: "cancelled" })
    .where(and(eq(appointments.id, appointmentId), ne(appointments.status, "cancelled")))
    .returning();
  return updated;
}
