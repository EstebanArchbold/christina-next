import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-helpers";
import { createServiceClient } from "@/lib/supabase/admin";

/** GET — todos los slots de medios con su URL actual. Solo admin. */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const supabase = createServiceClient();
    const { data } = await supabase.from("media_slots").select("slot,url");
    return NextResponse.json({
      slots: Object.fromEntries((data ?? []).map((r) => [r.slot, r.url])),
    });
  } catch {
    return NextResponse.json({ slots: {} });
  }
}
