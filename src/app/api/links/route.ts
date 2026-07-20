import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { createServiceClient } from "@/lib/supabase/admin";

const linkSchema = z.object({
  label: z.string().min(1, "Link label is required").max(60),
  url: z.string().url("Invalid URL").max(500),
});

/** GET — todos los links (para el admin). Solo admin. */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ links: data });
}

/** POST — agrega un link al linktree. Solo admin. */
export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = linkSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const supabase = createServiceClient();
  const { data: last } = await supabase
    .from("links")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("links")
    .insert({ ...parsed.data, sort_order: (last?.sort_order ?? 0) + 1 })
    .select()
    .single();
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true, link: data });
}
