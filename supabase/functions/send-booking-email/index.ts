// ============================================================================
// Edge Function: send-booking-email
// Envía confirmación/cancelación de cita vía Resend.
//
// Deploy:
//   supabase functions deploy send-booking-email --no-verify-jwt=false
//   supabase secrets set RESEND_API_KEY=re_xxx
//   supabase secrets set EMAIL_FROM="Citas <onboarding@resend.dev>"
//
// Invocación (desde el cliente, con sesión activa):
//   supabase.functions.invoke('send-booking-email', {
//     body: { kind: 'confirmation' | 'cancellation', to, name,
//             serviceName, date, startMinute, endMinute }
//   })
// ============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function label(minute: number): string {
  return `${Math.floor(minute / 60)}:${String(minute % 60).padStart(2, "0")}`;
}

function fechaEs(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${dias[wd]} ${d} ${meses[m - 1]} ${y}`;
}

function row(labelText: string, value: string) {
  return `<tr>
    <td style="padding:6px 12px;color:#6b7280;font-size:14px">${labelText}</td>
    <td style="padding:6px 12px;color:#111827;font-size:14px;font-weight:600">${value}</td>
  </tr>`;
}

function emailHtml(b: Record<string, unknown>, title: string, accent: string, note: string) {
  const hora = `${label(b.startMinute as number)}${b.endMinute ? ` - ${label(b.endMinute as number)}` : ""}`;
  return `<div style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
  <div style="background:${accent};color:#fff;padding:20px 24px">
    <h1 style="margin:0;font-size:18px">${title}</h1>
  </div>
  <div style="padding:24px">
    <p style="margin:0 0 16px;color:#374151">Hola ${b.name},</p>
    <p style="margin:0 0 16px;color:#374151">${note}</p>
    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px">
      ${row("Servicio", String(b.serviceName))}
      ${row("Fecha", fechaEs(String(b.date)))}
      ${row("Hora", hora)}
    </table>
  </div>
  <div style="padding:16px 24px;background:#f3f4f6;color:#9ca3af;font-size:12px">
    Este es un mensaje automático del sistema de citas.
  </div>
</div>`;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verifica al usuario que invoca la función (sesión obligatoria)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") ?? "" },
        },
      }
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return json({ error: "No autenticado" }, 401);

    const body = await req.json();
    const required = ["kind", "to", "name", "serviceName", "date", "startMinute"];
    for (const key of required) {
      if (body[key] === undefined) return json({ error: `Falta ${key}` }, 400);
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      // Sin API key la app sigue funcionando; solo se omite el email
      return json({ skipped: true, reason: "RESEND_API_KEY no configurada" });
    }

    const from = Deno.env.get("EMAIL_FROM") ?? "Citas <onboarding@resend.dev>";
    const isCancel = body.kind === "cancellation";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [body.to],
        subject: `${isCancel ? "Cita cancelada" : "Cita confirmada"}: ${body.serviceName}`,
        html: emailHtml(
          body,
          isCancel ? "Cita cancelada" : "✅ Cita confirmada",
          isCancel ? "#dc2626" : "#4f46e5",
          isCancel ? "Tu cita ha sido cancelada:" : "Tu cita ha quedado registrada con los siguientes datos:"
        ),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Resend error:", data);
      return json({ error: "No se pudo enviar el email", detail: data }, 502);
    }
    return json({ ok: true, data });
  } catch (e) {
    console.error(e);
    return json({ error: String(e) }, 400);
  }
});
