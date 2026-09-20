"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type Me = { id: number; name: string; email: string; role: string } | null;

/** Navbar con estado de sesión. */
export function Navbar() {
  const [me, setMe] = useState<Me>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMe(d.user ?? null))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">📅</span>
          Citas
        </Link>

        <div className="flex items-center gap-2 text-sm">
          {loading ? (
            <span className="text-slate-400">…</span>
          ) : me ? (
            <>
              <Link href="/mis-citas" className="rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100">
                Mis citas
              </Link>
              {me.role === "admin" && (
                <Link href="/admin" className="rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100">
                  Admin
                </Link>
              )}
              <span className="hidden text-slate-500 sm:inline">Hola, {me.name.split(" ")[0]}</span>
              <button onClick={logout} className="btn-ghost">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/reservar" className="btn-primary">
                Reservar
              </Link>
              <Link href="/login" className="btn-ghost">
                Entrar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
