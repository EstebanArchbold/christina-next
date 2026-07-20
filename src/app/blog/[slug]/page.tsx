import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/content";
import "@/components/landing/landing.css";

export const revalidate = 60;

const POST_FMT = new Intl.DateTimeFormat("en-CA", { day: "numeric", month: "long", year: "numeric" });

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Contenido en texto plano: párrafos separados por línea en blanco
  const paragraphs = post.content.split(/\n\s*\n/).filter((p: string) => p.trim() !== "");

  return (
    <article className="post">
      <Link href="/blog" className="post-back">
        ← Back to the journal
      </Link>
      {post.published_at && (
        <div className="post-date">{POST_FMT.format(new Date(post.published_at))}</div>
      )}
      <h1>{post.title}</h1>
      {post.cover_url && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={post.cover_url} alt="" className="post-cover" />
      )}
      <div className="post-body">
        {paragraphs.map((p: string, i: number) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
