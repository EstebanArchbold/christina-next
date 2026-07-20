import { AdmHead } from "@/components/admin/AdmHead";
import { LinksManager } from "@/components/admin/LinksManager";

export default function AdminLinksPage() {
  return (
    <>
      <AdmHead
        title="Linktree"
        viewHref="/linktree"
        subtitle="Add, remove, hide or reorder the links on the /linktree page. They all share the same design."
      />
      <LinksManager />
    </>
  );
}
