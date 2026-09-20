/**
 * Seed idempotente: admin + cliente demo + servicios + horario semanal.
 * Uso: npm run db:seed
 */
import { loadEnvFiles } from "./env";

loadEnvFiles();

async function main() {
  // Import dinámico para que el check de DATABASE_URL ocurra tras cargar el .env
  const { db } = await import("../src/db");
  const { users, services, schedule } = await import("../src/db/schema");
  const bcrypt = await import("bcryptjs");
  const { eq } = await import("drizzle-orm");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@demo.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const clientEmail = "cliente@demo.com";
  const clientPassword = "cliente123";

  // Admin
  const [existingAdmin] = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
  if (!existingAdmin) {
    await db.insert(users).values({
      email: adminEmail,
      name: "Administrador",
      passwordHash: bcrypt.hashSync(adminPassword, 10),
      role: "admin",
    });
    console.log(`✅ Admin creado: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`ℹ️  Admin ya existía: ${adminEmail}`);
  }

  // Cliente demo
  const [existingClient] = await db.select().from(users).where(eq(users.email, clientEmail)).limit(1);
  if (!existingClient) {
    await db.insert(users).values({
      email: clientEmail,
      name: "Cliente Demo",
      passwordHash: bcrypt.hashSync(clientPassword, 10),
      role: "client",
    });
    console.log(`✅ Cliente demo creado: ${clientEmail} / ${clientPassword}`);
  } else {
    console.log(`ℹ️  Cliente demo ya existía: ${clientEmail}`);
  }

  // Servicios demo
  const existingServices = await db.select().from(services);
  if (existingServices.length === 0) {
    await db.insert(services).values([
      { name: "Consulta general", description: "Sesión estándar de 30 minutos", durationMin: 30, price: 30000 },
      { name: "Consulta extendida", description: "Sesión de 1 hora a fondo", durationMin: 60, price: 50000 },
      { name: "Valoración inicial", description: "Primera visita, diagnóstico y plan", durationMin: 45, price: null },
    ]);
    console.log("✅ Servicios demo creados");
  } else {
    console.log("ℹ️  Servicios ya existían");
  }

  // Horario semanal demo: L-V 9:00-14:00 y 15:00-18:00, Sáb 9:00-13:00
  const existingSchedule = await db.select().from(schedule);
  if (existingSchedule.length === 0) {
    const values = [];
    for (const weekday of [1, 2, 3, 4, 5]) {
      values.push({ weekday, startMinute: 9 * 60, endMinute: 14 * 60 });
      values.push({ weekday, startMinute: 15 * 60, endMinute: 18 * 60 });
    }
    values.push({ weekday: 6, startMinute: 9 * 60, endMinute: 13 * 60 });
    await db.insert(schedule).values(values);
    console.log("✅ Horario semanal demo creado (L-V 9-14 y 15-18, Sáb 9-13)");
  } else {
    console.log("ℹ️  Horario ya existía");
  }

  console.log("🌱 Seed completado");
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Seed falló:", e);
  process.exit(1);
});
