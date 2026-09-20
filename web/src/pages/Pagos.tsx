import React, { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingDown,
  Building2,
  Home,
  Receipt,
  Trash2,
  Search,
  Calendar,
  Tag,
  FileText,
  Filter,
} from "lucide-react";
import { useClinic, type Expense } from "../context/ClinicContext";
import { StatsCard } from "../components/ui/StatsCard";
import { StatusBadge } from "../components/ui/StatusBadge";
import { SearchableSelect, type SearchableOption } from "../components/ui/SearchableSelect";
import { Pagination } from "../components/ui/Pagination";
import { CategoryBadge } from "../components/ui/CategoryBadge";

export default function Pagos() {
  const { payments, expenses, kpiStats, addExpense, deleteExpense } = useClinic();
  const [activeTab, setActiveTab] = useState<"ingresos" | "gastos">("ingresos");

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterExpCategory, setFilterExpCategory] = useState<string>("all");

  // Pagination states
  const [currentPayPage, setCurrentPayPage] = useState(1);
  const [payPageSize, setPayPageSize] = useState(8);

  const [currentExpPage, setCurrentExpPage] = useState(1);
  const [expPageSize, setExpPageSize] = useState(8);

  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);

  // New expense form
  const [expDescription, setExpDescription] = useState("");
  const [expCategory, setExpCategory] = useState<Expense["category"]>("Materiales e Insumos");
  const [expAmount, setExpAmount] = useState(50.0);
  const [expDate, setExpDate] = useState(new Date().toISOString().split("T")[0]);
  const [expReceipt, setExpReceipt] = useState("");

  // Category options for Expense (max 2 results)
  const expenseCategoryOptions: SearchableOption[] = [
    { value: "Materiales e Insumos", label: "Materiales e Insumos", icon: <Tag className="w-4 h-4" /> },
    { value: "Alquiler de Consultorio", label: "Alquiler de Consultorio", icon: <Building2 className="w-4 h-4" /> },
    { value: "Transporte Domiciliario", label: "Transporte Domiciliario", icon: <Home className="w-4 h-4" /> },
    { value: "Servicios & Software", label: "Servicios & Software", icon: <FileText className="w-4 h-4" /> },
    { value: "Publicidad", label: "Publicidad y Marketing", icon: <DollarSign className="w-4 h-4" /> },
    { value: "Otros", label: "Otros Gastos", icon: <Receipt className="w-4 h-4" /> },
  ];

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.patient_name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.method.toLowerCase().includes(search.toLowerCase());
      const matchesMethod = filterMethod === "all" || p.method === filterMethod;
      const matchesLoc =
        filterLocation === "all" ||
        (p.location_type || "consultorio") === filterLocation;

      return matchesSearch && matchesMethod && matchesLoc;
    });
  }, [payments, search, filterMethod, filterLocation]);

  // Paginated Payments
  const totalPayPages = Math.ceil(filteredPayments.length / payPageSize) || 1;
  const paginatedPayments = useMemo(() => {
    const start = (currentPayPage - 1) * payPageSize;
    return filteredPayments.slice(start, start + payPageSize);
  }, [filteredPayments, currentPayPage, payPageSize]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch =
        exp.description.toLowerCase().includes(search.toLowerCase()) ||
        (exp.receipt_number &&
          exp.receipt_number.toLowerCase().includes(search.toLowerCase())) ||
        exp.category.toLowerCase().includes(search.toLowerCase());
      const matchesCat =
        filterExpCategory === "all" || exp.category === filterExpCategory;

      return matchesSearch && matchesCat;
    });
  }, [expenses, search, filterExpCategory]);

  // Paginated Expenses
  const totalExpPages = Math.ceil(filteredExpenses.length / expPageSize) || 1;
  const paginatedExpenses = useMemo(() => {
    const start = (currentExpPage - 1) * expPageSize;
    return filteredExpenses.slice(start, start + expPageSize);
  }, [filteredExpenses, currentExpPage, expPageSize]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDescription || !expAmount) return;

    addExpense({
      description: expDescription,
      category: expCategory,
      amount: Number(expAmount),
      date: expDate,
      receipt_number: expReceipt || undefined,
    });

    setIsNewExpenseModalOpen(false);
    setExpDescription("");
    setExpAmount(50.0);
    setExpReceipt("");
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Administración</span>
            <span>/</span>
            <span className="text-indigo-600">Finanzas & Contabilidad</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Flujo de Caja, Pagos & Gastos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro de cobros por sesiones y modalidades, control de gastos fijos y balance financiero neto.
          </p>
        </div>

        <button
          onClick={() => setIsNewExpenseModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-indigo-500/20 transition shrink-0"
        >
          <Receipt className="w-4 h-4" />
          <span>+ Registrar Gasto</span>
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Ingresos Consultorio"
          value={`S/ ${kpiStats.consultorioRevenue.toFixed(2)}`}
          trend={{ value: "Sede física", isPositive: true }}
          comparisonText="cobrado en clínica"
          icon={<Building2 className="w-5 h-5" />}
          color="#0284c7"
        />
        <StatsCard
          title="Ingresos Domicilio"
          value={`S/ ${kpiStats.domicilioRevenue.toFixed(2)}`}
          trend={{ value: "A Domicilio", isPositive: true }}
          comparisonText="visitas domiciliarias"
          icon={<Home className="w-5 h-5" />}
          color="#8b5cf6"
        />
        <StatsCard
          title="Gastos Operativos"
          value={`S/ ${kpiStats.totalExpenses.toFixed(2)}`}
          trend={{ value: `${expenses.length} egresos`, isPositive: false }}
          comparisonText="materiales y alquiler"
          icon={<TrendingDown className="w-5 h-5" />}
          color="#ef4444"
        />
        <StatsCard
          title="Utilidad Neta del Mes"
          value={`S/ ${kpiStats.netProfit.toFixed(2)}`}
          trend={{
            value: kpiStats.netProfit >= 0 ? "Margen Positivo" : "Déficit",
            isPositive: kpiStats.netProfit >= 0,
          }}
          comparisonText="ingresos - gastos"
          icon={<DollarSign className="w-5 h-5" />}
          color="#10b981"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => {
            setActiveTab("ingresos");
            setSearch("");
          }}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === "ingresos"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Historial de Ingresos ({payments.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("gastos");
            setSearch("");
          }}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === "gastos"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Registro de Gastos ({expenses.length})</span>
        </button>
      </div>

      {/* TAB: INGRESOS */}
      {activeTab === "ingresos" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
              <Search className="w-4 h-4 text-indigo-500 shrink-0" />
              <input
                type="text"
                placeholder="Buscar por paciente, ID de pago o método..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPayPage(1);
                }}
                className="w-full bg-transparent border-none outline-none text-slate-900 text-xs placeholder:text-slate-400"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCurrentPayPage(1);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Location filter */}
              <select
                value={filterLocation}
                onChange={(e) => {
                  setFilterLocation(e.target.value);
                  setCurrentPayPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:bg-white focus:border-indigo-500 outline-none"
              >
                <option value="all">Todas las Modalidades</option>
                <option value="consultorio">🏥 En Consultorio</option>
                <option value="domicilio">🏠 A Domicilio</option>
              </select>

              {/* Payment method filter */}
              <select
                value={filterMethod}
                onChange={(e) => {
                  setFilterMethod(e.target.value);
                  setCurrentPayPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:bg-white focus:border-indigo-500 outline-none"
              >
                <option value="all">Todos los Métodos</option>
                <option value="Yape">Yape</option>
                <option value="Plin">Plin</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">ID / Fecha</th>
                    <th className="py-3.5 px-4">Paciente</th>
                    <th className="py-3.5 px-4">Modalidad</th>
                    <th className="py-3.5 px-4">Método de Pago</th>
                    <th className="py-3.5 px-4">Monto</th>
                    <th className="py-3.5 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedPayments.length > 0 ? (
                    paginatedPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <p className="font-mono font-bold text-slate-900 text-xs">
                            {p.id}
                          </p>
                          <p className="text-[11px] text-slate-400">{p.date}</p>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {p.patient_name}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              p.location_type === "domicilio"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {p.location_type === "domicilio" ? (
                              <>
                                <Home className="w-3 h-3 text-purple-600" /> A Domicilio
                              </>
                            ) : (
                              <>
                                <Building2 className="w-3 h-3 text-blue-600" /> Consultorio
                              </>
                            )}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700">
                            {p.method}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-extrabold text-emerald-600 text-sm">
                          S/ {p.amount.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4">
                          <StatusBadge status={p.status} size="sm" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        No se encontraron registros de cobros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPayPage}
              totalPages={totalPayPages}
              totalItems={filteredPayments.length}
              pageSize={payPageSize}
              onPageChange={(p) => setCurrentPayPage(p)}
              onPageSizeChange={(sz) => {
                setPayPageSize(sz);
                setCurrentPayPage(1);
              }}
              pageSizeOptions={[4, 8, 16, 32]}
            />
          </div>
        </div>
      )}

      {/* TAB: GASTOS */}
      {activeTab === "gastos" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
              <Search className="w-4 h-4 text-indigo-500 shrink-0" />
              <input
                type="text"
                placeholder="Buscar por descripción, factura o categoría..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentExpPage(1);
                }}
                className="w-full bg-transparent border-none outline-none text-slate-900 text-xs placeholder:text-slate-400"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCurrentExpPage(1);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold">
                <Filter className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-slate-500">Categoría:</span>
                <select
                  value={filterExpCategory}
                  onChange={(e) => {
                    setFilterExpCategory(e.target.value);
                    setCurrentExpPage(1);
                  }}
                  className="bg-transparent border-none outline-none text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  <option value="all">Todas ({expenses.length})</option>
                  <option value="Materiales e Insumos">Materiales e Insumos</option>
                  <option value="Alquiler de Consultorio">Alquiler de Consultorio</option>
                  <option value="Transporte Domiciliario">Transporte Domiciliario</option>
                  <option value="Servicios & Software">Servicios & Software</option>
                  <option value="Publicidad">Publicidad</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Fecha / Comprobante</th>
                    <th className="py-3.5 px-4">Descripción</th>
                    <th className="py-3.5 px-4">Categoría</th>
                    <th className="py-3.5 px-4">Monto Egreso</th>
                    <th className="py-3.5 px-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedExpenses.length > 0 ? (
                    paginatedExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 text-xs">{exp.date}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {exp.receipt_number || "Sin comprobante"}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {exp.description}
                        </td>

                        <td className="py-3.5 px-4">
                          <CategoryBadge category={exp.category} size="sm" />
                        </td>

                        <td className="py-3.5 px-4 font-extrabold text-red-600 text-sm">
                          - S/ {exp.amount.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => deleteExpense(exp.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                            title="Eliminar gasto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        No se encontraron registros de gastos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentExpPage}
              totalPages={totalExpPages}
              totalItems={filteredExpenses.length}
              pageSize={expPageSize}
              onPageChange={(p) => setCurrentExpPage(p)}
              onPageSizeChange={(sz) => {
                setExpPageSize(sz);
                setCurrentExpPage(1);
              }}
              pageSizeOptions={[4, 8, 16, 32]}
            />
          </div>
        </div>
      )}

      {/* Modal: Registrar Gasto (2 Columns with Icons & SearchableSelect) */}
      {isNewExpenseModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in-50"
          onClick={() => setIsNewExpenseModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Registrar Gasto del Negocio
                  </h3>
                  <p className="text-xs text-slate-500">Formulario en 2 columnas con iconos</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewExpenseModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Descripción del Gasto *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Compra de agujas de acupuntura, gasolina visitas..."
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  autoFocus
                />
              </div>

              {/* 2 Columns: Category with SearchableSelect & Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchableSelect
                  label="Categoría del Gasto *"
                  icon={<Tag className="w-3.5 h-3.5" />}
                  options={expenseCategoryOptions}
                  value={expCategory}
                  onChange={(val) => setExpCategory(val as Expense["category"])}
                  placeholder="Buscar categoría..."
                  maxResults={2}
                />

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Monto en Soles (S/) *</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* 2 Columns: Date & Receipt No */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Fecha del Egreso *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                    <span>N° Factura / Boleta</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: F001-00293"
                    value={expReceipt}
                    onChange={(e) => setExpReceipt(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewExpenseModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition"
                >
                  Registrar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
