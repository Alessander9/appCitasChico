# 📅 Sistema de Citas

Mini sistema de reserva de citas **full-stack** (frontend + backend en un solo proyecto de Next.js), diseñado para desplegarse **100% en Vercel** — sin cuentas externas.

## ✨ Funcionalidades

- **Página pública de reserva**: el cliente elige servicio → día → hora (disponibilidad en tiempo real).
- **Login/registro de clientes** con sesiones JWT en cookies httpOnly (jose + bcrypt).
- **Mis citas**: el cliente consulta sus próximas citas y puede cancelarlas.
- **Panel de administración** (`/admin`):
  - 📅 Citas: próximas / hoy / canceladas / todas, con cancelación (notifica al cliente).
  - 🛠️ Servicios: crear, editar, activar/desactivar, precio y duración.
  - 🕐 Horario semanal: rangos por día; los turnos se generan cada 30 min.
  - 🚫 Fechas bloqueadas: feriados y vacaciones.
  - **👥 Empleados**: opcional a futuro — hoy el admin gestiona todo (ver Notas).
- **Emails con Resend**: confirmación y cancelación (opcional; integrable desde Vercel).

## 🧱 Stack (todo gratis)

| Capa     | Tecnología                                   | Dónde                          |
| -------- | -------------------------------------------- | ------------------------------ |
| Frontend | Next.js 15 (App Router) + Tailwind CSS 4     | Vercel Hobby                   |
| Backend  | Route Handlers de Next.js (mismo proyecto)   | Vercel Hobby                   |
| DB       | Vercel Postgres (Neon por debajo)            | Vercel → Storage → Postgres    |
| Email    | Resend (integración de Vercel Marketplace)   | Vercel → Integrations          |
| Auth     | JWT (jose) en cookie httpOnly + bcryptjs     | —                              |
| ORM      | Drizzle ORM + drizzle-kit                    | —                              |

## 🚀 Despliegue 100% en Vercel

### 1. Sube el proyecto a GitHub

```bash
git init && git add . && git commit -m "Sistema de citas"
git remote add origin https://github.com/TU_USUARIO/sistema-citas.git
git push -u origin main
```

### 2. Importa el proyecto en Vercel

1. Entra a [vercel.com/new](https://vercel.com/new) e importa el repo (detecta Next.js automáticamente).
2. **No agregues nada más todavía** — primero despliega; el primer build puede fallar por falta de `AUTH_SECRET`, es normal.
3. Ve a **Settings → Environment Variables** y agrega:

   | Variable      | Valor                                     |
   | ------------- | ----------------------------------------- |
   | `AUTH_SECRET` | secreto aleatorio (ver comando abajo)     |
   | `BUSINESS_TZ` | `America/Mexico_City` (o tu zona)         |
   | `EMAIL_FROM`  | `Citas <onboarding@resend.dev>`           |
   | `ADMIN_EMAIL`    | email del admin (solo para el seed)       |
   | `ADMIN_PASSWORD` | contraseña del admin (solo para el seed)  |

   Genera el secreto:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### 3. Crea la base de datos en Vercel (Storage → Postgres)

1. En tu proyecto: pestaña **Storage** → **Create Database → Postgres (Neon)**.
2. Elige la región más cercana a tus usuarios.
3. Vercel crea la base e **inyecta `DATABASE_URL` automáticamente** en el proyecto. No copies nada a mano.

### 4. Crea las tablas y el admin

Con Vercel Postgres, la URL de producción vive en Vercel. Para crear tablas y seed desde tu máquina:

1. Copia `DATABASE_URL` desde **Settings → Environment Variables** (o del panel de Storage).
2. En local, crea `.env.local`:
   ```
   DATABASE_URL="pega aquí la URL de producción"
   AUTH_SECRET="cualquier valor para desarrollo"
   ```
3. Corre:
   ```bash
   npm install
   npm run db:push   # crea las tablas
   npm run db:seed   # admin + servicios + horario demo
   ```
   El seed crea el admin con las credenciales de `ADMIN_EMAIL`/`ADMIN_PASSWORD` que pongas en tu `.env.local` (por defecto `admin@demo.com` / `admin123` — cámbialas en producción).

> El seed es idempotente: puedes correrlo cuando quieras sin duplicar datos.

### 5. Redespliega

Haz push de un commit vacío o usa **Deployments → Redeploy** en Vercel. Con `DATABASE_URL` y `AUTH_SECRET` presentes, el build pasará y la app quedará viva en `https://tu-proyecto.vercel.app`.

### 6. (Opcional) Emails con la integración de Resend

1. En Vercel: tu proyecto → **Integrations → Browse Marketplace → Resend** → **Add Integration**.
2. Vercel inyecta `RESEND_API_KEY` automáticamente.
3. Sin dominio propio, usa el remitente de pruebas `onboarding@resend.dev` (solo envía a tu propio email). Con dominio: verifícalo en Resend y ajusta `EMAIL_FROM`.

> Si no agregas Resend, la app funciona igual; solo no envía emails.

## 🗺️ Rutas

| Ruta          | Acceso   | Descripción                              |
| ------------- | -------- | ---------------------------------------- |
| `/`           | público  | Landing                                  |
| `/reservar`   | público  | Flujo de reserva (servicio→día→hora)     |
| `/login`      | público  | Login / registro                         |
| `/mis-citas`  | cliente  | Próximas citas + cancelar                |
| `/admin`      | admin    | Panel: citas, servicios, horario, bloqueos |

## 🔌 API

| Método | Endpoint                     | Acceso  | Descripción                          |
| ------ | ---------------------------- | ------- | ------------------------------------ |
| POST   | `/api/auth/register`         | público | Registro de cliente                  |
| POST   | `/api/auth/login`            | público | Login                                |
| POST   | `/api/auth/logout`           | sesión  | Logout                               |
| GET    | `/api/auth/me`               | sesión  | Usuario actual                       |
| GET    | `/api/services`              | público | Servicios activos (todos si admin)   |
| POST   | `/api/services`              | admin   | Crear servicio                       |
| PATCH  | `/api/services/[id]`         | admin   | Editar servicio                      |
| DELETE | `/api/services/[id]`         | admin   | Desactivar servicio (soft delete)    |
| GET    | `/api/availability?date=`    | público | Slots de un día (YYYY-MM-DD)         |
| GET    | `/api/schedule`              | público | Horario semanal                      |
| PUT    | `/api/schedule`              | admin   | Reemplazar horario semanal           |
| GET    | `/api/blocked-dates`         | público | Fechas bloqueadas (futuras)          |
| POST   | `/api/blocked-dates`         | admin   | Bloquear fecha                       |
| DELETE | `/api/blocked-dates/[date]`  | admin   | Desbloquear fecha                    |
| POST   | `/api/appointments`          | sesión  | Reservar cita                        |
| GET    | `/api/appointments/mine`     | sesión  | Mis citas (`?scope=upcoming\|past`)  |
| DELETE | `/api/appointments/[id]`     | sesión  | Cancelar cita (admin: `?force=1`)    |
| GET    | `/api/admin/appointments`    | admin   | Todas las citas (`?filter=`)         |

## 🔒 Notas de seguridad

- Las contraseñas se guardan con bcrypt (10 rondas).
- Las sesiones son JWT firmados (HS256) en cookies `httpOnly`, `sameSite=lax`, `secure` en producción.
- Cada endpoint valida rol en el servidor (`requireUser` / `requireAdmin`).
- La disponibilidad se re-valida al reservar; un índice único parcial en `(date, start_minute)` donde `status='confirmed'` evita dobles reservas a nivel de base de datos.

## 🛠️ Desarrollo

```bash
npm run dev        # servidor de desarrollo
npm run typecheck  # verificación de tipos
npm run build      # build de producción
npm run db:push    # crear/actualizar tablas
npm run db:seed    # admin + servicios + horario demo
npm run db:studio  # explorador de datos
```
