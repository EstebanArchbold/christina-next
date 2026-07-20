import { EventsManager } from "@/components/admin/EventsManager";

export default function AdminEventsPage() {
  return (
    <>
      <h1 className="adm-title">Events</h1>
      <p className="adm-subtitle">
        Add new events or cancel existing ones. Only active, upcoming events appear on the public
        site.
      </p>
      <EventsManager />
    </>
  );
}
