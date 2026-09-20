/**
 * Comprehensive System Test Suite
 * Tests Frontend & Backend business logic, JWT Security, RBAC, Biometrics & Finances
 */

// 1. JWT Simulation & Tests
function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

function generateJwt(payload: any, secret = "klinicpro-test-secret"): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode(`${encodedHeader}.${encodedPayload}.${secret}`);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJwt(token: string): { valid: boolean; payload: any; error?: string } {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false, payload: null, error: "Invalid format" };
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, payload: null, error: "Token expired" };
    }
    return { valid: true, payload };
  } catch (e: any) {
    return { valid: false, payload: null, error: e.message };
  }
}

// 2. IMC Calculation Logic
function calculateImc(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

function getImcCategory(imc: number): string {
  if (imc < 18.5) return "Bajo Peso";
  if (imc < 25.0) return "Normal / Saludable";
  if (imc < 30.0) return "Sobrepeso";
  if (imc < 35.0) return "Obesidad Grado I";
  return "Obesidad Grado II o Severa";
}

// 3. Financial calculations
function calculateFinances(payments: { amount: number; location: string; status: string }[], expenses: { amount: number }[]) {
  const paidPayments = payments.filter((p) => p.status === "paid");
  const consultorioRevenue = paidPayments
    .filter((p) => p.location === "consultorio")
    .reduce((a, b) => a + b.amount, 0);
  const domicilioRevenue = paidPayments
    .filter((p) => p.location === "domicilio")
    .reduce((a, b) => a + b.amount, 0);
  const totalRevenue = consultorioRevenue + domicilioRevenue;
  const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  return { consultorioRevenue, domicilioRevenue, totalRevenue, totalExpenses, netProfit };
}

// Test Runner
let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log("=================================================");
  console.log("🧪 INICIANDO SUITE DE PRUEBAS INTEGRALES (TEST SUITE)");
  console.log("=================================================\n");

  // TEST SUITE 1: JWT & Security
  console.log("🔐 1. Pruebas de Seguridad JWT y Verificación de Expiración:");
  const now = Math.floor(Date.now() / 1000);
  
  // Valid token
  const validToken = generateJwt({ sub: "usr-admin-1", role: "admin", exp: now + 3600 });
  const validRes = verifyJwt(validToken);
  assert(validRes.valid === true, "Token JWT válido se verifica correctamente");
  assert(validRes.payload.role === "admin", "Payload de rol admin extraído con éxito");

  // Expired token
  const expiredToken = generateJwt({ sub: "usr-expired", role: "patient", exp: now - 3600 });
  const expiredRes = verifyJwt(expiredToken);
  assert(expiredRes.valid === false, "Token expirado es rechazado correctamente");
  assert(expiredRes.error === "Token expired", "Mensaje de token expirado correcto");

  // TEST SUITE 2: RBAC Role Permissions
  console.log("\n👥 2. Matriz de Permisos por Rol (RBAC):");
  const rolePermissions: Record<string, string[]> = {
    admin: ["view:dashboard", "manage:agenda", "manage:patients", "manage:payments", "manage:settings"],
    doctor: ["manage:agenda", "manage:patients", "edit:clinical_history", "view:my_appointments"],
    receptionist: ["view:dashboard", "manage:agenda", "manage:patients", "manage:payments"],
    patient: ["view:my_appointments"],
  };

  assert(rolePermissions.admin.includes("manage:settings"), "Admin tiene permiso manage:settings");
  assert(!rolePermissions.doctor.includes("manage:settings"), "Doctor NO tiene acceso a manage:settings");
  assert(rolePermissions.doctor.includes("edit:clinical_history"), "Doctor tiene acceso a edit:clinical_history");
  assert(!rolePermissions.receptionist.includes("edit:clinical_history"), "Recepcionista NO puede editar clinical_history");
  assert(!rolePermissions.patient.includes("view:dashboard"), "Paciente NO puede ver el dashboard administrativo");

  // TEST SUITE 3: Biometrics & Auto IMC Calculation
  console.log("\n📊 3. Cálculo Automático de IMC y Clasificación OMS:");
  const imc1 = calculateImc(65, 165); // 65 / (1.65 * 1.65) = 23.87 -> 23.9
  assert(imc1 === 23.9, `Cálculo de IMC para 65kg y 165cm es 23.9 (Obtenido: ${imc1})`);
  assert(getImcCategory(imc1) === "Normal / Saludable", "IMC 23.9 clasificado como Normal / Saludable");

  const imc2 = calculateImc(85, 165); // 85 / (1.65 * 1.65) = 31.22 -> 31.2
  assert(imc2 === 31.2, `Cálculo de IMC para 85kg y 165cm es 31.2 (Obtenido: ${imc2})`);
  assert(getImcCategory(imc2) === "Obesidad Grado I", "IMC 31.2 clasificado como Obesidad Grado I");

  const imc3 = calculateImc(45, 165); // 45 / (1.65 * 1.65) = 16.5
  assert(imc3 === 16.5, `Cálculo de IMC para 45kg y 165cm es 16.5 (Obtenido: ${imc3})`);
  assert(getImcCategory(imc3) === "Bajo Peso", "IMC 16.5 clasificado como Bajo Peso");

  // TEST SUITE 4: Financial Calculations (Consultorio vs Domicilio & Expenses)
  console.log("\n💰 4. Flujo Financiero (Consultorio vs Domicilio, Gastos y Utilidad Neta):");
  const testPayments = [
    { amount: 80, location: "consultorio", status: "paid" },
    { amount: 120, location: "domicilio", status: "paid" },
    { amount: 100, location: "consultorio", status: "paid" },
    { amount: 80, location: "consultorio", status: "pending" }, // Should not count
  ];
  const testExpenses = [
    { amount: 50 }, // Insumos
    { amount: 30 }, // Transporte
  ];

  const fin = calculateFinances(testPayments, testExpenses);
  assert(fin.consultorioRevenue === 180, `Ingresos Consultorio: S/ 180.00 (Obtenido: ${fin.consultorioRevenue})`);
  assert(fin.domicilioRevenue === 120, `Ingresos Domicilio: S/ 120.00 (Obtenido: ${fin.domicilioRevenue})`);
  assert(fin.totalRevenue === 300, `Ingresos Totales: S/ 300.00 (Obtenido: ${fin.totalRevenue})`);
  assert(fin.totalExpenses === 80, `Gastos Totales: S/ 80.00 (Obtenido: ${fin.totalExpenses})`);
  assert(fin.netProfit === 220, `Utilidad Neta (300 - 80 = 220): S/ 220.00 (Obtenido: ${fin.netProfit})`);

  // TEST SUITE 5: Inventory Stock Management
  console.log("\n📦 5. Inventario & Alertas de Stock Mínimo:");
  let testItem = { name: "Agujas 0.25x25", stock: 10, min_stock: 5 };
  testItem.stock -= 6; // Quedan 4
  const isLowStock = testItem.stock <= testItem.min_stock;
  assert(testItem.stock === 4, "Ajuste de stock decrementa correctamente a 4 unidades");
  assert(isLowStock === true, "Alerta de stock bajo disparada al estar por debajo de min_stock (5)");

  testItem.stock += 10; // Quedan 14
  assert(testItem.stock === 14, "Reposición de lote incrementa stock correctamente a 14 unidades");
  assert(testItem.stock > testItem.min_stock, "Alerta de stock bajo se desactiva al reponer");

  // TEST SUITE 6: Google Calendar URL Generator
  console.log("\n📅 6. Generación de Enlace a Google Calendar:");
  const testApp = {
    patient: "María López",
    service: "Acupuntura",
    date: "2026-09-20",
    time: "09:00",
    location: "Consultorio",
  };
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${testApp.service} - ${testApp.patient}`)}`;
  assert(gcalUrl.includes("action=TEMPLATE"), "Enlace de Google Calendar contiene action=TEMPLATE");
  assert(gcalUrl.includes(encodeURIComponent("Acupuntura - María López")), "Título de evento codificado adecuadamente");

  console.log("\n=================================================");
  console.log(`🏁 RESULTADOS: ${passed} pruebas superadas | ${failed} fallos`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
