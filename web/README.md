# 📅 Sistema de Citas · React + Supabase + Cloudinary + Vercel

Versión SPA del sistema de citas. El frontend vive en `web/`; el backend es tu propio proyecto de Supabase (Postgres + Auth + RLS + Edge Function).

## 🧱 Arquitectura

| Capa        | Tecnología                                      | Gratis            |
| ----------- | ----------------------------------------------- | ----------------- |
| Frontend    | React 19 + Vite + react-router                  | Vercel Hobby      |
| Base de datos | Postgres en Supabase                          | Supabase Free     |
| Auth        | Supabase Auth (email/password)                  | Supabase Free     |
| Seguridad   | Row Level Security + RPCs (`book_appointment`)  | —                 |
| Imágenes    | Cloudinary (upload unsigned)                    | Cloudinary Free   |
| Emails      | Edge Function + Resend                          | Resend Free       |

```
web/                          ← SPA React (esta carpeta)
supabase/migrations/          ← SQL: tablas, RLS, RPCs, seed
supabase/functions/send-booking-email/  ← Edge Function (Resend)
```

## 🚀 Setup paso a paso

### 1. Supabase (base de datos + auth)

1. Crea un proyecto en [supabase.com](https://supabase.com) (free tier, sin tarjeta).
2. Abre **SQL Editor** y corre el contenido de:
   - `supabase/migrations/0001_init.sql` (tablas, RLS, triggers, RPCs)
   - `supabase/migrations/0002_seed.sql` (servicios + horario + settings demo)
3. **Crea tu usuario admin**: en la app web regístrate normalmente, luego en SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'tu-email@ejemplo.com';
   ```
4. *(Opcional, recomendado en producción)*: en **Authentication → Providers → Email**, activa "Confirm email".

### 2. Cloudinary (imágenes)

1. Crea cuenta gratuita en [cloudinary.com](https://cloudinary.com) y copia tu **Cloud name** (Dashboard).
2. Ve a **Settings → Upload → Upload presets** → crea uno nuevo en modo **Unsigned** (p. ej. `citas_unsigned`).
3. Con eso, la app puede subir avatares, fotos de servicios, logo y hero sin backend propio.

> Las URLs de Cloudinary soportan transformaciones en caliente: la app pide recortes cuadrados para avatares (`c_fill,g_face`) y versiones optimizadas (`q_auto,f_auto`) sin guardar varias copias.

### 3. Configura el frontend

```bash
cd web
npm install
cp .env.example .env.local
```

Llena `.env.local` con los valores de **Supabase → Project Settings → API** y de Cloudinary:

```
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=citas_unsigned
```

Prueba en local:

```bash
npm run dev
```

### 4. Emails (opcional): Edge Function + Resend

```bash
npm install -g supabase
supabase login
supabase link --project-ref TU_REF   # de Project Settings → General
supabase secrets set RESEND_API_KEY=re_xxx
supabase secrets set EMAIL_FROM="Citas <onboarding@resend.dev>"
supabase functions deploy send-booking-email
```

- Sin dominio propio, `onboarding@resend.dev` solo puede enviarte emails a ti (modo pruebas de Resend).
- Si la función no está desplegada (o no hay API key), la app funciona igual; simplemente no hay emails.

### 5. Deploy en Vercel

1. Sube el repo a GitHub.
2. En [vercel.com/new](https://vercel.com/new), importa el repo.
3. En **Settings → General → Root Directory** pon `web`.
4. Framework: **Vite** (autodetectado). Build `npm run build`, output `dist`.
5. En **Environment Variables** agrega las 4 variables `VITE_*` (las mismas del `.env.local`).
6. Deploy → tu app quedará en `https://tu-proyecto.vercel.app`.

> `web/vercel.json` ya incluye el rewrite SPA para que `/reservar`, `/mis-citas`, etc. funcionen al refrescar.

## 🗺️ Rutas

| Ruta         | Acceso  | Descripción                                        |
| ------------ | ------- | -------------------------------------------------- |
| `/`          | público | Landing con logo/hero (Cloudinary)                 |
| `/reservar`  | público | Reserva: servicio (con foto) → día → hora          |
| `/login`     | público | Login / registro                                   |
| `/mis-citas` | sesión  | Próximas citas + cancelar                          |
| `/perfil`    | sesión  | Nombre + avatar (upload a Cloudinary)              |
| `/admin`     | admin   | Citas, servicios+foto, horario, bloqueos, apariencia |

## 🔒 Seguridad

- **RLS en todas las tablas**: cada usuario solo lee sus citas/perfil; el catálogo público solo ve servicios activos.
- Las escrituras de citas van **exclusivamente por RPCs** (`book_appointment` valida disponibilidad de nuevo y hace upsert seguro; hay índice único parcial contra dobles reservas).
- El rol admin se valida en SQL (`is_admin()`), no en el cliente.
- El cliente nunca ve la service role key; solo la anon key + políticas RLS.

## 🛠️ Desarrollo

```bash
cd web
npm run dev        # Vite dev server
npm run typecheck  # tsc
npm run build      # build de producción
```
