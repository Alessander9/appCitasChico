import { eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments, services, users } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/api";
import { cancelAppointment } from "@/lib/availability";
import { sendBookingCancellation } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

/** DELETE /api/appointments/:id — cancela la cita propia (admin puede forzar con ?force=1) */
export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await requireUser();
    const { id } = await params;
    const appointmentId = Number(id);
    if (!Number.isInteger(appointmentId)) return ok({ error: "ID inválido" }, 400);

    // Solo admin puede forzar la cancelación de citas ajenas
    const force = session.role === "admin" && new URL(req.url).searchParams.get("force") === "1";

    const cancelled = await cancelAppointment(appointmentId, {
      userId: session.userId,
      force,
    });

    // Email de cancelación al dueño de la cita (no bloquea si falla)
    const [row] = await db
      .select({
        email: users.email,
        name: users.name,
        serviceName: services.name,
        durationMin: services.durationMin,
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.userId, users.id))
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    if (row) {
      void sendBookingCancellation({
        to: row.email,
        name: row.name,
        serviceName: row.serviceName,
        date: cancelled.date,
        startMinute: cancelled.startMinute,
        endMinute: cancelled.startMinute + row.durationMin,
      }).catch((e) => console.error("[email] error:", e));
    }

    return ok({ appointment: cancelled });
  } catch (e) {
    return errorResponse(e);
  }
}
