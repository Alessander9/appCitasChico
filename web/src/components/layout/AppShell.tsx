import { useState, useEffect, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";
import { NewAppointmentModal } from "../ui/NewAppointmentModal";
import { AppointmentDrawer } from "../ui/AppointmentDrawer";
import { PatientDrawer } from "../ui/PatientDrawer";
import { GlobalSearchModal } from "../ui/GlobalSearchModal";
import { useClinic } from "../../context/ClinicContext";

export function AppShell({ children }: { children: ReactNode }) {
  const { appointments, patients } = useClinic();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const selectedAppointment = appointments.find((a) => a.id === selectedAppointmentId) || null;
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || null;

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key.toLowerCase() === "c" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsNewAppointmentOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-app)" }}>
      {/* Sidebar Navigation */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main Viewport */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNewAppointment={() => setIsNewAppointmentOpen(true)}
        />

        <main style={{ flex: 1, padding: "28px 32px 64px", overflowY: "auto" }}>
          {children}
        </main>

        <MobileNav onOpenNewAppointment={() => setIsNewAppointmentOpen(true)} />
      </div>

      {/* Global Modals & Drawers */}
      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        preselectedPatientId={selectedPatientId || undefined}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPatient={(id) => {
          setSelectedPatientId(id);
          setIsSearchOpen(false);
        }}
        onSelectAppointment={(id) => {
          setSelectedAppointmentId(id);
          setIsSearchOpen(false);
        }}
      />

      <AppointmentDrawer
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointmentId(null)}
        onOpenPatient={(patientId) => {
          setSelectedAppointmentId(null);
          setSelectedPatientId(patientId);
        }}
      />

      <PatientDrawer
        patient={selectedPatient}
        onClose={() => setSelectedPatientId(null)}
        onNewAppointment={(patientId) => {
          setSelectedPatientId(patientId);
          setIsNewAppointmentOpen(true);
        }}
      />
    </div>
  );
}
