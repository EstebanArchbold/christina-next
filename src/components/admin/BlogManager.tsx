"use client";

import { useEffect, useState } from "react";
import type { BlogPost } from "@/types/domain";

const EMPTY = { title: "", slug: "", excerpt: "", content: "", published: false };

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      setError("Could not load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError("");
    const isNew = !editing.id;
    try {
      const res = await fetch(isNew ? "/api/blog" : `/api/blog/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editing.title,
          slug: editing.slug,
          excerpt: editing.excerpt ?? "",
          content: editing.content ?? "",
          published: editing.published ?? false,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save.");
        return;
      }
      setEditing(null);
      await refresh();
    } catch {
      setError("Connection error.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    await refresh();
  };

  const togglePublished = async (post: BlogPost) => {
    await fetch(`/api/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    await refresh();
  };

  if (loading) return <div className="adm-loading">Loading posts…</div>;

  return (
    <>
      {error && !editing && <div className="adm-error">{error}</div>}

      <div className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Posts</h2>
          <button type="button" className="adm-btn" onClick={() => setEditing({ ...EMPTY })}>
            + New post
          </button>
        </div>
        {posts.length === 0 ? (
          <div className="adm-empty">No posts yet. Create the first one.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td style={{ color: "var(--tpl-gris)" }}>/blog/{post.slug}</td>
                    <td>
                      <span className={`chip ${post.published ? "chip--confirmed" : "chip--pending"}`}>
                        {post.published ? "published" : "draft"}
                      </span>
                    </td>
                    <td>{new Date(post.updated_at).toLocaleDateString("en-CA")}</td>
                    <td>
                      <div className="adm-actions">
                        <button
                          type="button"
                          className="adm-btn adm-btn--ghost adm-btn--sm"
                          onClick={() => setEditing(post)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="adm-btn adm-btn--ghost adm-btn--sm"
                          onClick={() => void togglePublished(post)}
                        >
                          {post.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          type="button"
                          className="adm-btn adm-btn--danger adm-btn--sm"
                          onClick={() => void remove(post.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="adm-modal-backdrop" onClick={() => setEditing(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="adm-modal-title">{editing.id ? "Edit post" : "New post"}</h3>
            {error && <div className="adm-error">{error}</div>}
            <div className="adm-form">
              <div>
                <label className="field-label">Title</label>
                <input
                  className="field-input"
                  maxLength={120}
                  value={editing.title ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      title: e.target.value,
                      slug: editing.id ? editing.slug : slugify(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="field-label">Slug (URL)</label>
                <input
                  className="field-input"
                  maxLength={120}
                  value={editing.slug ?? ""}
                  onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                />
              </div>
              <div>
                <label className="field-label">Excerpt (max 300)</label>
                <textarea
                  className="field-input"
                  rows={2}
                  maxLength={300}
                  value={editing.excerpt ?? ""}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">
                  Content (paragraphs separated by a blank line)
                </label>
                <textarea
                  className="field-input"
                  rows={10}
                  maxLength={20000}
                  value={editing.content ?? ""}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                />
              </div>
              <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={editing.published ?? false}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                />
                Published (visible on the site)
              </label>
            </div>
            <div className="adm-modal-actions">
              <button
                type="button"
                className="adm-btn adm-btn--ghost"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button type="button" className="adm-btn" disabled={saving} onClick={save}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
