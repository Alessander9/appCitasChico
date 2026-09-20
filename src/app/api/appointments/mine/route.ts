import { and, asc, eq, gte, inArray } from "drizzle-orm";
import { db } from "@/db";
import { appointments, services } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/api";
import { todayInBiz } from "@/lib/time";

/** GET /api/appointments?scope=upcoming|past|all — las citas del usuario autenticado */
export async function GET(req: Request) {
  try {
    const session = await requireUser();
    const scope = new URL(req.url).searchParams.get("scope") ?? "upcoming";
    const today = todayInBiz();

    const conditions = [eq(appointments.userId, session.userId)];
    if (scope === "upcoming") {
      conditions.push(gte(appointments.date, today));
      conditions.push(eq(appointments.status, "confirmed"));
    } else if (scope === "past") {
      conditions.push(inArray(appointments.status, ["cancelled"]));
    }

    const rows = await db
      .select({
        id: appointments.id,
        date: appointments.date,
        startMinute: appointments.startMinute,
        status: appointments.status,
        notes: appointments.notes,
        serviceName: services.name,
        serviceDuration: services.durationMin,
        servicePrice: services.price,
      })
      .from(appointments)
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(and(...conditions))
      .orderBy(asc(appointments.date), asc(appointments.startMinute));

    return ok({ appointments: rows });
  } catch (e) {
    return errorResponse(e);
  }
}
