import { z } from "zod";
import { requireUser, getUserById } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/api";
import { bookAppointment } from "@/lib/availability";
import { sendBookingConfirmation } from "@/lib/email";
import { isDateStr } from "@/lib/time";

const bodySchema = z.object({
  serviceId: z.number().int().positive(),
  date: z.string().refine(isDateStr, "Fecha inválida"),
  startMinute: z.number().int().min(0).max(24 * 60 - 1),
  notes: z.string().trim().max(500).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requireUser();
    const body = bodySchema.parse(await req.json());

    const { appointment, service } = await bookAppointment({
      userId: session.userId,
      serviceId: body.serviceId,
      date: body.date,
      startMinute: body.startMinute,
      notes: body.notes,
    });

    // Email de confirmación; no bloquea la respuesta si falla
    const user = await getUserById(session.userId);
    if (user) {
      void sendBookingConfirmation({
        to: user.email,
        name: user.name,
        serviceName: service.name,
        date: appointment.date,
        startMinute: appointment.startMinute,
        endMinute: appointment.startMinute + service.durationMin,
      }).catch((e) => console.error("[email] error:", e));
    }

    return ok({ appointment }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}
