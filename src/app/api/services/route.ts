import { z } from "zod";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { services } from "@/db/schema";
import { getSession, requireAdmin } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/api";

export async function GET() {
  try {
    const session = await getSession();
    const rows = await db.select().from(services).orderBy(desc(services.active), services.name);
    const visible = session?.role === "admin" ? rows : rows.filter((s) => s.active);
    return ok({ services: visible });
  } catch (e) {
    return errorResponse(e);
  }
}

const createSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(300).optional().default(""),
  durationMin: z.number().int().min(10).max(240).optional().default(30),
  price: z.number().int().min(0).max(100_000_00).nullable().optional(),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = createSchema.parse(await req.json());
    const [service] = await db
      .insert(services)
      .values({
        name: body.name,
        description: body.description,
        durationMin: body.durationMin,
        price: body.price ?? null,
      })
      .returning();
    return ok({ service }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}
