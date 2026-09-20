import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Evita que Next confunda el workspace por lockfiles sueltos en carpetas superiores
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
