import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { CONTENT_DEFAULTS, getField } from "@/lib/content-schema";
import { createServiceClient } from "@/lib/supabase/admin";

/** GET — contenido actual (defaults + overrides guardados). Público. */
export async function GET() {
  const merged = { ...CONTENT_DEFAULTS };
  try {
    const supabase = createServiceClient();
    const { data } = await supabase.from("site_content").select("key,value");
    for (const row of data ?? []) {
      if (row.key in merged && row.value.trim() !== "") merged[row.key] = row.value;
    }
  } catch {
    // defaults
  }
  return NextResponse.json({ content: merged });
}

/**
 * PUT — guarda textos. Solo admin.
 * Body: { values: { "hero.body": "…", … } }
 * Valida cada clave contra el schema y su maxLength.
 */
export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: { values?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON");
  }

  const values = body.values;
  if (!values || typeof values !== "object") return jsonError("Missing 'values'");

  const rows: { key: string; value: string; updated_at: string }[] = [];
  for (const [key, raw] of Object.entries(values)) {
    const field = getField(key);
    if (!field) return jsonError(`Unknown field: ${key}`);
    if (typeof raw !== "string") return jsonError(`Field ${key} must be text`);
    if (raw.length > field.maxLength) {
      return jsonError(
        `"${field.label}" exceeds the maximum of ${field.maxLength} characters (it has ${raw.length}).`,
      );
    }
    rows.push({ key, value: raw, updated_at: new Date().toISOString() });
  }

  if (rows.length === 0) return jsonError("Nothing to save");

  const supabase = createServiceClient();
  const { error } = await supabase.from("site_content").upsert(rows);
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true, saved: rows.length });
}
