import { NewsletterList } from "@/components/admin/NewsletterList";

export default function AdminNewsletterPage() {
  return (
    <>
      <h1 className="adm-title">Newsletter</h1>
      <p className="adm-subtitle">
        People subscribed from the public page. Export the CSV to use it in your email tool.
      </p>
      <NewsletterList />
    </>
  );
}
