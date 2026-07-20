import { createBrowserClient } from "@supabase/ssr";

/** Cliente de navegador (anon key). Lo usa el panel admin para auth. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
