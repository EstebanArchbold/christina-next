import { ContentEditor } from "@/components/admin/ContentEditor";

export default function AdminContentPage() {
  return (
    <>
      <h1 className="adm-title">Site content</h1>
      <p className="adm-subtitle">
        Edit the copy of the public page. Each field has a character limit so the design never
        breaks.
      </p>
      <ContentEditor />
    </>
  );
}
