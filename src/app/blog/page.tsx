import type { Metadata } from "next";
import Link from "next/link";
import { getContent, getPublishedPosts } from "@/lib/content";
import "@/components/landing/landing.css";

export const revalidate = 60;

export const metadata: Metadata = { title: "Blog" };

const POST_FMT = new Intl.DateTimeFormat("en-CA", { day: "numeric", month: "long", year: "numeric" });

export default async function BlogIndexPage() {
  const [content, posts] = await Promise.all([getContent(), getPublishedPosts()]);
  const [featured, ...rest] = posts;

  return (
    <section className="section">
      <div className="section-inner">
        <Link href="/" className="post-back">
          ← {content["site.name"]}
        </Link>
        <p className="blog-eyebrow">{content["blog.title"]}</p>
        <h1 className="section-title">{content["blog.intro"]}</h1>

        {!featured ? (
          <p className="section-intro" style={{ fontStyle: "italic" }}>
            No posts published yet.
          </p>
        ) : (
          <>
            <Link href={`/blog/${featured.slug}`} className="blog-featured">
              <div className="blog-featured-cover">
                {featured.cover_url && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={featured.cover_url} alt="" />
                )}
              </div>
              <div className="blog-featured-body">
                {featured.published_at && (
                  <div className="blog-card-date">
                    {POST_FMT.format(new Date(featured.published_at))}
                  </div>
                )}
                <h2 className="blog-card-title">{featured.title}</h2>
                <p className="blog-card-excerpt">{featured.excerpt}</p>
                <span className="blog-featured-more">Read the article →</span>
              </div>
            </Link>

            {rest.length > 0 && (
              <div className="blog-grid">
                {rest.map((post) => (
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
          </>
        )}
      </div>
    </section>
  );
}
