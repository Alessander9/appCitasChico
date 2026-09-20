import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Plus, 
  Search, 
  Clock, 
  DollarSign, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  Users, 
  Calendar,
  Layers
} from "lucide-react";
import { useClinic, type Specialty } from "../context/ClinicContext";
import { useToast } from "../context/ToastContext";

export default function Especialidades() {
  const { specialties, professionals, addSpecialty, updateSpecialty, deleteSpecialty } = useClinic();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMin, setDurationMin] = useState(45);
  const [price, setPrice] = useState(80);
  const [color, setColor] = useState("#4f46e5");

  const filteredSpecialties = specialties.filter((s) => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgPrice = specialties.length > 0 
    ? specialties.reduce((acc, curr) => acc + curr.price, 0) / specialties.length 
    : 0;

  const avgDuration = specialties.length > 0 
    ? Math.round(specialties.reduce((acc, curr) => acc + curr.duration_min, 0) / specialties.length) 
    : 0;

  const handleOpenCreateModal = () => {
    setEditingSpecialty(null);
    setName("");
    setDescription("");
    setDurationMin(45);
    setPrice(80);
    setColor("#4f46e5");
    setModalOpen(true);
  };

  const handleOpenEditModal = (spec: Specialty) => {
    setEditingSpecialty(spec);
    setName(spec.name);
    setDescription(spec.description);
    setDurationMin(spec.duration_min);
    setPrice(spec.price);
    setColor(spec.color || "#4f46e5");
    setModalOpen(true);
  };

  const handleDelete = (id: string, specName: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la especialidad "${specName}"?`)) {
      deleteSpecialty(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast("El nombre de la especialidad es obligatorio", "warning");
      return;
    }

    if (editingSpecialty) {
      updateSpecialty(editingSpecialty.id, {
        name,
        description,
        duration_min: Number(durationMin),
        price: Number(price),
        color,
      });
    } else {
      addSpecialty({
        name,
        description,
        duration_min: Number(durationMin),
        price: Number(price),
        color,
      });
    }

    setModalOpen(false);
  };

  const colorPalette = [
    "#4f46e5", // Indigo
    "#06b6d4", // Cyan
    "#10b981", // Emerald
    "#8b5cf6", // Purple
    "#f59e0b", // Amber
    "#ef4444", // Rose
    "#0284c7", // Sky
    "#ec4899", // Pink
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Executive Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: "0.8125rem", fontWeight: 600, marginBottom: 4 }}>
            <span>Centro Médico & Terapéutico</span>
            <span>/</span>
            <span>Gestión Clínica</span>
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
            Especialidades & Servicios Médicos
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", marginTop: 4 }}>
            Configura el catálogo de atención, tiempos de sesión, tarifas por consulta y profesionales autorizados.
          </p>
        </div>

        <button 
          onClick={handleOpenCreateModal}
          className="btn btn-primary"
          style={{ padding: "10px 18px", borderRadius: "12px", gap: "8px", fontWeight: 700 }}
        >
          <Plus size={16} />
          <span>Nueva Especialidad</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>Total Especialidades</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layers size={16} />
            </div>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>{specialties.length}</div>
          <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 600 }}>100% activas en portal</span>
        </div>

        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>Duración Promedio</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>{avgDuration} min</div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Por sesión clínica</span>
        </div>

        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>Tarifa Promedio</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>S/ {avgPrice.toFixed(2)}</div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Precio en Soles</span>
        </div>

        <div className="card" style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>Cuerpo Médico</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f3e8ff", color: "#9333ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>{professionals.length}</div>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Especialistas asignados</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ 
        background: "white", 
        borderRadius: "16px", 
        border: "1px solid var(--border-subtle)", 
        padding: "16px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ position: "relative", minWidth: "280px", flex: "1 1 280px", maxWidth: "420px" }}>
          <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "11px" }} />
          <input
            type="text"
            className="form-input"
            placeholder="Buscar especialidad o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", paddingLeft: "36px", height: "38px", fontSize: "13px", borderRadius: "10px" }}
          />
        </div>

        <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>
          Mostrando <strong>{filteredSpecialties.length}</strong> de {specialties.length} especialidades
        </div>
      </div>

      {/* Grid of Specialty Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {filteredSpecialties.map((spec) => {
          const assignedDoctors = professionals.filter((p) => p.specialties.includes(spec.name));
          const colorHex = spec.color || "#4f46e5";

          return (
            <div
              key={spec.id}
              className="card"
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                borderTop: `4px solid ${colorHex}`,
                transition: "all var(--transition-fast)"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ 
                      width: "40px", 
                      height: "40px", 
                      borderRadius: "12px", 
                      background: `${colorHex}18`, 
                      color: colorHex, 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center" 
                    }}>
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                        {spec.name}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--success)", fontWeight: 700, marginTop: "2px" }}>
                        <CheckCircle2 size={12} /> Activo en Web
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => handleOpenEditModal(spec)}
                      className="btn-icon"
                      title="Editar especialidad"
                      style={{ width: "30px", height: "30px" }}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(spec.id, spec.name)}
                      className="btn-icon"
                      title="Eliminar especialidad"
                      style={{ width: "30px", height: "30px", color: "var(--danger)" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, minHeight: "40px", marginBottom: "16px" }}>
                  {spec.description}
                </p>

                {/* Assigned Doctors */}
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    Especialistas Habilitados ({assignedDoctors.length})
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    {assignedDoctors.length === 0 ? (
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Sin doctores asignados</span>
                    ) : (
                      assignedDoctors.map((doc) => (
                        <div 
                          key={doc.id}
                          style={{ 
                            display: "inline-flex", 
                            alignItems: "center", 
                            gap: "6px", 
                            padding: "3px 8px", 
                            borderRadius: "999px", 
                            background: "var(--bg-app)", 
                            border: "1px solid var(--border-subtle)",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "var(--text-primary)"
                          }}
                        >
                          <img 
                            src={doc.avatar_url} 
                            alt={doc.name} 
                            style={{ width: "18px", height: "18px", borderRadius: "50%", objectFit: "cover" }} 
                          />
                          <span>{doc.name.split(" ")[0]} {doc.name.split(" ")[1] || ""}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Duration Footer */}
              <div style={{ 
                paddingTop: "14px", 
                borderTop: "1px solid var(--border-subtle)", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center" 
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--text-muted)" }}>
                    <Clock size={13} />
                    <span>{spec.duration_min} min / sesión</span>
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
                    S/ {spec.price.toFixed(2)}
                  </div>
                </div>

                <Link 
                  to="/admin/agenda" 
                  className="btn btn-secondary" 
                  style={{ fontSize: "12px", padding: "6px 12px", borderRadius: "8px", gap: "5px" }}
                >
                  <Calendar size={13} />
                  Ver Agenda
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setModalOpen(false)}
        >
          <div 
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "32px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>
                    {editingSpecialty ? "Editar Especialidad" : "Nueva Especialidad"}
                  </h3>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Catálogo y Tarifario Clínico</span>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="btn-icon" style={{ width: "32px", height: "32px" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px", display: "block" }}>
                  Nombre de la Especialidad / Terapia <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ej. Terapia Manual Ortopédica"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", fontSize: "14px" }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px", display: "block" }}>
                  Descripción del Tratamiento
                </label>
                <textarea
                  rows={3}
                  className="form-input"
                  placeholder="Breve explicación de las afecciones tratadas y beneficios para el paciente..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", fontSize: "13px", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px", display: "block" }}>
                    Duración (minutos)
                  </label>
                  <input
                    type="number"
                    min={15}
                    step={5}
                    required
                    className="form-input"
                    value={durationMin}
                    onChange={(e) => setDurationMin(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", fontSize: "14px" }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px", display: "block" }}>
                    Precio por Sesión (S/)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={5}
                    required
                    className="form-input"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px", display: "block" }}>
                  Color Identificador
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {colorPalette.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        backgroundColor: c,
                        border: color === c ? "3px solid #0f172a" : "2px solid transparent",
                        cursor: "pointer",
                        transform: color === c ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.15s ease"
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: "11px", borderRadius: "10px" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: "11px", borderRadius: "10px", fontWeight: 700 }}
                >
                  {editingSpecialty ? "Guardar Cambios" : "Crear Especialidad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
