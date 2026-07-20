import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-helpers";
import { getBookingSettings } from "@/lib/settings";
import { computeSlots } from "@/lib/slots";
import { createServiceClient } from "@/lib/supabase/admin";

/** GET ?date=YYYY-MM-DD — slots del día con disponibilidad. Público. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return jsonError("Invalid 'date' parameter (YYYY-MM-DD)");
  }

  const settings = await getBookingSettings();

  let bookings: { start_time: string; status: string }[] = [];
  try {
    const supabase = createServiceClient();
    const { data } = await supabase.from("bookings").select("start_time,status").eq("date", date);
    bookings = data ?? [];
  } catch {
    // sin Supabase: todos los slots libres
  }

  return NextResponse.json({
    date,
    openDays: settings.openDays,
    slots: computeSlots(date, settings, bookings as never),
  });
}
