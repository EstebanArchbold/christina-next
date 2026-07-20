import { AdmHead } from "@/components/admin/AdmHead";
import { BookingsManager } from "@/components/admin/BookingsManager";

export default function AdminBookingsPage() {
  return (
    <>
      <AdmHead
        title="Bookings & calendar"
        viewHref="/book"
        viewLabel="View booking page"
        subtitle="Set your availability, see who booked, and confirm or cancel. Each booking syncs with Google Calendar when configured."
      />
      <BookingsManager />
    </>
  );
}
