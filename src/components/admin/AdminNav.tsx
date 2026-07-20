"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/links", label: "Linktree" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/newsletter", label: "Newsletter" },
] as const;

export function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <>
      <nav className="adm-nav" aria-label="Admin navigation">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`adm-nav-link ${pathname === link.href ? "is-active" : ""}`}
            aria-current={pathname === link.href ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="adm-side-footer">
        <div className="adm-side-user" title={userEmail}>
          {userEmail}
        </div>
        <button type="button" className="adm-signout" onClick={signOut}>
          Sign out
        </button>
      </div>
    </>
  );
}
