"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "login" ? { email, password } : { name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error inesperado");
        return;
      }
      router.push(next);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card w-full max-w-sm p-6">
      <h1 className="text-xl font-bold text-slate-900">
        {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {mode === "login" ? "Para gestionar tus citas" : "Y reserva tu primera cita"}
      </p>

      <form onSubmit={submit} className="mt-5 space-y-3">
        {mode === "register" && (
          <div>
            <label className="label">Nombre</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        )}
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Contraseña</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "…" : mode === "login" ? "Entrar" : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        {mode === "login" ? (
          <>
            ¿No tienes cuenta?{" "}
            <button className="font-medium text-indigo-600 hover:underline" onClick={() => setMode("register")}>
              Regístrate
            </button>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <button className="font-medium text-indigo-600 hover:underline" onClick={() => setMode("login")}>
              Inicia sesión
            </button>
          </>
        )}
      </p>
      <p className="mt-2 text-center text-xs text-slate-400">
        <Link href="/reservar">Seguir explorando →</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex max-w-5xl justify-center px-4 py-16">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
