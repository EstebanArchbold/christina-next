import { LinksManager } from "@/components/admin/LinksManager";

export default function AdminLinksPage() {
  return (
    <>
      <h1 className="adm-title">Linktree</h1>
      <p className="adm-subtitle">
        Add, remove, hide or reorder the links on the /linktree page. They all share the same
        design.
      </p>
      <LinksManager />
    </>
  );
}
