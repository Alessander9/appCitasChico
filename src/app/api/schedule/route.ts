import { z } from "zod";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { schedule } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/api";
import { labelToMinutes } from "@/lib/time";

export async function GET() {
  try {
    const rows = await db.select().from(schedule).orderBy(asc(schedule.weekday), asc(schedule.startMinute));
    return ok({ schedule: rows });
  } catch (e) {
    return errorResponse(e);
  }
}

const windowSchema = z.object({
  weekday: z.number().int().min(0).max(6),
  start: z.string(), // 'HH:MM'
  end: z.string(), // 'HH:MM'
});

const putSchema = z.object({
  windows: z.array(windowSchema).max(40),
});

/** Reemplaza el horario semanal completo. */
export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = putSchema.parse(await req.json());

    const values = body.windows.map((w) => {
      const startMinute = labelToMinutes(w.start);
      const endMinute = labelToMinutes(w.end);
      if (startMinute === null || endMinute === null || endMinute <= startMinute) {
        throw new Error(`Rango inválido: ${w.start} - ${w.end}`);
      }
      return { weekday: w.weekday, startMinute, endMinute };
    });

    await db.delete(schedule);
    if (values.length > 0) {
      await db.insert(schedule).values(values);
    }
    const rows = await db
      .select()
      .from(schedule)
      .orderBy(asc(schedule.weekday), asc(schedule.startMinute));
    return ok({ schedule: rows });
  } catch (e) {
    return errorResponse(e);
  }
}
