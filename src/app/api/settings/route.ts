import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { getBookingSettings } from "@/lib/settings";
import { createServiceClient } from "@/lib/supabase/admin";

const bookingSettingsSchema = z
  .object({
    openDays: z.array(z.number().int().min(0).max(6)).min(1, "Pick at least one open day"),
    openTime: z.string().regex(/^\d{2}:\d{2}$/),
    closeTime: z.string().regex(/^\d{2}:\d{2}$/),
    slotMinutes: z.number().int().min(15).max(480),
    maxPerSlot: z.number().int().min(1).max(100),
  })
  .refine((s) => s.openTime < s.closeTime, {
    message: "Opening time must be before closing time",
  });

/** GET — configuración de reservas. Solo admin. */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  return NextResponse.json({ booking: await getBookingSettings() });
}

/** PUT — guarda la configuración de reservas. Solo admin. */
export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = bookingSettingsSchema.safeParse(body?.booking);
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("settings")
    .upsert({ key: "booking", value: parsed.data });
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true });
}
