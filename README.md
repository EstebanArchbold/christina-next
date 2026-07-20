# Christina Abounassar — Executive Therapy Toronto (Next.js)

Port a Next.js del sitio WordPress `christina-therapy`, montado sobre el **Template**
(Next.js + Supabase). La landing replica el diseño "Nocturnal" de
`christina-therapy/app/public/design-reference/` y **todos sus textos y fotos se editan
desde `/admin`** (el "WordPress simplificado" del Template).

## Qué cambió respecto al Template

- **`src/lib/content-schema.ts`** — reescrito con ~86 campos: Hero, About, Servicios (×3),
  Beneficios (×3 + franja "expect"), Reservas, Testimonios (×4, se ocultan dejando la cita
  vacía), Contacto y Footer. Media slots: retrato About, 3 fotos de servicios, avatar linktree.
- **`src/components/landing/christina/`** — componentes de la landing (Hero con starfield/orbs/
  horizon, About, Services, Benefits, Booking, Testimonials con carrusel, Contact, Footer,
  reveal-on-scroll). Estilos en `src/components/landing/christina.css`, scopeados bajo `.et`.
- **Booking** — la sección usa el widget nativo del Template (`BookingFlow` → Supabase +
  Google Calendar opcional), gestionado desde `/admin/bookings`, en lugar del embed de
  Calendly del sitio WordPress. La página dedicada quedó en `/book`.
- **Mensajes de contacto** — nuevo: tabla `contact_messages`
  (`supabase/migrations/0002_contact_messages.sql`), API `/api/contact` y bandeja en
  `/admin/messages` (reemplaza a Fluent Forms).
- **Fuentes** — Fraunces + Inter + JetBrains Mono vía `next/font`. `lang="en"`.
- **Todo en inglés** — tanto el sitio público como el panel admin (UI, rutas
  `/admin/content|photos|events|bookings|messages`, mensajes de error de las API).
  Los comentarios del código siguen en español (son para el dev).
- Blog (`/blog`) y Linktree (`/linktree`) del Template quedan disponibles (equivalen al
  "Journal" del sitio WordPress).

## Setup

1. `npm install`
2. `.env` — este proyecto **comparte por ahora el Supabase del Template** (copiado tal cual).
   Para producción crea un proyecto Supabase propio y actualiza
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`.
3. **Pendiente obligatorio**: ejecutar en el SQL editor de Supabase las migraciones
   `supabase/migrations/0001_init.sql` (si el proyecto es nuevo) y
   **`0002_contact_messages.sql`** (sin ella el formulario de contacto devuelve 500).
4. `npm run dev` → landing en `http://localhost:3000`, panel en `/admin`.

## Referencia de diseño

La fuente de verdad visual sigue siendo
`christina-therapy/app/public/design-reference/` (HTML + JSX + CSS) y el `BRIEF.md`
del proyecto WordPress (paleta, tipografía, contenido de secciones).
