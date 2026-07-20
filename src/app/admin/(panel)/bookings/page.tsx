import { BookingsManager } from "@/components/admin/BookingsManager";

export default function AdminBookingsPage() {
  return (
    <>
      <h1 className="adm-title">Bookings &amp; calendar</h1>
      <p className="adm-subtitle">
        Set your availability, see who booked, and confirm or cancel. Each booking syncs with
        Google Calendar when configured.
      </p>
      <BookingsManager />
    </>
  );
}
