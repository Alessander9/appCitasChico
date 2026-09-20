import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, Menu, X, Clock, LogIn, User } from "lucide-react";

export function PublicHeader() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: "/", label: "Inicio" },
    { path: "/servicios", label: "Servicios" },
    { path: "/profesionales", label: "Especialistas" },
    { path: "/nosotros", label: "Nosotros" },
    { path: "/contacto", label: "Contacto" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "#ffffff",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        borderBottom: isScrolled ? "1px solid var(--border)" : "1px solid transparent",
        boxShadow: isScrolled ? "0 4px 20px -2px rgba(0, 0, 0, 0.05)" : "none",
        transition: "all var(--transition-fast)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isScrolled ? "0 24px" : "4px 24px",
          height: isScrolled ? "62px" : "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all var(--transition-fast)",
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "var(--text-primary)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.25rem",
              boxShadow: "0 2px 8px var(--primary-glow)",
            }}
          >
            +
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.0625rem", letterSpacing: "-0.02em" }}>
              Klinic Pro
            </div>
            <div style={{ fontSize: "0.625rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.05em" }}>
              CENTRO MÉDICO & TERAPÉUTICO
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path !== "/" && location.pathname.startsWith(link.path));

            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--primary)" : "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color var(--transition-fast)",
                  position: "relative",
                  padding: "4px 0",
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      right: 0,
                      height: 2,
                      backgroundColor: "var(--primary)",
                      borderRadius: 99,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Header Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link
            to="/mis-citas"
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: location.pathname === "/mis-citas" ? "var(--primary)" : "var(--text-secondary)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: "var(--radius-md)",
            }}
          >
            <Clock size={15} color="var(--primary)" />
            <span>Mis Citas</span>
          </Link>

          <Link
            to="/login"
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--text-secondary)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              backgroundColor: "#f8fafc",
            }}
          >
            <LogIn size={15} color="var(--text-secondary)" />
            <span>Iniciar Sesión</span>
          </Link>

          <Link
            to="/reservar"
            className="btn btn-primary"
            style={{
              padding: "9px 18px",
              fontSize: "0.875rem",
              boxShadow: "0 2px 10px var(--primary-glow)",
            }}
          >
            <Calendar size={16} />
            <span>Reservar Cita</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="btn-icon mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: "none" }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid var(--border)",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            animation: "fadeIn 150ms ease-out",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                textDecoration: "none",
                padding: "8px 0",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/mis-citas"
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              textDecoration: "none",
              padding: "8px 0",
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <Clock size={16} color="var(--primary)" />
            Mis Citas Médicas
          </Link>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexDirection: "column" }}>
            <Link to="/reservar" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              <Calendar size={16} />
              Reservar Cita
            </Link>
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/login" className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
                <LogIn size={15} />
                Iniciar Sesión
              </Link>
              <Link to="/admin" className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
                <User size={15} />
                Panel Staff
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
