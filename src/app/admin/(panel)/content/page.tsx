import { AdmHead } from "@/components/admin/AdmHead";
import { ContentEditor } from "@/components/admin/ContentEditor";

export default function AdminContentPage() {
  return (
    <>
      <AdmHead
        title="Site content"
        viewHref="/"
        viewLabel="View site"
        subtitle="Edit the copy of the public page. Each field has a character limit so the design never breaks."
      />
      <ContentEditor />
    </>
  );
}
