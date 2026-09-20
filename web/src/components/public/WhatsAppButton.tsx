import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const whatsappUrl = "https://wa.me/51987654321?text=" + encodeURIComponent("Hola, quisiera información sobre una cita en Klinic Pro.");

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 50,
        backgroundColor: "#25D366",
        color: "#ffffff",
        borderRadius: "999px",
        padding: "10px 18px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        textDecoration: "none",
        fontWeight: 700,
        fontSize: "0.875rem",
        boxShadow: "0 8px 20px -4px rgba(37, 211, 102, 0.45)",
        transition: "all var(--transition-fast)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <MessageCircle size={20} />
      <span>¿Necesitas ayuda?</span>
    </a>
  );
}
