-- ============================================================
-- Mensajes del formulario de contacto de la landing.
-- Mismo modelo de acceso que el resto: RLS deny-all para anon;
-- la escritura/lectura pasa por las API routes con service role.
-- ============================================================

create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null,
  last_name   text not null default '',
  email       text not null,
  reason      text not null default '',
  message     text not null default '',
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on contact_messages (created_at desc);

alter table contact_messages enable row level security;
