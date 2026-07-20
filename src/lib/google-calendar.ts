import "server-only";
import { google } from "googleapis";
import type { Booking } from "@/types/domain";

/**
 * Integración con Google Calendar (portada de smileyfaces).
 * Si las variables de entorno no están configuradas, todo degrada en
 * silencio: las reservas siguen funcionando solo con la base de datos.
 */

const TIMEZONE = process.env.SITE_TIMEZONE || "America/Bogota";

export function isCalendarConfigured(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN &&
    process.env.GOOGLE_CALENDAR_ID &&
    process.env.GOOGLE_CLIENT_ID !== "your-google-client-id"
  );
}

function getCalendarClient() {
  if (!isCalendarConfigured()) return null;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  return google.calendar({ version: "v3", auth: oauth2Client });
}

export async function createCalendarEvent(
  booking: Pick<Booking, "name" | "email" | "phone" | "date" | "start_time" | "end_time" | "notes">,
  siteName: string,
): Promise<string | null> {
  const calendar = getCalendarClient();
  if (!calendar) {
    console.log("[Google Calendar] No configurado — se omite la creación del evento.");
    return null;
  }

  try {
    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      requestBody: {
        summary: `${siteName} — Reserva — ${booking.name}`,
        description: [
          `Cliente: ${booking.name}`,
          `Email: ${booking.email}`,
          `Teléfono: ${booking.phone || "N/A"}`,
          `Notas: ${booking.notes || "Ninguna"}`,
        ].join("\n"),
        start: { dateTime: `${booking.date}T${booking.start_time}:00`, timeZone: TIMEZONE },
        end: { dateTime: `${booking.date}T${booking.end_time}:00`, timeZone: TIMEZONE },
      },
    });

    console.log(`[Google Calendar] Evento creado: ${event.data.id}`);
    return event.data.id ?? null;
  } catch (error) {
    console.error("[Google Calendar] Falló la creación del evento:", error);
    return null;
  }
}

export async function deleteCalendarEvent(googleEventId: string): Promise<void> {
  const calendar = getCalendarClient();
  if (!calendar) return;

  try {
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      eventId: googleEventId,
    });
    console.log(`[Google Calendar] Evento eliminado: ${googleEventId}`);
  } catch (error) {
    console.error("[Google Calendar] Falló la eliminación del evento:", error);
  }
}
