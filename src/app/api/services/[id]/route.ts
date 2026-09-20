import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  description: z.string().trim().max(300).optional(),
  durationMin: z.number().int().min(10).max(240).optional(),
  price: z.number().int().min(0).max(100_000_00).nullable().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = patchSchema.parse(await req.json());
    const [service] = await db
      .update(services)
      .set(body)
      .where(eq(services.id, Number(id)))
      .returning();
    if (!service) return ok({ error: "Servicio no encontrado" }, 404);
    return ok({ service });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    // Soft delete: conservamos historial de citas
    const [service] = await db
      .update(services)
      .set({ active: false })
      .where(eq(services.id, Number(id)))
      .returning();
    if (!service) return ok({ error: "Servicio no encontrado" }, 404);
    return ok({ service });
  } catch (e) {
    return errorResponse(e);
  }
}
