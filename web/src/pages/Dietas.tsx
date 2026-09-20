import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  User,
  Trash2,
  Utensils,
  Flame,
  Tag,
  FileText,
  Filter,
  CheckCircle,
  Coffee,
  Sun,
  Moon,
  Clock,
  Apple,
} from "lucide-react";
import { useClinic, type DietPlan } from "../context/ClinicContext";
import { SearchableSelect, type SearchableOption } from "../components/ui/SearchableSelect";
import { Pagination } from "../components/ui/Pagination";
import { CategoryBadge } from "../components/ui/CategoryBadge";

export default function Dietas() {
  const { dietPlans, patients, addDietPlan, deleteDietPlan } = useClinic();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // New diet plan form state
  const [title, setTitle] = useState("");
  const [patientId, setPatientId] = useState("");
  const [category, setCategory] = useState<DietPlan["category"]>("Antiinflamatoria");
  const [calories, setCalories] = useState(1500);
  const [description, setDescription] = useState("");
  const [desayuno, setDesayuno] = useState("");
  const [mediaManana, setMediaManana] = useState("");
  const [almuerzo, setAlmuerzo] = useState("");
  const [merienda, setMerienda] = useState("");
  const [cena, setCena] = useState("");
  const [recommendationsText, setRecommendationsText] = useState(
    "Beber 2.2L de agua al día\nEvitar ultraprocesados y harinas refinadas\nCenar 2h antes de acostarse"
  );

  // Patient options for SearchableSelect (max 2 results)
  const patientOptions: SearchableOption[] = [
    {
      value: "",
      label: "Plantilla General (Sin asignar)",
      icon: <FileText className="w-4 h-4 text-slate-400" />,
    },
    ...patients.map((p) => ({
      value: p.id,
      label: p.name,
      sublabel: `DNI: ${p.dni} • ${p.phone}`,
      icon: <User className="w-4 h-4 text-emerald-400" />,
    })),
  ];

  // Category options for SearchableSelect (max 2 results)
  const categoryOptions: SearchableOption[] = [
    { value: "Antiinflamatoria", label: "Antiinflamatoria", icon: <Utensils className="w-4 h-4" /> },
    { value: "Pérdida de Grasa", label: "Pérdida de Grasa", icon: <Flame className="w-4 h-4" /> },
    { value: "Desintoxicante", label: "Desintoxicante", icon: <Apple className="w-4 h-4" /> },
    { value: "Mantenimiento", label: "Mantenimiento", icon: <CheckCircle className="w-4 h-4" /> },
    { value: "Personalizada", label: "Personalizada", icon: <Tag className="w-4 h-4" /> },
  ];

  const filteredDiets = useMemo(() => {
    return dietPlans.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        (d.patient_name &&
          d.patient_name.toLowerCase().includes(search.toLowerCase())) ||
        d.description.toLowerCase().includes(search.toLowerCase());
      const matchesCat =
        selectedCategory === "all" || d.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [dietPlans, search, selectedCategory]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredDiets.length / pageSize) || 1;
  const paginatedDiets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDiets.slice(start, start + pageSize);
  }, [filteredDiets, currentPage, pageSize]);

  const handleCreateDiet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const patientObj = patients.find((p) => p.id === patientId);
    const recs = recommendationsText
      .split("\n")
      .filter((r) => r.trim().length > 0);

    addDietPlan({
      title,
      patient_id: patientId || undefined,
      patient_name: patientObj ? patientObj.name : undefined,
      category,
      calories_target: Number(calories),
      description,
      meals: {
        desayuno,
        media_manana: mediaManana || undefined,
        almuerzo,
        merienda: merienda || undefined,
        cena,
      },
      recommendations: recs,
    });

    setIsNewModalOpen(false);
    // Reset form
    setTitle("");
    setPatientId("");
    setDescription("");
    setDesayuno("");
    setMediaManana("");
    setAlmuerzo("");
    setMerienda("");
    setCena("");
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span>Clínica</span>
            <span>/</span>
            <span className="text-indigo-600">Nutrición & Pautas</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Planes Nutricionales & Dietas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Elaboración y asignación de pautas nutricionales personalizadas vinculadas a las historias de tus pacientes.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-indigo-500/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nueva Pauta Nutricional</span>
        </button>
      </div>

      {/* Toolbar: Search & Category Filter */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input with live filter */}
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
          <Search className="w-4 h-4 text-indigo-500 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por título, paciente o alimentos..."
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

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold">
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-slate-500">Categoría:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none outline-none text-slate-800 text-xs font-semibold cursor-pointer"
            >
              <option value="all">Todas ({dietPlans.length})</option>
              <option value="Antiinflamatoria">Antiinflamatoria</option>
              <option value="Pérdida de Grasa">Pérdida de Grasa</option>
              <option value="Desintoxicante">Desintoxicante</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Personalizada">Personalizada</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            <span className="text-slate-900 font-bold">{filteredDiets.length}</span> planes
          </div>
        </div>
      </div>

      {/* Diets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedDiets.length > 0 ? (
          paginatedDiets.map((diet) => (
            <div
              key={diet.id}
              className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 flex flex-col justify-between gap-4 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <CategoryBadge category={diet.category} size="sm" />
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>{diet.calories_target} kcal</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  {diet.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {diet.description}
                </p>

                {diet.patient_name ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 p-2 bg-indigo-50 border border-indigo-100 rounded-xl mb-3">
                    <User className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                    <span className="truncate">Asignado: {diet.patient_name}</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic mb-3">
                    Plantilla general reutilizable
                  </div>
                )}

                {/* Meals Preview */}
                <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                  <div className="flex items-start gap-1.5">
                    <Coffee className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600">
                      <strong className="text-slate-800">Desayuno:</strong> {diet.meals.desayuno}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600">
                      <strong className="text-slate-800">Almuerzo:</strong> {diet.meals.almuerzo}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600">
                      <strong className="text-slate-800">Cena:</strong> {diet.meals.cena}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {diet.created_at}
                </span>
                <button
                  onClick={() => deleteDietPlan(diet.id)}
                  title="Eliminar pauta nutricional"
                  className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400">
            No se encontraron planes nutricionales con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredDiets.length}
        pageSize={pageSize}
        onPageChange={(p) => setCurrentPage(p)}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setCurrentPage(1);
        }}
        pageSizeOptions={[3, 6, 12, 24]}
      />

      {/* Modal: Crear Nueva Pauta Nutricional (2 Columns with Icons) */}
      {isNewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in-50"
          onClick={() => setIsNewModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Crear Pauta Nutricional / Dieta
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

            <form onSubmit={handleCreateDiet} className="space-y-4 mt-4">
              {/* Row 1: Title */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Título del Plan / Dieta *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Plan Antiinflamatorio y Reducción de Grasa"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                />
              </div>

              {/* Row 2: 2-Column Grid with SearchableSelect (max 2 results) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchableSelect
                  label="Asignar a Paciente"
                  icon={<User className="w-3.5 h-3.5" />}
                  options={patientOptions}
                  value={patientId}
                  onChange={(val) => setPatientId(val)}
                  placeholder="Buscar paciente (o plantilla general)..."
                  maxResults={2}
                />

                <SearchableSelect
                  label="Categoría Nutricional *"
                  icon={<Tag className="w-3.5 h-3.5" />}
                  options={categoryOptions}
                  value={category}
                  onChange={(val) => setCategory(val as DietPlan["category"])}
                  placeholder="Buscar categoría..."
                  maxResults={2}
                />
              </div>

              {/* Row 3: Calories & Goal (2 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Flame className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Calorías Objetivo Diarias (Kcal) *</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Objetivo Terapéutico</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Reducir inflamación articular..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Section: Meals in 2 Columns */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Comidas del Plan Nutricional</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Coffee className="w-3.5 h-3.5 text-amber-500" />
                      <span>Desayuno *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Tortilla de claras, avena y té verde..."
                      value={desayuno}
                      onChange={(e) => setDesayuno(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Apple className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Media Mañana</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Manzana y puñado de almendras..."
                      value={mediaManana}
                      onChange={(e) => setMediaManana(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Sun className="w-3.5 h-3.5 text-orange-500" />
                      <span>Almuerzo *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Salmón con quinoa y verduras al vapor..."
                      value={almuerzo}
                      onChange={(e) => setAlmuerzo(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Apple className="w-3.5 h-3.5 text-purple-600" />
                      <span>Merienda</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Yogur griego natural..."
                      value={merienda}
                      onChange={(e) => setMerienda(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Moon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Cena *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Crema de calabacín y pechuga de pollo a la plancha..."
                      value={cena}
                      onChange={(e) => setCena(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Recomendaciones Generales (Una por línea)</span>
                </label>
                <textarea
                  rows={3}
                  value={recommendationsText}
                  onChange={(e) => setRecommendationsText(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                />
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
                  Guardar Dieta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
