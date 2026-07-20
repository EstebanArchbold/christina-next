import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { createServiceClient } from "@/lib/supabase/admin";

/** PATCH — actualiza alt o el orden. Solo admin. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return jsonError("Invalid JSON");

  const patch: Record<string, unknown> = {};
  if (typeof body.alt === "string") patch.alt = body.alt.slice(0, 200);
  if (typeof body.sort_order === "number") patch.sort_order = body.sort_order;
  if (Object.keys(patch).length === 0) return jsonError("Nothing to update");

  const supabase = createServiceClient();
  const { error } = await supabase.from("gallery_images").update(patch).eq("id", id);
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true });
}

/** DELETE — elimina la imagen. Solo admin. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true });
}
