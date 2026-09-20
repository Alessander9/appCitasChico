import { getSession, getUserById } from "@/lib/auth";
import { ok } from "@/lib/api";

export async function GET() {
  const session = await getSession();
  if (!session) return ok({ user: null });
  const user = await getUserById(session.userId);
  return ok({ user });
}
