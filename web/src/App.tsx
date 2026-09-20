import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ClinicProvider } from "./context/ClinicContext";
import { AppShell } from "./components/layout/AppShell";
import { PublicLayout } from "./components/public/PublicLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Public Pages
import PublicHome from "./pages/public/PublicHome";
import Servicios from "./pages/public/Servicios";
import ServicioDetalle from "./pages/public/ServicioDetalle";
import Especialistas from "./pages/public/Especialistas";
import EspecialistaDetalle from "./pages/public/EspecialistaDetalle";
import Nosotros from "./pages/public/Nosotros";
import Contacto from "./pages/public/Contacto";

// Patient & User Pages
import Reservar from "./pages/Reservar";
import Login from "./pages/Login";
import MisCitas from "./pages/MisCitas";
import Perfil from "./pages/Perfil";

// Clinical SaaS Admin Pages
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Pacientes from "./pages/Pacientes";
import Profesionales from "./pages/Profesionales";
import Especialidades from "./pages/Especialidades";
import Pagos from "./pages/Pagos";
import Dietas from "./pages/Dietas";
import Inventario from "./pages/Inventario";
import Reportes from "./pages/Reportes";
import Configuracion from "./pages/Configuracion";

export default function App() {
  return (
    <ToastProvider>
      <ClinicProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Portal Routes (Wrapped in PublicLayout) */}
              <Route
                path="/"
                element={
                  <PublicLayout>
                    <PublicHome />
                  </PublicLayout>
                }
              />
              <Route
                path="/servicios"
                element={
                  <PublicLayout>
                    <Servicios />
                  </PublicLayout>
                }
              />
              <Route
                path="/servicios/:slug"
                element={
                  <PublicLayout>
                    <ServicioDetalle />
                  </PublicLayout>
                }
              />
              <Route
                path="/profesionales"
                element={
                  <PublicLayout>
                    <Especialistas />
                  </PublicLayout>
                }
              />
              <Route
                path="/profesionales/:slug"
                element={
                  <PublicLayout>
                    <EspecialistaDetalle />
                  </PublicLayout>
                }
              />
              <Route
                path="/nosotros"
                element={
                  <PublicLayout>
                    <Nosotros />
                  </PublicLayout>
                }
              />
              <Route
                path="/contacto"
                element={
                  <PublicLayout>
                    <Contacto />
                  </PublicLayout>
                }
              />

              {/* Patient Booking & Appointments */}
              <Route path="/reservar" element={<Reservar />} />
              <Route
                path="/mis-citas"
                element={
                  <PublicLayout>
                    <MisCitas />
                  </PublicLayout>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute allowedRoles={["admin", "doctor", "receptionist", "patient"]}>
                    <Perfil />
                  </ProtectedRoute>
                }
              />

              {/* Clinical SaaS Platform Routes (Protected by Role & JWT) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
                    <AppShell>
                      <Dashboard />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/agenda"
                element={
                  <ProtectedRoute allowedRoles={["admin", "doctor", "receptionist"]}>
                    <AppShell>
                      <Agenda />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/citas"
                element={
                  <ProtectedRoute allowedRoles={["admin", "doctor", "receptionist"]}>
                    <AppShell>
                      <Agenda />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/pacientes"
                element={
                  <ProtectedRoute allowedRoles={["admin", "doctor", "receptionist"]}>
                    <AppShell>
                      <Pacientes />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/profesionales"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AppShell>
                      <Profesionales />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/especialidades"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AppShell>
                      <Especialidades />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/historias"
                element={
                  <ProtectedRoute allowedRoles={["admin", "doctor"]}>
                    <AppShell>
                      <Pacientes />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dietas"
                element={
                  <ProtectedRoute allowedRoles={["admin", "doctor"]}>
                    <AppShell>
                      <Dietas />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/inventario"
                element={
                  <ProtectedRoute allowedRoles={["admin", "receptionist", "doctor"]}>
                    <AppShell>
                      <Inventario />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/pagos"
                element={
                  <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
                    <AppShell>
                      <Pagos />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reportes"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AppShell>
                      <Reportes />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/configuracion"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AppShell>
                      <Configuracion />
                    </AppShell>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ClinicProvider>
    </ToastProvider>
  );
}
