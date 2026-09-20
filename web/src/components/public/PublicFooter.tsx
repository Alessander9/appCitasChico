import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";

export function PublicFooter() {
  return (
    <footer style={{ backgroundColor: "#0f172a", color: "#f8fafc", borderTop: "1px solid #1e293b", paddingTop: "64px", paddingBottom: "32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Main 4-Column Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, marginBottom: 56 }}>
          {/* Col 1: Brand & Mission */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "10px", backgroundColor: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.25rem" }}>
                +
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.125rem", color: "#ffffff", letterSpacing: "-0.02em" }}>
                Klinic Pro
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.6 }}>
              Centro médico y terapéutico integral. Brindamos atención de salud de excelencia con especialistas certificados y tecnología de vanguardia.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.75rem", color: "#cbd5e1" }}>
              <ShieldCheck size={16} color="#10b981" />
              <span>Centro de Salud Autorizado & Certificado</span>
            </div>
          </div>

          {/* Col 2: Explorar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.02em" }}>
              Explorar
            </h4>
            <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.875rem", transition: "color 150ms" }}>
              Inicio
            </Link>
            <Link to="/servicios" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.875rem", transition: "color 150ms" }}>
              Especialidades & Servicios
            </Link>
            <Link to="/profesionales" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.875rem", transition: "color 150ms" }}>
              Cuerpo Médico & Terapeutas
            </Link>
            <Link to="/nosotros" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.875rem", transition: "color 150ms" }}>
              Nuestra Clínica & Misión
            </Link>
            <Link to="/contacto" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.875rem", transition: "color 150ms" }}>
              Ubicación & Contacto
            </Link>
          </div>

          {/* Col 3: Pacientes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.02em" }}>
              Portal del Paciente
            </h4>
            <Link to="/reservar" style={{ color: "var(--primary-focus, #818cf8)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}>
              📅 Reservar Cita en Línea
            </Link>
            <Link to="/mis-citas" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.875rem" }}>
              Consultar Mis Citas
            </Link>
            <Link to="/login" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.875rem" }}>
              Iniciar Sesión / Registro
            </Link>
            <Link to="/admin" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.8125rem", marginTop: 8 }}>
              🔐 Acceso Administrativo (Staff)
            </Link>
          </div>

          {/* Col 4: Contacto */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.02em" }}>
              Contacto & Horarios
            </h4>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.8125rem", color: "#94a3b8" }}>
              <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>Av. Javier Prado Este 2450, San Borja, Lima</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.8125rem", color: "#94a3b8" }}>
              <Phone size={16} color="var(--primary)" />
              <span>+51 987 654 321</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.8125rem", color: "#94a3b8" }}>
              <Mail size={16} color="var(--primary)" />
              <span>citas@klinicpro.com</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.8125rem", color: "#94a3b8" }}>
              <Clock size={16} color="var(--primary)" />
              <span>Lun - Sáb: 08:00 a 20:00</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: "24px", borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, fontSize: "0.8125rem", color: "#64748b" }}>
          <div>
            © {new Date().getFullYear()} Klinic Pro. Todos los derechos reservados.
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <span>Términos y Condiciones</span>
            <span>•</span>
            <span>Política de Privacidad</span>
            <span>•</span>
            <span>Libro de Reclamaciones</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
