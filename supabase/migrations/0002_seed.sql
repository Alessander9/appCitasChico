-- ============================================================================
-- Seed demo: zona horaria, branding, servicios y horario semanal.
-- Idempotente. Corre después de 0001_init.sql (SQL Editor de Supabase).
-- ============================================================================

insert into public.settings (key, value) values
  ('business', '{"tz": "America/Mexico_City"}'::jsonb),
  ('branding', '{"logo_url": null, "hero_url": null}'::jsonb)
on conflict (key) do nothing;

insert into public.services (name, description, duration_min, price_cents)
select * from (values
  ('Consulta general',   'Sesión estándar de 30 minutos',        30, 30000),
  ('Consulta extendida', 'Sesión de 1 hora a fondo',             60, 50000),
  ('Valoración inicial', 'Primera visita, diagnóstico y plan',   45, null::int)
) as v(name, description, duration_min, price_cents)
where not exists (select 1 from public.services);

-- L-V 9:00-14:00 y 15:00-18:00 · Sáb 9:00-13:00
insert into public.schedule (weekday, start_minute, end_minute)
select w.weekday, w.start_minute, w.end_minute
from (values
  (1, 540, 840), (1, 900, 1080),
  (2, 540, 840), (2, 900, 1080),
  (3, 540, 840), (3, 900, 1080),
  (4, 540, 840), (4, 900, 1080),
  (5, 540, 840), (5, 900, 1080),
  (6, 540, 780)
) as w(weekday, start_minute, end_minute)
where not exists (select 1 from public.schedule);
