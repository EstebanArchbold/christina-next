import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Verifica que el request venga de un admin logueado (sesión Supabase).
 * Devuelve null si está autorizado, o una respuesta 401 lista para retornar.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return null;
  } catch {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
