import React, { useState } from "react";
import { Save } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Configuracion() {
  const { toast } = useToast();
  const [clinicName, setClinicName] = useState("Centro Médico & Terapéutico Vida");
  const [phone, setPhone] = useState("+51 987 654 321");
  const [address, setAddress] = useState("Av. Javier Prado Este 2450, San Borja, Lima");
  const [timezone, setTimezone] = useState("America/Lima");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Configuración guardada exitosamente", "success");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: "0.8125rem", fontWeight: 600, marginBottom: 4 }}>
          <span>Administración</span>
          <span>/</span>
          <span>Ajustes</span>
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Configuración General del Centro</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Datos de la clínica, parámetros de reserva, horarios de apertura y feriados.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "720px" }}>
        {/* Clinic Profile Card */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: "1.0625rem", margin: 0 }}>Datos Institucionales</h3>

          <div className="form-group">
            <label className="form-label">Nombre del Centro Médico / Consultorio</label>
            <input
              type="text"
              className="form-input"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Teléfono de Atención / WhatsApp</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Zona Horaria</label>
              <select className="form-select" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option value="America/Lima">Lima (GMT-5)</option>
                <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                <option value="America/Bogota">Bogotá (GMT-5)</option>
                <option value="America/Santiago">Santiago (GMT-4)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dirección Física</label>
            <input
              type="text"
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Schedule & Rules */}
        <div className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: "1.0625rem", margin: 0 }}>Reglas de Reserva en Línea</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.875rem" }}>
              <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
              <span>Permitir a pacientes reservar citas desde la web pública</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.875rem" }}>
              <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
              <span>Enviar confirmación automática por correo electrónico al paciente</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.875rem" }}>
              <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
              <span>Requerir confirmación manual por parte de recepción</span>
            </label>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px" }}>
            <Save size={16} />
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
