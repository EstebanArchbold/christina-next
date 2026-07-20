import Link from "next/link";
import { AdmHead } from "@/components/admin/AdmHead";
import { createServiceClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function getCounts() {
  try {
    const supabase = createServiceClient();
    const today = new Date().toISOString().slice(0, 10);

    const [bookings, events, posts, subscribers, links] = await Promise.all([
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .gte("date", today)
        .neq("status", "cancelled"),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("status", "active")
        .gte("starts_at", new Date().toISOString()),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("published", true),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      supabase.from("links").select("id", { count: "exact", head: true }).eq("active", true),
    ]);

    return {
      ok: true,
      bookings: bookings.count ?? 0,
      events: events.count ?? 0,
      posts: posts.count ?? 0,
      subscribers: subscribers.count ?? 0,
      links: links.count ?? 0,
    };
  } catch {
    return { ok: false, bookings: 0, events: 0, posts: 0, subscribers: 0, links: 0 };
  }
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  const stats = [
    { label: "Upcoming bookings", value: counts.bookings, href: "/admin/bookings", accent: true },
    { label: "Active events", value: counts.events, href: "/admin/events" },
    { label: "Published posts", value: counts.posts, href: "/admin/blog" },
    { label: "Subscribers", value: counts.subscribers, href: "/admin/newsletter" },
    { label: "Active links", value: counts.links, href: "/admin/links" },
  ];

  return (
    <>
      <AdmHead
        title="Dashboard"
        viewHref="/"
        viewLabel="View site"
        subtitle="Site overview. Everything public is edited from this panel."
      />

      {!counts.ok && (
        <div className="adm-error">
          Supabase is not configured yet. Copy <code>.env.example</code> to{" "}
          <code>.env.local</code>, apply the migrations in <code>supabase/migrations</code> and
          create your admin user in Supabase Auth.
        </div>
      )}

      <div className="adm-stats">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`adm-stat ${s.accent ? "adm-stat--accent" : ""}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="adm-stat-label">{s.label}</div>
            <div className="adm-stat-value">{s.value}</div>
            <div className="adm-stat-hint">Manage →</div>
          </Link>
        ))}
      </div>

      <div className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Quick actions</h2>
        </div>
        <div style={{ padding: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/admin/content" className="adm-btn">
            Edit content
          </Link>
          <Link href="/admin/photos" className="adm-btn adm-btn--ghost">
            Change photos
          </Link>
          <Link href="/admin/blog" className="adm-btn adm-btn--ghost">
            New post
          </Link>
          <Link href="/admin/events" className="adm-btn adm-btn--ghost">
            New event
          </Link>
          <Link href="/" className="adm-btn adm-btn--ghost" target="_blank">
            View site ↗
          </Link>
        </div>
      </div>
    </>
  );
}
