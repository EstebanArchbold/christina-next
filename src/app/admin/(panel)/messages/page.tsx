import { AdmHead } from "@/components/admin/AdmHead";
import { MessagesManager } from "@/components/admin/MessagesManager";

export default function AdminMessagesPage() {
  return (
    <>
      <AdmHead
        title="Messages"
        viewHref="/#contact"
        viewLabel="View contact form"
        subtitle="Messages sent from the contact form on the public page. Click a message to read it in full."
      />
      <MessagesManager />
    </>
  );
}
