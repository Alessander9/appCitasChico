import { defineConfig } from "drizzle-kit";
import { loadEnvFiles } from "./scripts/env";

loadEnvFiles();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
  },
});
