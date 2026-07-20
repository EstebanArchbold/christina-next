import "server-only";
import { createServiceClient } from "@/lib/supabase/admin";
import { DEFAULT_BOOKING_SETTINGS, type BookingSettings } from "@/types/domain";

export async function getBookingSettings(): Promise<BookingSettings> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase.from("settings").select("value").eq("key", "booking").maybeSingle();
    if (data?.value) return { ...DEFAULT_BOOKING_SETTINGS, ...data.value };
  } catch {
    // sin Supabase: defaults
  }
  return DEFAULT_BOOKING_SETTINGS;
}
