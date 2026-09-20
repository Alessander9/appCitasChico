import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("client"), // 'client' | 'admin'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  durationMin: integer("duration_min").notNull().default(30),
  price: integer("price"), // en centavos (opcional)
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Horario semanal: 0=domingo .. 6=sábado
export const schedule = pgTable(
  "schedule",
  {
    id: serial("id").primaryKey(),
    weekday: integer("weekday").notNull(),
    startMinute: integer("start_minute").notNull(),
    endMinute: integer("end_minute").notNull(),
  },
  (t) => [uniqueIndex("schedule_weekday_start_unique").on(t.weekday, t.startMinute)]
);

// Fechas bloqueadas (días feriados, vacaciones, etc.)
export const blockedDates = pgTable("blocked_dates", {
  date: text("date").primaryKey(), // 'YYYY-MM-DD'
  reason: text("reason").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const appointments = pgTable(
  "appointments",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "restrict" }),
    date: text("date").notNull(), // 'YYYY-MM-DD' en zona del negocio
    startMinute: integer("start_minute").notNull(), // minutos desde medianoche
    status: text("status").notNull().default("confirmed"), // 'confirmed' | 'cancelled'
    notes: text("notes").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    // Evita doble reserva del mismo horario (solo cuenta las confirmadas)
    uniqueIndex("appointments_slot_unique")
      .on(t.date, t.startMinute)
      .where(sql`status = 'confirmed'`),
    index("appointments_user_idx").on(t.userId),
    index("appointments_date_idx").on(t.date),
  ]
);

export type User = typeof users.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type ScheduleBlock = typeof schedule.$inferSelect;
export type BlockedDate = typeof blockedDates.$inferSelect;
