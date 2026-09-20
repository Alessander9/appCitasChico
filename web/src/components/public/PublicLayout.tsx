import { type ReactNode } from "react";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { WhatsAppButton } from "./WhatsAppButton";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-app)" }}>
      <PublicHeader />
      <div style={{ flex: 1 }}>{children}</div>
      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
