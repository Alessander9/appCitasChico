import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Reserva tu cita en línea
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Elige tu servicio, escoge el horario que prefieras y confirma en segundos. Sin llamadas,
            sin esperas.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/reservar" className="btn-primary px-6 py-3 text-base">
              Reservar ahora
            </Link>
            <Link href="/login" className="btn-ghost px-6 py-3 text-base">
              Ya tengo cuenta
            </Link>
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          <div className="card p-6">
            <div className="text-2xl">⚡</div>
            <h2 className="mt-2 font-semibold text-slate-900">Reserva instantánea</h2>
            <p className="mt-1 text-sm text-slate-600">
              Los horarios disponibles se calculan en tiempo real según la agenda real del negocio.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-2xl">🔔</div>
            <h2 className="mt-2 font-semibold text-slate-900">Confirmación por email</h2>
            <p className="mt-1 text-sm text-slate-600">
              Recibes los detalles de tu cita al instante, y un aviso si se cancela o reprograma.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-2xl">🗂️</div>
            <h2 className="mt-2 font-semibold text-slate-900">Tus citas, siempre a mano</h2>
            <p className="mt-1 text-sm text-slate-600">
              Consulta tus próximas citas desde tu cuenta y cancélalas cuando lo necesites.
            </p>
          </div>
        </section>
      </main>
      <footer className="py-10 text-center text-sm text-slate-400">
        Sistema de Citas · Next.js + Neon + Resend · desplegable gratis en Vercel
      </footer>
    </>
  );
}
