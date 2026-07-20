import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { createServiceClient } from "@/lib/supabase/admin";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "The slug can only contain lowercase letters, numbers and hyphens"),
  excerpt: z.string().max(300).default(""),
  content: z.string().max(20000).default(""),
  cover_url: z.string().url().nullable().optional(),
  published: z.boolean().default(false),
});

/** GET — todas las entradas (incluye borradores). Solo admin. */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ posts: data });
}

/** POST — crea una entrada. Solo admin. */
export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const post = parsed.data;
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      ...post,
      cover_url: post.cover_url ?? null,
      published_at: post.published ? new Date().toISOString() : null,
    })
    .select()
    .single();
  if (error) {
    if (error.code === "23505") return jsonError("A post with that slug already exists");
    return jsonError(error.message, 500);
  }

  return NextResponse.json({ ok: true, post: data });
}
