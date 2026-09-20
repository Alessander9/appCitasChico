import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  CalendarCheck
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

export default function Contacto() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    servicioInteres: "Terapia Física",
    mensaje: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.telefono.trim()) {
      toast("Por favor completa al menos tu nombre y número de teléfono.", "warning");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast("Nos pondremos en contacto contigo por WhatsApp en breve.", "success");
    }, 600);
  };

  return (
    <div style={{ paddingBottom: "80px" }}>
      {/* Header Banner */}
      <section style={{ 
        padding: "60px 24px 40px", 
        background: "linear-gradient(180deg, #F0FDF4 0%, var(--bg-app) 100%)",
        borderBottom: "1px solid var(--border-subtle)",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            padding: "6px 14px", 
            background: "#DCFCE7", 
            color: "#166534", 
            borderRadius: "999px", 
            fontSize: "13px", 
            fontWeight: 600,
            marginBottom: "16px"
          }}>
            <MessageCircle size={15} />
            Canales de Atención
          </div>
          <h1 style={{ 
            fontSize: "clamp(30px, 4.5vw, 42px)", 
            fontWeight: 800, 
            color: "var(--text-primary)", 
            letterSpacing: "-0.03em", 
            marginBottom: "16px" 
          }}>
            Estamos aquí para ayudarte
          </h1>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            ¿Tienes dudas sobre un tratamiento o deseas asistencia personalizada para agendar tu cita? Escríbenos o visítanos en nuestra sede.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section style={{ maxWidth: "1140px", margin: "40px auto 0", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "36px" }}>
          
          {/* Columna Izquierda: Tarjetas de Información */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Direct WhatsApp Callout */}
            <div style={{ 
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", 
              borderRadius: "20px", 
              padding: "28px", 
              color: "white",
              boxShadow: "0 10px 25px rgba(16, 185, 129, 0.2)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MessageCircle size={22} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Atención directa por WhatsApp</h3>
                  <p style={{ fontSize: "13px", opacity: 0.9 }}>Respuesta en menos de 10 minutos</p>
                </div>
              </div>
              <p style={{ fontSize: "14px", lineHeight: 1.5, opacity: 0.95, marginBottom: "20px" }}>
                Coordina directamente con nuestro equipo de admisiones consultas sobre presupuestos, cobertura y disponibilidad inmediata.
              </p>
              <a 
                href="https://wa.me/51987654321?text=Hola%20Klinic%20Pro,%20quisiera%20informaci%C3%B3n%20sobre%20una%20cita" 
                target="_blank" 
                rel="noreferrer"
                className="btn"
                style={{ 
                  background: "white", 
                  color: "#059669", 
                  fontWeight: 700, 
                  width: "100%", 
                  justifyContent: "center",
                  borderRadius: "12px",
                  padding: "12px"
                }}
              >
                Abrir WhatsApp (+51 987 654 321)
              </a>
            </div>

            {/* Info Cards */}
            <div style={{ 
              background: "white", 
              borderRadius: "20px", 
              border: "1px solid var(--border-subtle)", 
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>Dirección de la Clínica</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginTop: "2px" }}>
                    Av. República de Panamá 3500, San Isidro
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Lima, Perú (Estacionamiento privado disponible)
                  </div>
                </div>
              </div>

              <div style={{ height: "1px", background: "var(--border-subtle)" }} />

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>Horarios de Atención</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginTop: "2px" }}>
                    Lunes a Viernes: 08:00 - 20:00
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>
                    Sábados: 08:30 - 15:00
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Domingos y feriados: Cerrado
                  </div>
                </div>
              </div>

              <div style={{ height: "1px", background: "var(--border-subtle)" }} />

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#F3E8FF", color: "#9333EA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>Correos Electrónicos</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>
                    citas@klinicpro.com
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                    informes@klinicpro.com
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Booking CTA */}
            <div style={{ 
              background: "#F8FAFC", 
              borderRadius: "16px", 
              border: "1px dashed var(--border-subtle)", 
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>¿Prefieres reservar de inmediato?</div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Elige tu especialista y horario en línea.</div>
              </div>
              <Link to="/reservar" className="btn btn-primary" style={{ padding: "10px 18px", fontSize: "13px", borderRadius: "10px", whiteSpace: "nowrap" }}>
                Reservar <CalendarCheck size={15} />
              </Link>
            </div>

          </div>

          {/* Columna Derecha: Formulario de Contacto */}
          <div style={{ 
            background: "white", 
            borderRadius: "20px", 
            border: "1px solid var(--border-subtle)", 
            padding: "36px 32px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.04)"
          }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.02em" }}>
              Envíanos un mensaje
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "28px" }}>
              Completa este breve formulario y nuestro equipo de atención al paciente se comunicará contigo el mismo día.
            </p>

            {isSubmitted ? (
              <div style={{ 
                textAlign: "center", 
                padding: "40px 20px", 
                background: "#F0FDF4", 
                borderRadius: "16px", 
                border: "1px solid #BBF7D0" 
              }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#DCFCE7", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#166534", marginBottom: "8px" }}>
                  ¡Mensaje recibido!
                </h3>
                <p style={{ fontSize: "14px", color: "#15803D", lineHeight: 1.6, maxWidth: "380px", margin: "0 auto 24px" }}>
                  Gracias <strong>{formData.nombre}</strong>. Uno de nuestros coordinadores médicos te contactará al <strong>{formData.telefono}</strong>.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button 
                    onClick={() => { setIsSubmitted(false); setFormData({ nombre: "", telefono: "", email: "", servicioInteres: "Terapia Física", mensaje: "" }); }}
                    className="btn btn-secondary"
                    style={{ fontSize: "13px", padding: "10px 18px", borderRadius: "10px" }}
                  >
                    Enviar otro mensaje
                  </button>
                  <Link to="/reservar" className="btn btn-primary" style={{ fontSize: "13px", padding: "10px 18px", borderRadius: "10px" }}>
                    Ir a reservar cita
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px", display: "block" }}>
                    Nombre completo <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ej. María Elena Rojas" 
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required 
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", fontSize: "14px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px", display: "block" }}>
                      Teléfono / WhatsApp <span style={{ color: "var(--danger)" }}>*</span>
                    </label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="987 654 321" 
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      required 
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", fontSize: "14px" }}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px", display: "block" }}>
                      Correo electrónico (opcional)
                    </label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="nombre@correo.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px", display: "block" }}>
                    Especialidad o Servicio de interés
                  </label>
                  <select 
                    className="form-input"
                    value={formData.servicioInteres}
                    onChange={(e) => setFormData({ ...formData, servicioInteres: e.target.value })}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", fontSize: "14px", background: "white" }}
                  >
                    <option value="Terapia Física y Rehabilitación">Terapia Física y Rehabilitación</option>
                    <option value="Psicología Clínica">Psicología Clínica y Psicoterapia</option>
                    <option value="Medicina General y Preventiva">Medicina General y Preventiva</option>
                    <option value="Acupuntura y Medicina Tradicional">Acupuntura y Medicina Tradicional</option>
                    <option value="Nutrición y Dietética Clínica">Nutrición y Dietética Clínica</option>
                    <option value="Terapia Manual y Masaje Terapéutico">Terapia Manual y Masaje Terapéutico</option>
                    <option value="Otro motivo o consulta">Otro motivo o consulta</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px", display: "block" }}>
                    ¿En qué podemos ayudarte? (opcional)
                  </label>
                  <textarea 
                    className="form-input" 
                    rows={4}
                    placeholder="Cuéntanos brevemente tu molestia, diagnóstico previo o disponibilidad deseada..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", fontSize: "14px", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--text-secondary)" }}>
                  <ShieldCheck size={15} color="var(--primary)" />
                  Tus datos están protegidos y sólo se usarán para coordinar tu atención.
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary" 
                  style={{ 
                    padding: "14px", 
                    borderRadius: "12px", 
                    fontSize: "15px", 
                    fontWeight: 700, 
                    width: "100%", 
                    justifyContent: "center" 
                  }}
                >
                  {isSubmitting ? "Enviando mensaje..." : (
                    <>
                      Enviar solicitud de contacto <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
