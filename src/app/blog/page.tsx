import type { Metadata } from "next";
import Link from "next/link";
import { getContent, getPublishedPosts } from "@/lib/content";
import "@/components/landing/landing.css";

export const revalidate = 60;

export const metadata: Metadata = { title: "Blog" };

const POST_FMT = new Intl.DateTimeFormat("en-CA", { day: "numeric", month: "long", year: "numeric" });

export default async function BlogIndexPage() {
  const [content, posts] = await Promise.all([getContent(), getPublishedPosts()]);

  return (
    <section className="section">
      <div className="section-inner">
        <Link href="/" className="post-back">
          ← {content["site.name"]}
        </Link>
        <h1 className="section-title">{content["blog.title"]}</h1>
        <p className="section-intro">{content["blog.intro"]}</p>

        {posts.length === 0 ? (
          <p className="section-intro" style={{ fontStyle: "italic" }}>
            No posts published yet.
          </p>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
                <div className="blog-card-cover">
                  {post.cover_url && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={post.cover_url} alt="" loading="lazy" />
                  )}
                </div>
                <div className="blog-card-body">
                  {post.published_at && (
                    <div className="blog-card-date">
                      {POST_FMT.format(new Date(post.published_at))}
                    </div>
                  )}
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
