import { AdmHead } from "@/components/admin/AdmHead";
import { NewsletterList } from "@/components/admin/NewsletterList";

export default function AdminNewsletterPage() {
  return (
    <>
      <AdmHead
        title="Newsletter"
        viewHref="/"
        viewLabel="View site"
        subtitle="People subscribed from the public page. Export the CSV to use it in your email tool."
      />
      <NewsletterList />
    </>
  );
}
