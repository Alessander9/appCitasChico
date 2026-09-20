import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Save, ChevronLeft } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Perfil() {
  const { toast } = useToast();
  const [name, setName] = useState("Dra. Alexandra Mendoza");
  const [email] = useState("alexandra.mendoza@clinica.com");
  const [phone, setPhone] = useState("+51 987 654 321");
  const [role] = useState("Administradora de Clínica");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Perfil de usuario actualizado exitosamente", "success");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-app)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          height: "64px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--text-primary)" }}>
          <div style={{ width: 34, height: 34, borderRadius: "10px", backgroundColor: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.125rem" }}>
            +
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em" }}>Klinic Pro</div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontWeight: 600 }}>PERFIL DE USUARIO</div>
          </div>
        </Link>

        <Link to="/admin" className="btn btn-secondary" style={{ fontSize: "0.8125rem" }}>
          <ChevronLeft size={16} />
          Volver al Panel
        </Link>
      </header>

      {/* Main Profile */}
      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px 80px", width: "100%" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 4 }}>Mi Perfil de Usuario</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: 24 }}>
          Administra tus datos personales y credenciales de acceso.
        </p>

        <div className="card" style={{ padding: "32px 28px" }}>
          {/* Avatar and Info */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Avatar"
              style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover" }}
            />
            <div>
              <h3 style={{ fontSize: "1.125rem", margin: 0 }}>{name}</h3>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: "var(--primary)", backgroundColor: "var(--primary-light)", padding: "2px 8px", borderRadius: "999px", marginTop: 6, fontWeight: 700 }}>
                <Shield size={12} />
                {role}
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Correo Electrónico (Solo lectura)</label>
              <input
                type="email"
                disabled
                className="form-input"
                style={{ backgroundColor: "#f8fafc", color: "var(--text-muted)", cursor: "not-allowed" }}
                value={email}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono de Contacto</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px" }}>
                <Save size={16} />
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
