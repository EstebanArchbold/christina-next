import { BlogManager } from "@/components/admin/BlogManager";

export default function AdminBlogPage() {
  return (
    <>
      <h1 className="adm-title">Blog</h1>
      <p className="adm-subtitle">
        Create, edit and publish posts. Drafts are not visible on the public site.
      </p>
      <BlogManager />
    </>
  );
}
