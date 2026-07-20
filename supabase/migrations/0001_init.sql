-- ============================================================
-- Site Template — schema inicial
-- Todo el acceso de escritura pasa por las API routes de Next
-- con el service role; RLS queda activado sin políticas (deny-all
-- para el anon key).
-- ============================================================

create extension if not exists "pgcrypto";

-- ── Textos editables de la página pública ──
create table if not exists site_content (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now()
);

-- ── Fotos/medios de posiciones fijas (hero, about, avatar…) ──
create table if not exists media_slots (
  slot        text primary key,
  url         text not null,
  updated_at  timestamptz not null default now()
);

-- ── Galería (lista dinámica) ──
create table if not exists gallery_images (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  alt         text not null default '',
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ── Blog ──
create table if not exists blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text not null default '',
  content      text not null default '',
  cover_url    text,
  published    boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── Eventos próximos ──
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  location    text not null default '',
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  status      text not null default 'active' check (status in ('active', 'cancelled')),
  created_at  timestamptz not null default now()
);

-- ── Linktree ──
create table if not exists links (
  id          uuid primary key default gen_random_uuid(),
  label       text not null,
  url         text not null,
  sort_order  int  not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── Reservas / bookings ──
create table if not exists bookings (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  phone           text not null default '',
  date            date not null,
  start_time      text not null,  -- "HH:MM"
  end_time        text not null,  -- "HH:MM"
  notes           text not null default '',
  status          text not null default 'pending'
                  check (status in ('pending', 'confirmed', 'cancelled')),
  google_event_id text,
  created_at      timestamptz not null default now()
);

create index if not exists bookings_date_idx on bookings (date);

-- ── Newsletter ──
create table if not exists newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- ── Configuración (disponibilidad de reservas, etc.) ──
create table if not exists settings (
  key    text primary key,
  value  jsonb not null
);

-- Config por defecto de reservas: días abiertos (0=domingo), horario y duración
insert into settings (key, value) values (
  'booking',
  '{
    "openDays": [1, 2, 3, 4, 5, 6],
    "openTime": "09:00",
    "closeTime": "18:00",
    "slotMinutes": 60,
    "maxPerSlot": 1
  }'::jsonb
) on conflict (key) do nothing;

-- ── RLS: deny-all para anon (el service role lo salta) ──
alter table site_content            enable row level security;
alter table media_slots             enable row level security;
alter table gallery_images          enable row level security;
alter table blog_posts              enable row level security;
alter table events                  enable row level security;
alter table links                   enable row level security;
alter table bookings                enable row level security;
alter table newsletter_subscribers  enable row level security;
alter table settings                enable row level security;

-- ── Storage: bucket público para las fotos ──
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
