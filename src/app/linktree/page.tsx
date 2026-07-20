import type { Metadata } from "next";
import Link from "next/link";
import { getActiveLinks, getContent, getMediaSlots } from "@/lib/content";
import "@/components/landing/landing.css";

export const revalidate = 60;

export const metadata: Metadata = { title: "Links" };

export default async function LinktreePage() {
  const [content, media, links] = await Promise.all([
    getContent(),
    getMediaSlots(),
    getActiveLinks(),
  ]);

  return (
    <main className="linktree">
      {media["linktree-avatar"] ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={media["linktree-avatar"]} alt="" className="linktree-avatar" />
      ) : (
        <div className="linktree-avatar linktree-avatar--placeholder">
          {content["site.name"].charAt(0)}
        </div>
      )}
      <h1>{content["linktree.title"]}</h1>
      <p className="linktree-bio">{content["linktree.bio"]}</p>

      <div className="linktree-links">
        {links.length === 0 ? (
          <span className="linktree-bio" style={{ fontStyle: "italic" }}>
            No links yet. Add them from the admin panel.
          </span>
        ) : (
          links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              className="linktree-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))
        )}
      </div>

      <Link href="/" className="linktree-home">
        {content["site.name"]} — website
      </Link>
    </main>
  );
}
