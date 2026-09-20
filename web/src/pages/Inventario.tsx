import React, { useState, useMemo } from "react";
import {
  Package,
  Plus,
  Minus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Tag,
  Boxes,
  DollarSign,
  Layers,
} from "lucide-react";
import { useClinic, type InventoryItem } from "../context/ClinicContext";
import { StatsCard } from "../components/ui/StatsCard";
import { SearchableSelect, type SearchableOption } from "../components/ui/SearchableSelect";
import { Pagination } from "../components/ui/Pagination";
import { CategoryBadge } from "../components/ui/CategoryBadge";

export default function Inventario() {
  const {
    inventory,
    adjustStock,
    addInventoryItem,
    deleteInventoryItem,
    kpiStats,
  } = useClinic();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // New item form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<InventoryItem["category"]>("Agujas");
  const [stock, setStock] = useState(20);
  const [minStock, setMinStock] = useState(5);
  const [unit, setUnit] = useState("unidades");
  const [priceCost, setPriceCost] = useState(25.0);

  // Category options for SearchableSelect (max 2 results)
  const categoryOptions: SearchableOption[] = [
    { value: "Agujas", label: "Agujas de Acupuntura", icon: <Package className="w-4 h-4" /> },
    { value: "Imanes", label: "Imanes Terapéuticos", icon: <Layers className="w-4 h-4" /> },
    { value: "Insumos", label: "Insumos Clínicos", icon: <Boxes className="w-4 h-4" /> },
    { value: "Aceites & Cremas", label: "Aceites & Cremas", icon: <Tag className="w-4 h-4" /> },
    { value: "Equipos", label: "Equipos y Aparatología", icon: <Package className="w-4 h-4" /> },
  ];

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCat =
        categoryFilter === "all" || item.category === categoryFilter;
      const isLow = item.stock <= item.min_stock;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "low" && isLow) ||
        (statusFilter === "normal" && !isLow);

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [inventory, search, categoryFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addInventoryItem({
      name,
      category,
      stock: Number(stock),
      min_stock: Number(minStock),
      unit,
      price_cost: Number(priceCost),
    });

    setIsNewModalOpen(false);
    setName("");
    setStock(20);
    setMinStock(5);
  };

  const totalStockUnits = inventory.reduce((acc, curr) => acc + curr.stock, 0);
  const totalValue = inventory.reduce(
    (acc, curr) => acc + curr.stock * curr.price_cost,
    0
  );

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Administración</span>
            <span>/</span>
            <span className="text-indigo-600">Control de Stock</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Inventario & Insumos Terapéuticos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión de existencias de agujas, imanes decorativos, imanes de plata, aceites y material de consulta.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-indigo-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuevo Insumo</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total de Insumos"
          value={totalStockUnits}
          trend={{ value: `${inventory.length} tipos`, isPositive: true }}
          comparisonText="en almacén"
          icon={<Boxes className="w-5 h-5" />}
          color="#0284c7"
        />
        <StatsCard
          title="Alertas de Stock Bajo"
          value={kpiStats.lowStockCount}
          trend={{
            value: kpiStats.lowStockCount > 0 ? "Reponer urgente" : "Óptimo",
            isPositive: kpiStats.lowStockCount === 0,
          }}
          comparisonText="por debajo del mínimo"
          icon={<AlertTriangle className="w-5 h-5" />}
          color={kpiStats.lowStockCount > 0 ? "#ef4444" : "#10b981"}
        />
        <StatsCard
          title="Valor Total en Stock"
          value={`S/ ${totalValue.toFixed(2)}`}
          trend={{ value: "Valorizado", isPositive: true }}
          comparisonText="al costo actual"
          icon={<Tag className="w-5 h-5" />}
          color="#8b5cf6"
        />
      </div>

      {/* Toolbar: Search, Filters */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
          <Search className="w-4 h-4 text-indigo-500 shrink-0" />
          <input
            type="text"
            placeholder="Buscar insumo (ej: agujas, imanes, aceites...)"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-transparent border-none outline-none text-slate-900 text-xs placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="text-xs text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:bg-white focus:border-indigo-500 outline-none"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Agujas">Agujas</option>
            <option value="Imanes">Imanes</option>
            <option value="Insumos">Insumos</option>
            <option value="Aceites & Cremas">Aceites & Cremas</option>
            <option value="Equipos">Equipos</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:bg-white focus:border-indigo-500 outline-none"
          >
            <option value="all">Todos los Estados</option>
            <option value="low">⚠️ Stock Bajo</option>
            <option value="normal">✅ Stock Normal</option>
          </select>

          <div className="text-xs text-slate-500 font-medium ml-1">
            <span className="text-slate-900 font-bold">{filteredItems.length}</span> insumos
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Producto / Insumo</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Stock Actual</th>
                <th className="py-3.5 px-4">Stock Mínimo</th>
                <th className="py-3.5 px-4">Ajuste Rápido</th>
                <th className="py-3.5 px-4">Costo Unit.</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => {
                  const isLow = item.stock <= item.min_stock;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isLow ? "bg-red-50/40" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 text-sm">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Actualizado: {item.last_updated}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <CategoryBadge category={item.category} size="sm" />
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-base font-extrabold ${
                            isLow ? "text-red-600" : "text-slate-900"
                          }`}
                        >
                          {item.stock}
                        </span>{" "}
                        <span className="text-[11px] text-slate-500 font-medium">{item.unit}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {item.min_stock} {item.unit}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => adjustStock(item.id, -1)}
                            className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Restar 1 unidad"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => adjustStock(item.id, 1)}
                            className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 transition"
                            title="Sumar 1 unidad"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              const addAmount = window.prompt(
                                `¿Cuántas unidades deseas agregar a ${item.name}?`,
                                "10"
                              );
                              if (addAmount && !isNaN(Number(addAmount))) {
                                adjustStock(item.id, Number(addAmount));
                              }
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition"
                          >
                            +Lote
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        S/ {item.price_cost.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                            <AlertTriangle className="w-3 h-3" /> Stock Bajo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Disponible
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => deleteInventoryItem(item.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Eliminar insumo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    No se encontraron insumos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredItems.length}
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setCurrentPage(1);
          }}
          pageSizeOptions={[4, 8, 16, 32]}
        />
      </div>

      {/* Modal: Registrar Nuevo Insumo (2 Columns with Icons & SearchableSelect) */}
      {isNewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in-50"
          onClick={() => setIsNewModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Registrar Nuevo Insumo al Stock
                  </h3>
                  <p className="text-xs text-slate-500">Formulario en 2 columnas con iconos</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Package className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Nombre del Insumo / Producto *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Imanes de plata 4000 Gauss, Agujas 0.25x25..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  autoFocus
                />
              </div>

              {/* 2 Columns: Category & Unit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchableSelect
                  label="Categoría *"
                  icon={<Tag className="w-3.5 h-3.5" />}
                  options={categoryOptions}
                  value={category}
                  onChange={(val) => setCategory(val as InventoryItem["category"])}
                  placeholder="Buscar categoría..."
                  maxResults={2}
                />

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Boxes className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Unidad de Medida *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="unidades, cajas, frascos"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* 2 Columns: Stock & Cost */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Boxes className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Stock Inicial *</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Stock Mínimo *</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Costo Unit. (S/) *</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    required
                    value={priceCost}
                    onChange={(e) => setPriceCost(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition"
                >
                  Guardar en Inventario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
