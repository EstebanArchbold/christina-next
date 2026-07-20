import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { createServiceClient } from "@/lib/supabase/admin";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const MAX_BYTES = 15 * 1024 * 1024;

/** GET — todas las imágenes de la galería. */
export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) return jsonError(error.message, 500);
    return NextResponse.json({ images: data });
  } catch {
    return NextResponse.json({ images: [] });
  }
}

/** POST — sube una imagen nueva a la galería. Solo admin. */
export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const form = await request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") ?? "");
  if (!(file instanceof File)) return jsonError("Missing 'file' upload");
  if (file.size > MAX_BYTES) return jsonError("The image exceeds 15 MB");
  if (!IMAGE_TYPES.includes(file.type)) return jsonError(`Tipo no permitido: ${file.type}`);

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `gallery/${Date.now()}.${ext}`;

  const supabase = createServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, buffer, { contentType: file.type });
  if (uploadError) return jsonError(uploadError.message, 500);

  const { data: pub } = supabase.storage.from("media").getPublicUrl(path);

  const { data: last } = await supabase
    .from("gallery_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("gallery_images")
    .insert({ url: pub.publicUrl, alt, sort_order: (last?.sort_order ?? 0) + 1 })
    .select()
    .single();
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true, image: data });
}
