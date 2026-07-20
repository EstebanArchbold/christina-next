import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { createServiceClient } from "@/lib/supabase/admin";

const patchSchema = z.object({
  title: z.string().min(1).max(90).optional(),
  description: z.string().max(500).optional(),
  location: z.string().max(120).optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().nullable().optional(),
  status: z.enum(["active", "cancelled"]).optional(),
});

/** PATCH — edita o cancela/reactiva un evento. Solo admin. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("events")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true, event: data });
}

/** DELETE — elimina un evento definitivamente. Solo admin. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true });
}
