import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { getContent } from "@/lib/content";
import { createServerSupabase } from "@/lib/supabase/server";
import "@/components/admin/admin.css";

export const metadata: Metadata = {
  title: "Admin panel",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // el middleware ya protege esta zona; leemos el usuario solo para mostrarlo
  let email = "";
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? "";
  } catch {
    // Supabase sin configurar — las páginas muestran guía
  }

  const content = await getContent();

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <Link href="/" className="adm-side-wordmark">
          {content["site.name"]}
        </Link>
        <div className="adm-side-label">Admin panel</div>
        <AdminNav userEmail={email} />
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
