import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { deleteCalendarEvent } from "@/lib/google-calendar";
import { createServiceClient } from "@/lib/supabase/admin";

const patchSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

/**
 * PATCH — cambia el estado de una reserva. Solo admin.
 * Al cancelar, también elimina el evento de Google Calendar.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const supabase = createServiceClient();
  const { data: booking, error } = await supabase
    .from("bookings")
    .update({ status: parsed.data.status })
    .eq("id", id)
    .select()
    .single();
  if (error) return jsonError(error.message, 500);

  if (parsed.data.status === "cancelled" && booking.google_event_id) {
    await deleteCalendarEvent(booking.google_event_id);
    await supabase.from("bookings").update({ google_event_id: null }).eq("id", id);
    booking.google_event_id = null;
  }

  return NextResponse.json({ ok: true, booking });
}
