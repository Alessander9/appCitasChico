import { eq } from "drizzle-orm";
import { db } from "@/db";
import { blockedDates } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/api";
import { isDateStr } from "@/lib/time";

type Params = { params: Promise<{ date: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { date } = await params;
    if (!isDateStr(date)) return ok({ error: "Fecha inválida" }, 400);
    await db.delete(blockedDates).where(eq(blockedDates.date, date));
    return ok({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
