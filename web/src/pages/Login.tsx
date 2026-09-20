import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Shield,
  User,
  KeyRound,
  FileSpreadsheet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Activity,
  Calendar,
  Utensils,
  ArrowLeft,
  Boxes,
  Stethoscope,
  Info
} from "lucide-react";
import { useAuth, DEFAULT_USERS } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { type UserRole, ROLE_LABELS } from "../lib/jwt";

export default function Login() {
  const { signIn, signUp, loginAsRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("director@klinicpro.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Redirection helper based on role
  const redirectAfterLogin = (role: UserRole) => {
    const from = (location.state as any)?.from?.pathname;
    if (from && from !== "/login") {
      navigate(from);
      return;
    }

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "doctor") {
      navigate("/admin/agenda");
    } else if (role === "receptionist") {
      navigate("/admin");
    } else {
      navigate("/mis-citas");
    }
  };

  const handleRoleSelection = (role: UserRole, autoLogin = false) => {
    setSelectedRole(role);
    const userSeed = DEFAULT_USERS[role];
    if (userSeed) {
      setEmail(userSeed.email);
      setName(userSeed.name);
      setPassword(role === "admin" ? "admin123" : "demo123");
    }

    if (autoLogin) {
      const authUser = loginAsRole(role);
      toast(`Sesión iniciada como: ${ROLE_LABELS[role].title}`, "success");
      redirectAfterLogin(authUser.role);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Por favor ingresa tu correo y contraseña", "warning");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const authUser = await signIn(email, password, selectedRole);
        toast(`¡Bienvenido de nuevo, ${authUser.name}!`, "success");
        redirectAfterLogin(authUser.role);
      } else {
        const authUser = await signUp(
          name || email.split("@")[0],
          email,
          password,
          selectedRole
        );
        toast(`Cuenta creada exitosamente (${ROLE_LABELS[authUser.role].title})`, "success");
        redirectAfterLogin(authUser.role);
      }
    } catch {
      toast("Error al autenticar credenciales. Verifica tus datos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: "admin" as UserRole,
      title: "Director / Admin",
      subtitle: "director@klinicpro.com",
      icon: Shield,
      badge: "Total",
      color: "#4f46e5",
      bg: "#eef2ff",
      border: "#c7d2fe",
    },
    {
      role: "doctor" as UserRole,
      title: "Médico Fisiatra",
      subtitle: "carlos.perez@klinicpro.com",
      icon: Stethoscope,
      badge: "Clínica",
      color: "#059669",
      bg: "#ecfdf5",
      border: "#a7f3d0",
    },
    {
      role: "receptionist" as UserRole,
      title: "Recepcionista",
      subtitle: "recepcion@klinicpro.com",
      icon: FileSpreadsheet,
      badge: "Caja",
      color: "#d97706",
      bg: "#fffbeb",
      border: "#fde68a",
    },
    {
      role: "patient" as UserRole,
      title: "Paciente",
      subtitle: "maria.rojas@gmail.com",
      icon: User,
      badge: "Web",
      color: "#2563eb",
      bg: "#eff6ff",
      border: "#bfdbfe",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Top Navbar */}
      <header
        style={{
          height: "64px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "1.25rem",
              boxShadow: "0 2px 8px rgba(79, 70, 229, 0.25)",
            }}
          >
            +
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.0625rem", color: "#0f172a", letterSpacing: "-0.02em" }}>
              Klinic Pro
            </div>
            <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 700, letterSpacing: "0.05em" }}>
              SISTEMA DE AUTENTICACIÓN JWT
            </div>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#059669",
              backgroundColor: "#ecfdf5",
              border: "1px solid #a7f3d0",
              padding: "4px 12px",
              borderRadius: "999px",
            }}
          >
            <Shield size={14} />
            <span>Conexión Segura SSL 256-Bit</span>
          </div>

          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#475569",
              backgroundColor: "#f1f5f9",
              border: "1px solid #e2e8f0",
              padding: "6px 14px",
              borderRadius: "10px",
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
          >
            <ArrowLeft size={14} />
            <span>Volver a la Web</span>
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1060px",
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 45px -10px rgba(15, 23, 42, 0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            overflow: "hidden",
          }}
        >
          {/* LEFT HERO COLUMN */}
          <div
            style={{
              background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
              color: "#ffffff",
              padding: "44px 36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#c7d2fe",
                  marginBottom: "20px",
                }}
              >
                <Sparkles size={13} color="#a5b4fc" />
                <span>Suite Médica SaaS 2.0</span>
              </div>

              <h2
                style={{
                  color: "#ffffff",
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  marginBottom: "14px",
                }}
              >
                Gestión Clínica Integral & Citas en Tiempo Real
              </h2>

              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "0.84rem",
                  lineHeight: 1.6,
                  marginBottom: "28px",
                }}
              >
                Controla historias clínicas con bioimpedancia, sincroniza agendas multi-profesional y formula planes nutricionales con altos estándares de seguridad.
              </p>

              {/* 4 Feature Pills */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.07)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "14px",
                    padding: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#a5b4fc", marginBottom: "4px" }}>
                    <Calendar size={15} />
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "#ffffff" }}>Agenda Médica</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Google Calendar & WA</span>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.07)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "14px",
                    padding: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6ee7b7", marginBottom: "4px" }}>
                    <Activity size={15} />
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "#ffffff" }}>Fichas 360°</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Bioimpedancia e IMC</span>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.07)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "14px",
                    padding: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#fcd34d", marginBottom: "4px" }}>
                    <Utensils size={15} />
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "#ffffff" }}>Dietas & Nutrición</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Planes calóricos</span>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.07)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "14px",
                    padding: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#5eead4", marginBottom: "4px" }}>
                    <Boxes size={15} />
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "#ffffff" }}>Control de Stock</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Alertas de insumos</span>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "16px",
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=80"
                alt="Dr. Roberto Mendoza"
                style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", border: "2px solid #818cf8", flexShrink: 0 }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "#ffffff" }}>Dr. Roberto Mendoza</div>
                <div style={{ fontSize: "10px", color: "#a5b4fc", fontWeight: 600 }}>Director Médico & Administrador</div>
                <div style={{ fontSize: "11px", color: "#cbd5e1", fontStyle: "italic", marginTop: "2px", lineHeight: 1.3 }}>
                  "El flujo integral de historias clínicas optimizó nuestra atención en más de un 60%."
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT FORM COLUMN */}
          <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "24px" }}>
            
            {/* Header Title */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#4f46e5",
                  backgroundColor: "#eef2ff",
                  border: "1px solid #c7d2fe",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  marginBottom: "8px",
                }}
              >
                <KeyRound size={12} />
                <span>Portal de Autenticación Unificada</span>
              </div>
              <h1 style={{ fontSize: "1.625rem", fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
                {mode === "login" ? "Iniciar Sesión en tu Cuenta" : "Crear Nueva Cuenta"}
              </h1>
              <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                {mode === "login"
                  ? "Selecciona un rol de demostración o ingresa con tus credenciales."
                  : "Regístrate para acceder al sistema clínico y gestionar tus expedientes."}
              </p>
            </div>

            {/* Quick Demo 1-Click Cards */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, color: "#1e293b" }}>
                  <Sparkles size={14} color="#4f46e5" />
                  <span>Cuentas de Demostración (Acceso en 1 Clic)</span>
                </div>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#065f46", backgroundColor: "#d1fae5", padding: "2px 8px", borderRadius: "999px" }}>
                  Prueba Inmediata
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {demoAccounts.map((acc) => {
                  const Icon = acc.icon;
                  const isSelected = selectedRole === acc.role;
                  return (
                    <div
                      key={acc.role}
                      onClick={() => handleRoleSelection(acc.role, false)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "12px",
                        border: isSelected ? "2px solid #4f46e5" : "1px solid #e2e8f0",
                        backgroundColor: isSelected ? "#eef2ff" : "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "6px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ padding: "6px", borderRadius: "8px", backgroundColor: acc.bg, border: `1px solid ${acc.border}`, color: acc.color }}>
                            <Icon size={14} />
                          </div>
                          <div>
                            <div style={{ fontSize: "12px", fontWeight: 800, color: "#0f172a" }}>{acc.title}</div>
                            <div style={{ fontSize: "10px", color: "#64748b" }}>{acc.subtitle}</div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 size={14} color="#4f46e5" />}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "6px", borderTop: "1px solid #f1f5f9" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: acc.color, backgroundColor: acc.bg, padding: "1px 6px", borderRadius: "4px" }}>
                          {acc.badge}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoleSelection(acc.role, true);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: "11px",
                            fontWeight: 800,
                            color: "#4f46e5",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "2px",
                            padding: 0,
                          }}
                        >
                          <span>Ingresar ya</span>
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{ display: "flex", backgroundColor: "#f1f5f9", padding: "4px", borderRadius: "12px" }}>
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{
                  flex: 1,
                  padding: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: mode === "login" ? "#ffffff" : "transparent",
                  color: mode === "login" ? "#0f172a" : "#64748b",
                  boxShadow: mode === "login" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                style={{
                  flex: 1,
                  padding: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: mode === "register" ? "#ffffff" : "transparent",
                  color: mode === "register" ? "#0f172a" : "#64748b",
                  boxShadow: mode === "register" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                Registrar Nuevo Usuario
              </button>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              
              {/* Role Select */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Shield size={14} color="#4f46e5" />
                  <span>Rol de Usuario</span>
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleSelection(e.target.value as UserRole, false)}
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#0f172a",
                    outline: "none",
                  }}
                >
                  <option value="admin">👑 Administrador / Director (Acceso Total)</option>
                  <option value="doctor">👨‍⚕️ Médico / Fisiatra (Agenda & Historias)</option>
                  <option value="receptionist">📋 Recepcionista / Staff (Turnos & Pagos)</option>
                  <option value="patient">👤 Paciente (Mis Citas & Reservas)</option>
                </select>
              </div>

              {/* Name (Only in Register mode) */}
              {mode === "register" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                    <User size={14} color="#4f46e5" />
                    <span>Nombre Completo *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Dra. Carmen Velasco"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#ffffff",
                      fontSize: "13px",
                      color: "#0f172a",
                      outline: "none",
                    }}
                  />
                </div>
              )}

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Mail size={14} color="#4f46e5" />
                  <span>Correo Electrónico *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="usuario@klinicpro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    height: "42px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#ffffff",
                    fontSize: "13px",
                    color: "#0f172a",
                    outline: "none",
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Lock size={14} color="#4f46e5" />
                    <span>Contraseña *</span>
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#4f46e5",
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: 0,
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      height: "42px",
                      padding: "8px 40px 8px 12px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#ffffff",
                      fontSize: "13px",
                      color: "#0f172a",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "2px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#475569", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: "#4f46e5", cursor: "pointer" }}
                  />
                  <span>Recordar sesión en este equipo</span>
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#94a3b8" }}>
                  <KeyRound size={12} color="#4f46e5" />
                  <span>JWT 24 Horas</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: "44px",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
                  transition: "all 0.15s ease",
                  marginTop: "6px",
                }}
              >
                {loading ? (
                  <span>Autenticando credenciales...</span>
                ) : (
                  <>
                    <span>{mode === "login" ? "Ingresar con Token Seguro" : "Crear Cuenta & Autenticar"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Footer switch mode text */}
            <div style={{ textAlign: "center", fontSize: "12px", color: "#64748b" }}>
              {mode === "login" ? (
                <span>
                  ¿No tienes una cuenta registrada aún?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    style={{ background: "none", border: "none", fontWeight: 800, color: "#4f46e5", cursor: "pointer", textDecoration: "underline", padding: 0 }}
                  >
                    Crear cuenta aquí
                  </button>
                </span>
              ) : (
                <span>
                  ¿Ya tienes una cuenta activa?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    style={{ background: "none", border: "none", fontWeight: 800, color: "#4f46e5", cursor: "pointer", textDecoration: "underline", padding: 0 }}
                  >
                    Inicia sesión aquí
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ height: "48px", backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#94a3b8" }}>
        © {new Date().getFullYear()} Klinic Pro Medical Suite. Todos los derechos reservados.
      </footer>

      {/* Forgot Password Helper Modal */}
      {showForgotModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "440px",
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4f46e5", fontWeight: 800, fontSize: "14px" }}>
                <Info size={16} />
                <span>Recuperación de Contraseña</span>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                style={{ background: "none", border: "none", fontSize: "16px", color: "#64748b", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.5, margin: 0 }}>
              En este entorno de demostración, las credenciales predeterminadas para todas las cuentas de prueba son:
            </p>

            <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, color: "#334155" }}>Administrador:</span>
                <span style={{ fontFamily: "monospace", backgroundColor: "#ffffff", padding: "2px 8px", borderRadius: "6px", border: "1px solid #e2e8f0", color: "#4f46e5", fontWeight: 800 }}>admin123</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, color: "#334155" }}>Médico / Recepción / Paciente:</span>
                <span style={{ fontFamily: "monospace", backgroundColor: "#ffffff", padding: "2px 8px", borderRadius: "6px", border: "1px solid #e2e8f0", color: "#4f46e5", fontWeight: 800 }}>demo123</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "6px" }}>
              <button
                type="button"
                onClick={() => {
                  setPassword(selectedRole === "admin" ? "admin123" : "demo123");
                  setShowForgotModal(false);
                  toast("Contraseña completada automáticamente", "info");
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Autocompletar Contraseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
