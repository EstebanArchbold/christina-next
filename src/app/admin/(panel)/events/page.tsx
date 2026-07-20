import { AdmHead } from "@/components/admin/AdmHead";
import { EventsManager } from "@/components/admin/EventsManager";

export default function AdminEventsPage() {
  return (
    <>
      <AdmHead
        title="Events"
        viewHref="/"
        viewLabel="View site"
        subtitle="Add new events or cancel existing ones. Only active, upcoming events appear on the public site."
      />
      <EventsManager />
    </>
  );
}
