import { z } from "zod";
import { asc, gte } from "drizzle-orm";
import { db } from "@/db";
import { blockedDates } from "@/db/schema";
import { getSession, requireAdmin } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/api";
import { isDateStr, todayInBiz } from "@/lib/time";

export async function GET() {
  try {
    const session = await getSession();
    // Solo admin ve todo el histórico; público ve desde hoy en adelante
    const from = session?.role === "admin" ? "0000-01-01" : todayInBiz();
    const rows = await db
      .select()
      .from(blockedDates)
      .where(gte(blockedDates.date, from))
      .orderBy(asc(blockedDates.date));
    return ok({ blockedDates: rows });
  } catch (e) {
    return errorResponse(e);
  }
}

const postSchema = z.object({
  date: z.string().refine(isDateStr, "Fecha inválida (YYYY-MM-DD)"),
  reason: z.string().trim().max(120).optional().default(""),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = postSchema.parse(await req.json());
    const [row] = await db
      .insert(blockedDates)
      .values({ date: body.date, reason: body.reason })
      .onConflictDoUpdate({
        target: blockedDates.date,
        set: { reason: body.reason },
      })
      .returning();
    return ok({ blockedDate: row }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}
