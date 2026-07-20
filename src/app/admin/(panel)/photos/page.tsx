import { MediaManager } from "@/components/admin/MediaManager";

export default function AdminMediaPage() {
  return (
    <>
      <h1 className="adm-title">Photos</h1>
      <p className="adm-subtitle">
        Replace the images of the public page: Christina&apos;s portrait, the three service
        photos, the linktree avatar and the gallery.
      </p>
      <MediaManager />
    </>
  );
}
