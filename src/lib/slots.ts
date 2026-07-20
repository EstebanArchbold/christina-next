import type { Booking, BookingSettings } from "@/types/domain";

/** "HH:MM" → minutos desde medianoche */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** minutos desde medianoche → "HH:MM" */
export function toHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export interface Slot {
  start: string;
  end: string;
  available: boolean;
}

/**
 * Calcula los slots de un día según la configuración y las reservas
 * existentes (pending + confirmed cuentan como ocupadas).
 */
export function computeSlots(
  dateISO: string,
  settings: BookingSettings,
  bookings: Pick<Booking, "start_time" | "status">[],
): Slot[] {
  const day = new Date(`${dateISO}T12:00:00`).getDay();
  if (!settings.openDays.includes(day)) return [];

  const open = toMinutes(settings.openTime);
  const close = toMinutes(settings.closeTime);
  const step = settings.slotMinutes;

  const taken = new Map<string, number>();
  for (const b of bookings) {
    if (b.status === "cancelled") continue;
    taken.set(b.start_time, (taken.get(b.start_time) ?? 0) + 1);
  }

  const slots: Slot[] = [];
  for (let t = open; t + step <= close; t += step) {
    const start = toHHMM(t);
    slots.push({
      start,
      end: toHHMM(t + step),
      available: (taken.get(start) ?? 0) < settings.maxPerSlot,
    });
  }
  return slots;
}
