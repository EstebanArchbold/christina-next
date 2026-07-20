import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { createServiceClient } from "@/lib/supabase/admin";

const patchSchema = z.object({
  label: z.string().min(1).max(60).optional(),
  url: z.string().url().max(500).optional(),
  sort_order: z.number().int().optional(),
  active: z.boolean().optional(),
});

/** PATCH — edita, reordena o activa/desactiva un link. Solo admin. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const supabase = createServiceClient();
  const { error } = await supabase.from("links").update(parsed.data).eq("id", id);
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true });
}

/** DELETE — quita un link del linktree. Solo admin. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase.from("links").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true });
}
