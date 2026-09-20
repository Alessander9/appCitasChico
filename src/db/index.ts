import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

/**
 * Cliente lazy: el módulo se puede importar en build-time sin DATABASE_URL
 * (p.ej. al recolectar datos de páginas); solo lanza si realmente se consulta.
 */
let realDb: NeonHttpDatabase | null = null;

function getDb(): NeonHttpDatabase {
  if (!realDb) {
    // Vercel Postgres inyecta DATABASE_URL (y también POSTGRES_URL); aceptamos ambas
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) throw new Error("DATABASE_URL no está configurada");
    realDb = drizzle({ client: neon(url) });
  }
  return realDb;
}

export const db = new Proxy({} as NeonHttpDatabase, {
  get(_target, prop) {
    const instance = getDb() as unknown as Record<string | symbol, unknown>;
    const value = instance[prop];
    return typeof value === "function" ? (value as Function).bind(instance) : value;
  },
});

export * as schema from "./schema";
