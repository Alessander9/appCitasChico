import { and, asc, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { appointments, services, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/api";
import { todayInBiz } from "@/lib/time";

/**
 * GET /api/admin/appointments?filter=upcoming|today|past|all
 * Lista todas las citas con datos del cliente y servicio (solo admin).
 */
export async function GET(req: Request) {
  try {
    await requireAdmin();
    const filter = new URL(req.url).searchParams.get("filter") ?? "upcoming";
    const today = todayInBiz();

    const conditions = [];
    if (filter === "upcoming") {
      conditions.push(gte(appointments.date, today));
      conditions.push(eq(appointments.status, "confirmed"));
    } else if (filter === "today") {
      conditions.push(eq(appointments.date, today));
    } else if (filter === "past") {
      conditions.push(eq(appointments.status, "cancelled"));
    }

    const rows = await db
      .select({
        id: appointments.id,
        date: appointments.date,
        startMinute: appointments.startMinute,
        status: appointments.status,
        notes: appointments.notes,
        createdAt: appointments.createdAt,
        clientName: users.name,
        clientEmail: users.email,
        serviceName: services.name,
        serviceDuration: services.durationMin,
        servicePrice: services.price,
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.userId, users.id))
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(appointments.date), asc(appointments.startMinute));

    return ok({ appointments: rows });
  } catch (e) {
    return errorResponse(e);
  }
}
