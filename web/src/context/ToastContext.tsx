import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export type ToastMessage = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
};

type ToastContextType = {
  toast: (message: string, type?: ToastType, title?: string) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success", title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, type, message, title };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 380,
          width: "100%",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "14px 16px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.04)",
              animation: "slideInRight 200ms ease-out",
            }}
          >
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              {t.type === "success" && <CheckCircle2 size={18} color="#10b981" />}
              {t.type === "error" && <AlertCircle size={18} color="#ef4444" />}
              {t.type === "warning" && <AlertTriangle size={18} color="#f59e0b" />}
              {t.type === "info" && <Info size={18} color="#0ea5e9" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {t.title && (
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a", marginBottom: 2 }}>
                  {t.title}
                </div>
              )}
              <div style={{ fontSize: "0.8125rem", color: "#475569", lineHeight: 1.4 }}>{t.message}</div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: 2,
                display: "flex",
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}
