import { Link } from "react-router-dom";
import { 
  Heart, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  Building2
} from "lucide-react";

export default function Nosotros() {
  const values = [
    {
      icon: Heart,
      title: "Empatía y Calidez",
      desc: "Escuchamos a cada paciente de manera integral, entendiendo que detrás de cada consulta hay una historia única.",
    },
    {
      icon: Award,
      title: "Rigor y Excelencia",
      desc: "Nuestros profesionales cuentan con amplia trayectoria, colegiatura activa y actualización médica constante.",
    },
    {
      icon: Sparkles,
      title: "Tecnología Humana",
      desc: "Plataforma digital ágil para tus citas y seguimiento clínico, sin perder jamás el trato cercano y personalizado.",
    },
    {
      icon: ShieldCheck,
      title: "Transparencia Total",
      desc: "Claridad absoluta en tratamientos, tiempos de recuperación, diagnósticos y tarifas justas sin sorpresas.",
    },
  ];

  const facilities = [
    {
      title: "Gimnasio Terapéutico y Rehabilitación",
      desc: "Equipamiento de mecanoterapia, ultrasonido terapéutico, magnetoterapia y camillas ergonómicas.",
      tag: "Rehabilitación",
    },
    {
      title: "Consultorios Médicos Privados",
      desc: "Espacios insonorizados, climatizados y diseñados para evaluaciones cómodas y seguras.",
      tag: "Consultorios",
    },
    {
      title: "Salas de Terapia Manual y Acupuntura",
      desc: "Ambientes de relajación profunda con aromaterapia, luz tenue y camillas especializadas.",
      tag: "Bienestar",
    },
    {
      title: "Área de Espera & Recepción Digital",
      desc: "Wifi de alta velocidad, check-in express y asistencia permanente de nuestro equipo de recepción.",
      tag: "Atención",
    },
  ];

  const stats = [
    { value: "+10,000", label: "Pacientes recuperados" },
    { value: "+25", label: "Especialistas certificados" },
    { value: "+15", label: "Especialidades clínicas" },
    { value: "4.9 / 5", label: "Satisfacción de pacientes" },
  ];

  return (
    <div style={{ paddingBottom: "80px" }}>
      {/* Hero Nosotros */}
      <section style={{ 
        padding: "80px 24px 60px", 
        background: "linear-gradient(180deg, #F0FDF4 0%, var(--bg-app) 100%)",
        borderBottom: "1px solid var(--border-subtle)",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
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
            marginBottom: "20px"
          }}>
            <Building2 size={15} />
            Sobre Klinic Pro
          </div>
          <h1 style={{ 
            fontSize: "clamp(32px, 5vw, 48px)", 
            fontWeight: 800, 
            color: "var(--text-primary)", 
            letterSpacing: "-0.03em", 
            lineHeight: 1.15,
            marginBottom: "20px" 
          }}>
            Cuidamos de tu salud con excelencia científica y profunda calidez humana
          </h1>
          <p style={{ 
            fontSize: "clamp(16px, 2.5vw, 19px)", 
            color: "var(--text-secondary)", 
            lineHeight: 1.6,
            maxWidth: "700px",
            margin: "0 auto 32px"
          }}>
            Somos un centro integral de salud y rehabilitación terapéutica comprometido en devolverte tu bienestar, movilidad y tranquilidad en cada etapa de tu vida.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/reservar" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: "16px", borderRadius: "12px" }}>
              Reservar una cita <ArrowRight size={18} />
            </Link>
            <Link to="/profesionales" className="btn btn-secondary" style={{ padding: "14px 24px", fontSize: "16px", borderRadius: "12px" }}>
              Conoce al equipo
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ maxWidth: "1140px", margin: "-30px auto 70px", padding: "0 24px" }}>
        <div style={{ 
          background: "white", 
          borderRadius: "20px", 
          border: "1px solid var(--border-subtle)", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          padding: "32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px",
          textAlign: "center"
        }}>
          {stats.map((s, idx) => (
            <div key={idx} style={{ borderRight: idx !== stats.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--primary)" }}>{s.value}</div>
              <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500, marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Historia & Misión */}
      <section style={{ maxWidth: "1140px", margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "48px", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", color: "var(--primary)", letterSpacing: "0.08em", marginBottom: "12px" }}>
              NUESTRA HISTORIA
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "20px" }}>
              Nacimos para transformar la experiencia de atención en salud
            </h2>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "16px" }}>
              Klinic Pro fue fundada por un equipo multidisciplinario de médicos y terapeutas con una convicción clara: la atención médica debe ser oportuna, sin colas innecesarias y centrada 100% en la recuperación integral del paciente.
            </p>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "24px" }}>
              Hoy combinamos la mejor infraestructura física con una plataforma digital de citas y seguimiento clínico que permite a miles de familias acceder a especialistas de primer nivel con total transparencia.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "Historial clínico digital integrado para seguimiento continuo",
                "Especialistas con más de 10 años de experiencia promedio",
                "Atención puntual con recordatorios automáticos",
                "Ambientes diseñados para tu confort y relajación"
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div style={{ 
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)", 
            borderRadius: "24px", 
            padding: "40px", 
            color: "white",
            boxShadow: "0 16px 36px rgba(5, 150, 105, 0.25)"
          }}>
            <div style={{ display: "inline-block", padding: "6px 12px", background: "rgba(255,255,255,0.2)", borderRadius: "8px", fontSize: "12px", fontWeight: 700, marginBottom: "20px" }}>
              NUESTRA MISIÓN
            </div>
            <h3 style={{ fontSize: "24px", fontWeight: 800, lineHeight: 1.3, marginBottom: "16px" }}>
              "Brindar atención en salud y rehabilitación de la más alta calidad humana y técnica, devolviendo calidad de vida a cada paciente."
            </h3>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.2)", margin: "24px 0" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <div style={{ fontSize: "13px", opacity: 0.8 }}>Horarios flexibles</div>
                <div style={{ fontSize: "15px", fontWeight: 700, marginTop: "2px" }}>Lun - Sáb 08:00 - 20:00</div>
              </div>
              <div>
                <div style={{ fontSize: "13px", opacity: 0.8 }}>Ubicación central</div>
                <div style={{ fontSize: "15px", fontWeight: 700, marginTop: "2px" }}>Av. República de Panamá</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section style={{ background: "white", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 50px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", color: "var(--primary)", letterSpacing: "0.08em", marginBottom: "8px" }}>
              NUESTROS VALORES
            </div>
            <h2 style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Los principios que guían nuestra atención médica
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div 
                  key={idx} 
                  style={{ 
                    padding: "32px 24px", 
                    borderRadius: "18px", 
                    background: "var(--bg-app)", 
                    border: "1px solid var(--border-subtle)",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "12px", 
                    background: "#DCFCE7", 
                    color: "#166534", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    marginBottom: "20px"
                  }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>{v.title}</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instalaciones */}
      <section style={{ maxWidth: "1140px", margin: "80px auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", maxWidth: "650px", margin: "0 auto 50px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", color: "var(--primary)", letterSpacing: "0.08em", marginBottom: "8px" }}>
            INFRAESTRUCTURA Y ESPACIOS
          </div>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Espacios diseñados para tu recuperación
          </h2>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginTop: "10px" }}>
            Instalaciones modernas y equipadas con tecnología médica de vanguardia para garantizar diagnósticos certeros y tratamientos confortables.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
          {facilities.map((f, idx) => (
            <div 
              key={idx}
              style={{
                background: "white",
                borderRadius: "16px",
                border: "1px solid var(--border-subtle)",
                padding: "28px 24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                <span style={{ 
                  display: "inline-block", 
                  padding: "4px 10px", 
                  background: "#F1F5F9", 
                  color: "#475569", 
                  borderRadius: "6px", 
                  fontSize: "12px", 
                  fontWeight: 600,
                  marginBottom: "16px"
                }}>
                  {f.tag}
                </span>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {f.desc}
                </p>
              </div>
              <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontSize: "13px", fontWeight: 600 }}>
                <Activity size={14} /> Espacio 100% equipado
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ maxWidth: "1140px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ 
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", 
          borderRadius: "24px", 
          padding: "50px 40px", 
          color: "white",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.15)"
        }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.02em" }}>
            ¿Listo para dar el primer paso hacia tu recuperación?
          </h2>
          <p style={{ fontSize: "16px", color: "#94A3B8", maxWidth: "600px", margin: "0 auto 32px", lineHeight: 1.6 }}>
            Elige el servicio y horario que mejor se acomode a tu rutina. Reserva en menos de 2 minutos sin complicaciones.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/reservar" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "16px", borderRadius: "12px" }}>
              Reservar cita online <ArrowRight size={18} />
            </Link>
            <Link to="/contacto" className="btn" style={{ background: "rgba(255,255,255,0.1)", color: "white", padding: "14px 24px", fontSize: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)" }}>
              Contactar por WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
