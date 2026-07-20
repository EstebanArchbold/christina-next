import { AdmHead } from "@/components/admin/AdmHead";
import { BlogManager } from "@/components/admin/BlogManager";

export default function AdminBlogPage() {
  return (
    <>
      <AdmHead
        title="Blog"
        viewHref="/blog"
        subtitle="Create, edit and publish posts. Drafts are not visible on the public site."
      />
      <BlogManager />
    </>
  );
}
