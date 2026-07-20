import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { CONTENT_DEFAULTS } from "@/lib/content-schema";
import { createCalendarEvent } from "@/lib/google-calendar";
import { getBookingSettings } from "@/lib/settings";
import { computeSlots } from "@/lib/slots";
import { createServiceClient } from "@/lib/supabase/admin";

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required").max(90),
  email: z.string().email("Invalid email address").max(200),
  phone: z.string().max(30).default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  start: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  notes: z.string().max(500).default(""),
});

/** GET — lista de reservas. Solo admin. Filtros: ?from=YYYY-MM-DD&status= */
export async function GET(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const status = url.searchParams.get("status");

  const supabase = createServiceClient();
  let query = supabase
    .from("bookings")
    .select("*")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });
  if (from) query = query.gte("date", from);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ bookings: data });
}

/** POST — crea una reserva (público) y el evento en Google Calendar. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const { name, email, phone, date, start, notes } = parsed.data;

  // No permitir reservas en el pasado
  if (date < new Date().toISOString().slice(0, 10)) {
    return jsonError("You can't book a date in the past");
  }

  const settings = await getBookingSettings();
  const supabase = createServiceClient();

  // Validar contra los slots reales del día (día abierto, hora válida, cupo)
  const { data: existing, error: existingError } = await supabase
    .from("bookings")
    .select("start_time,status")
    .eq("date", date);
  if (existingError) return jsonError(existingError.message, 500);

  const slot = computeSlots(date, settings, existing ?? []).find((s) => s.start === start);
  if (!slot) return jsonError("That time doesn't exist for the chosen day");
  if (!slot.available) return jsonError("That time is no longer available");

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      name,
      email,
      phone,
      date,
      start_time: slot.start,
      end_time: slot.end,
      notes,
    })
    .select()
    .single();
  if (error) return jsonError(error.message, 500);

  // Google Calendar (best-effort: la reserva ya quedó guardada)
  let siteName = CONTENT_DEFAULTS["site.name"];
  const { data: nameRow } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "site.name")
    .maybeSingle();
  if (nameRow?.value) siteName = nameRow.value;

  const googleEventId = await createCalendarEvent(booking, siteName);
  if (googleEventId) {
    await supabase.from("bookings").update({ google_event_id: googleEventId }).eq("id", booking.id);
  }

  return NextResponse.json({ ok: true, booking: { ...booking, google_event_id: googleEventId } });
}
