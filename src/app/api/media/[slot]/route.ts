import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { MEDIA_SLOTS } from "@/lib/content-schema";
import { createServiceClient } from "@/lib/supabase/admin";

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB (permite video de hero)
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];

/** POST — sube un archivo al slot y actualiza media_slots. Solo admin. */
export async function POST(request: Request, { params }: { params: Promise<{ slot: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { slot } = await params;
  const def = MEDIA_SLOTS.find((s) => s.slot === slot);
  if (!def) return jsonError(`Slot desconocido: ${slot}`, 404);

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return jsonError("Missing 'file' upload");
  if (file.size > MAX_BYTES) return jsonError("The file exceeds 50 MB");

  const allowed = def.accept === "video-or-image" ? [...IMAGE_TYPES, ...VIDEO_TYPES] : IMAGE_TYPES;
  if (!allowed.includes(file.type)) {
    return jsonError(`Tipo de archivo no permitido para este slot: ${file.type}`);
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `slots/${slot}-${Date.now()}.${ext}`;

  const supabase = createServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, buffer, { contentType: file.type });
  if (uploadError) return jsonError(uploadError.message, 500);

  const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
  const url = pub.publicUrl;

  const { error } = await supabase
    .from("media_slots")
    .upsert({ slot, url, updated_at: new Date().toISOString() });
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true, slot, url });
}

/** DELETE — vuelve al placeholder por defecto. Solo admin. */
export async function DELETE(_request: Request, { params }: { params: Promise<{ slot: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { slot } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase.from("media_slots").delete().eq("slot", slot);
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true });
}
