import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { createServiceClient } from "@/lib/supabase/admin";

const patchSchema = z.object({
  read: z.boolean(),
});

/** PATCH — marcar leído/no leído. Solo admin. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ read: parsed.data.read })
    .eq("id", id);
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true });
}

/** DELETE — eliminar un mensaje. Solo admin. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true });
}
