import "server-only";
import { CONTENT_DEFAULTS } from "@/lib/content-schema";
import { createServiceClient } from "@/lib/supabase/admin";

/**
 * Lecturas de contenido para la página pública.
 * Todo devuelve datos aunque Supabase no esté configurado aún
 * (defaults del schema / listas vacías) para poder previsualizar
 * el template sin backend.
 */

export type SiteContent = Record<string, string>;

export async function getContent(): Promise<SiteContent> {
  const merged = { ...CONTENT_DEFAULTS };
  try {
    const supabase = createServiceClient();
    const { data } = await supabase.from("site_content").select("key,value");
    for (const row of data ?? []) {
      if (row.key in merged && row.value.trim() !== "") merged[row.key] = row.value;
    }
  } catch {
    // Sin Supabase: se usan los defaults del schema.
  }
  return merged;
}

export async function getMediaSlots(): Promise<Record<string, string>> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase.from("media_slots").select("slot,url");
    return Object.fromEntries((data ?? []).map((r) => [r.slot, r.url]));
  } catch {
    return {};
  }
}

export async function getGallery() {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getUpcomingEvents(limit = 6) {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("status", "active")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedPosts(limit?: number) {
  try {
    const supabase = createServiceClient();
    let query = supabase
      .from("blog_posts")
      .select("id,slug,title,excerpt,cover_url,published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function getActiveLinks() {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("links")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    return data ?? [];
  } catch {
    return [];
  }
}
