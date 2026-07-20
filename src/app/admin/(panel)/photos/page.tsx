import { AdmHead } from "@/components/admin/AdmHead";
import { MediaManager } from "@/components/admin/MediaManager";

export default function AdminMediaPage() {
  return (
    <>
      <AdmHead
        title="Photos"
        viewHref="/"
        viewLabel="View site"
        subtitle="Replace the images of the public page: Christina's portrait, the three service photos, the linktree avatar and the gallery."
      />
      <MediaManager />
    </>
  );
}
