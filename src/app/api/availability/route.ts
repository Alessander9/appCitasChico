import { getAvailability } from "@/lib/availability";
import { isDateStr } from "@/lib/time";
import { errorResponse, ok } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const date = new URL(req.url).searchParams.get("date") ?? "";
    if (!isDateStr(date)) return ok({ error: "Parámetro date inválido (YYYY-MM-DD)" }, 400);
    const data = await getAvailability(date);
    return ok(data);
  } catch (e) {
    return errorResponse(e);
  }
}
