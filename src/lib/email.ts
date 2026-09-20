import { Resend, type Resend as ResendType } from "resend";
import { minutesToLabel, formatDateEs } from "./time";

// Cliente lazy: `new Resend("")` lanza en build-time sin API key
let client: ResendType | null = null;
function getClient(): ResendType | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

type BookingEmail = {
  to: string;
  name: string;
  serviceName: string;
  date: string;
  startMinute: number;
  endMinute?: number;
};

function from(): string {
  return process.env.EMAIL_FROM || "Citas <onboarding@resend.dev>";
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 12px;color:#6b7280;font-size:14px">${label}</td>
    <td style="padding:6px 12px;color:#111827;font-size:14px;font-weight:600">${value}</td>
  </tr>`;
}

function emailHtml(b: BookingEmail, title: string, accent: string, note: string) {
  return `<div style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
  <div style="background:${accent};color:#fff;padding:20px 24px">
    <h1 style="margin:0;font-size:18px">${title}</h1>
  </div>
  <div style="padding:24px">
    <p style="margin:0 0 16px;color:#374151">Hola ${b.name},</p>
    <p style="margin:0 0 16px;color:#374151">${note}</p>
    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px">
      ${row("Servicio", b.serviceName)}
      ${row("Fecha", formatDateEs(b.date))}
      ${row("Hora", minutesToLabel(b.startMinute) + (b.endMinute ? ` - ${minutesToLabel(b.endMinute)}` : ""))}
    </table>
  </div>
  <div style="padding:16px 24px;background:#f3f4f6;color:#9ca3af;font-size:12px">
    Este es un mensaje automático del sistema de citas.
  </div>
</div>`;
}

/** Envía confirmación de reserva. No-op (con log) si no hay API key configurada. */
export async function sendBookingConfirmation(b: BookingEmail) {
  const resend = getClient();
  if (!resend) {
    console.log(`[email] RESEND_API_KEY ausente: se omite confirmación a ${b.to}`);
    return;
  }
  await resend.emails.send({
    from: from(),
    to: [b.to],
    subject: `Cita confirmada: ${b.serviceName}`,
    html: emailHtml(
      b,
      "✅ Cita confirmada",
      "#4f46e5",
      "Tu cita ha quedado registrada con los siguientes datos:"
    ),
  });
}

export async function sendBookingCancellation(b: BookingEmail) {
  const resend = getClient();
  if (!resend) {
    console.log(`[email] RESEND_API_KEY ausente: se omite cancelación a ${b.to}`);
    return;
  }
  await resend.emails.send({
    from: from(),
    to: [b.to],
    subject: `Cita cancelada: ${b.serviceName}`,
    html: emailHtml(
      b,
      "Cita cancelada",
      "#dc2626",
      "Tu cita ha sido cancelada:"
    ),
  });
}
