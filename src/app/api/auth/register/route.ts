import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, hashPassword } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/api";

const bodySchema = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto").max(80),
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(100),
});

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, body.email))
      .limit(1);
    if (existing) return ok({ error: "Ese email ya está registrado" }, 409);

    const [user] = await db
      .insert(users)
      .values({
        email: body.email,
        name: body.name,
        passwordHash: await hashPassword(body.password),
        role: "client",
      })
      .returning({ id: users.id, email: users.email, name: users.name, role: users.role });

    await createSession({ userId: user.id, role: "client" });
    return ok({ user }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}
