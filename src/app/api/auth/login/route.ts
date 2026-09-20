import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, verifyPassword } from "@/lib/auth";
import { errorResponse, ok } from "@/lib/api";

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(1, "Escribe tu contraseña"),
});

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());

    const [user] = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return ok({ error: "Email o contraseña incorrectos" }, 401);
    }

    await createSession({ userId: user.id, role: user.role as "client" | "admin" });
    return ok({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) {
    return errorResponse(e);
  }
}
