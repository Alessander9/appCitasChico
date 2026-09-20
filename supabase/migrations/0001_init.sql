-- ============================================================================
-- Sistema de Citas · Esquema inicial (Supabase / Postgres)
-- Tablas, RLS, triggers y RPCs. Corre una sola vez (SQL Editor de Supabase).
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------

-- Perfil 1:1 con auth.users (nombre, avatar Cloudinary, rol)
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  name        text not null default '',
  avatar_url  text,
  role        text not null default 'client' check (role in ('client', 'admin')),
  created_at  timestamptz not null default now()
);

create table public.services (
  id           bigint generated always as identity primary key,
  name         text not null,
  description  text not null default '',
  duration_min int  not null default 30 check (duration_min between 10 and 240),
  price_cents  int,                        -- null = sin precio
  image_url    text,                       -- foto del servicio (Cloudinary)
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Horario semanal: 0=domingo .. 6=sábado
create table public.schedule (
  id           bigint generated always as identity primary key,
  weekday      int not null check (weekday between 0 and 6),
  start_minute int not null check (start_minute between 0 and 1439),
  end_minute   int not null check (end_minute between 1 and 1440),
  constraint schedule_range check (end_minute > start_minute),
  constraint schedule_unique unique (weekday, start_minute)
);

create table public.blocked_dates (
  date       text primary key check (date ~ '^\d{4}-\d{2}-\d{2}$'),
  reason     text not null default '',
  created_at timestamptz not null default now()
);

create table public.appointments (
  id           bigint generated always as identity primary key,
  user_id      uuid not null references auth.users (id) on delete cascade,
  service_id   bigint not null references public.services (id),
  date         text not null check (date ~ '^\d{4}-\d{2}-\d{2}$'),
  start_minute int  not null check (start_minute between 0 and 1439),
  status       text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  notes        text not null default '',
  created_at   timestamptz not null default now()
);

-- Evita doble reserva a nivel de base de datos (solo citas confirmadas)
create unique index appointments_slot_unique
  on public.appointments (date, start_minute)
  where status = 'confirmed';

create index appointments_user_idx on public.appointments (user_id);
create index appointments_date_idx on public.appointments (date);

-- Configuración clave/valor (zona horaria, branding con URLs de Cloudinary)
create table public.settings (
  key   text primary key,
  value jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- Helper: ¿el usuario actual es admin?
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Trigger: crear perfil automáticamente al registrarse en auth.users
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'client')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.profiles      enable row level security;
alter table public.services      enable row level security;
alter table public.schedule      enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.appointments  enable row level security;
alter table public.settings      enable row level security;

-- profiles: cada quien lee/edita lo suyo; admin lee/edita todo
create policy profiles_select on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy profiles_update on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- services: público ve activos; admin todo
create policy services_select on public.services
  for select using (active or public.is_admin());
create policy services_write on public.services
  for all using (public.is_admin());

-- schedule y blocked_dates: lectura pública (la agenda no es sensible)
create policy schedule_select on public.schedule
  for select using (true);
create policy schedule_write on public.schedule
  for all using (public.is_admin());

create policy blocked_select on public.blocked_dates
  for select using (true);
create policy blocked_write on public.blocked_dates
  for all using (public.is_admin());

-- appointments: solo lectura del propio (o admin).
-- Escrituras SOLO vía RPCs (book_appointment / cancel_appointment).
create policy appointments_select on public.appointments
  for select using (user_id = auth.uid() or public.is_admin());

-- settings: lectura pública, escritura admin
create policy settings_select on public.settings
  for select using (true);
create policy settings_write on public.settings
  for all using (public.is_admin());

-- ---------------------------------------------------------------------------
-- RPC: disponibilidad de un día (usada por la página pública de reserva)
-- Turnos de 30 min dentro del horario del día, menos bloqueos, reservas y pasados.
-- ---------------------------------------------------------------------------

create or replace function public.get_availability(p_date text)
returns table (start_minute int, available boolean)
language plpgsql stable security definer set search_path = public as $$
declare
  v_tz       text;
  v_today    date;
  v_now_min  int;
  v_wd       int;
  v_booked   int[];
  w          record;
  s          int;
begin
  select coalesce(value ->> 'tz', 'America/Mexico_City')
    into v_tz from public.settings where key = 'business';

  v_today   := (now() at time zone v_tz)::date;
  v_now_min := date_part('hour', (now() at time zone v_tz)::time)::int * 60
             + date_part('minute', (now() at time zone v_tz)::time)::int;
  v_wd      := extract(dow from p_date::date)::int;

  -- Día bloqueado: sin slots
  if exists (select 1 from public.blocked_dates where date = p_date) then
    return;
  end if;

  select coalesce(array_agg(a.start_minute), '{}')
    into v_booked
    from public.appointments a
   where a.date = p_date and a.status = 'confirmed';

  for w in select * from public.schedule where weekday = v_wd order by start_minute loop
    s := w.start_minute;
    while s + 30 <= w.end_minute loop
      if p_date::date > v_today or (p_date::date = v_today and s > v_now_min) then
        start_minute := s;
        available := not (s = any(v_booked));
        return next;
      end if;
      s := s + 30;
    end loop;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- RPC: reservar cita (valida y reserva; devuelve la fila creada)
-- ---------------------------------------------------------------------------

create or replace function public.book_appointment(
  p_service_id   bigint,
  p_date         text,
  p_start_minute int,
  p_notes        text default ''
)
returns public.appointments
language plpgsql volatile security definer set search_path = public as $$
declare
  v_tz      text;
  v_today   date;
  v_now_min int;
  v_svc     public.services;
  v_slot    record;
  v_row     public.appointments;
begin
  if auth.uid() is null then
    raise exception 'No autenticado';
  end if;

  select coalesce(value ->> 'tz', 'America/Mexico_City')
    into v_tz from public.settings where key = 'business';
  v_today   := (now() at time zone v_tz)::date;
  v_now_min := date_part('hour', (now() at time zone v_tz)::time)::int * 60
             + date_part('minute', (now() at time zone v_tz)::time)::int;

  select * into v_svc from public.services where id = p_service_id and active;
  if not found then
    raise exception 'Servicio no disponible';
  end if;

  if p_date::date < v_today or (p_date::date = v_today and p_start_minute <= v_now_min) then
    raise exception 'No puedes reservar un horario pasado';
  end if;

  if exists (select 1 from public.blocked_dates where date = p_date) then
    raise exception 'La fecha está bloqueada';
  end if;

  select * into v_slot
    from public.get_availability(p_date)
   where start_minute = p_start_minute;
  if not found then
    raise exception 'El horario no pertenece al horario de atención';
  end if;
  if not v_slot.available then
    raise exception 'El horario ya no está disponible';
  end if;

  insert into public.appointments (user_id, service_id, date, start_minute, notes, status)
  values (auth.uid(), p_service_id, p_date, p_start_minute, left(coalesce(p_notes, ''), 500), 'confirmed')
  returning * into v_row;

  return v_row;
end $$;

-- ---------------------------------------------------------------------------
-- RPC: cancelar cita (dueño o admin)
-- ---------------------------------------------------------------------------

create or replace function public.cancel_appointment(p_id bigint)
returns void
language plpgsql volatile security definer set search_path = public as $$
begin
  update public.appointments
     set status = 'cancelled'
   where id = p_id
     and status = 'confirmed'
     and (user_id = auth.uid() or public.is_admin());

  if not found then
    raise exception 'Cita no encontrada o ya cancelada';
  end if;
end $$;
