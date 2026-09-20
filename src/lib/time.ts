/**
 * Utilidades de fecha/hora. Todo se maneja como valores locales del negocio:
 * fechas 'YYYY-MM-DD' y minutos desde medianoche. Sin dependencias extra:
 * usamos Intl para resolver la zona horaria del negocio.
 */
export const BUSINESS_TZ = process.env.BUSINESS_TZ || "America/Mexico_City";

const dateFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: BUSINESS_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: BUSINESS_TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Fecha de hoy en la zona del negocio: 'YYYY-MM-DD'. */
export function todayInBiz(): string {
  return dateFmt.format(new Date());
}

/** Hora actual en la zona del negocio en minutos desde medianoche. */
export function nowMinutesInBiz(): number {
  const [h, m] = timeFmt.format(new Date()).split(":").map(Number);
  return (h % 24) * 60 + m;
}

export function isDateStr(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/** True si la fecha del negocio ya pasó (comparando contra hoy en zona del negocio). */
export function isDatePast(date: string): boolean {
  return date < todayInBiz();
}

/** True si la fecha es hoy y la hora ya pasó. */
export function isSlotPast(date: string, startMinute: number): boolean {
  if (isDatePast(date)) return true;
  if (date !== todayInBiz()) return false;
  return startMinute <= nowMinutesInBiz();
}

/** Día de la semana (0=domingo..6=sábado) de una fecha 'YYYY-MM-DD'. */
export function weekdayOf(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

/** Suma días hasta llegar a cierto weekday (incluye hoy si ya coincide). */
export function nextDateWithWeekday(from: string, weekday: number): string {
  let d = from;
  for (let i = 0; i < 7; i++) {
    if (weekdayOf(d) === weekday) return d;
    d = addDays(d, 1);
  }
  return d;
}

/** 540 -> '9:00', 855 -> '14:15' */
export function minutesToLabel(minute: number): string {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

/** '9:00' -> 540. Devuelve null si es inválido. */
export function labelToMinutes(label: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(label.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

/** '2026-09-14' -> 'lun 14 sep 2026' (sin dependencias). */
export function formatDateEs(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${dias[dt.getUTCDay()]} ${d} ${meses[m - 1]} ${y}`;
}
