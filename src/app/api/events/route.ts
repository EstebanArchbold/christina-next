import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { createServiceClient } from "@/lib/supabase/admin";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(90),
  description: z.string().max(500).default(""),
  location: z.string().max(120).default(""),
  starts_at: z.string().min(1, "Start date is required"),
  ends_at: z.string().nullable().optional(),
});

/** GET — todos los eventos (para el admin). Solo admin. */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: false });
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ events: data });
}

/** POST — crea un evento. Solo admin. */
export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("events")
    .insert({ ...parsed.data, ends_at: parsed.data.ends_at ?? null })
    .select()
    .single();
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true, event: data });
}
