import { MessagesManager } from "@/components/admin/MessagesManager";

export default function AdminMessagesPage() {
  return (
    <>
      <h1 className="adm-title">Messages</h1>
      <p className="adm-subtitle">
        Messages sent from the contact form on the public page. Click a message to read it in
        full.
      </p>
      <MessagesManager />
    </>
  );
}
