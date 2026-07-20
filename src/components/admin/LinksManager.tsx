"use client";

import { useEffect, useState } from "react";
import type { LinkItem } from "@/types/domain";

export function LinksManager() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data.links ?? []);
    } catch {
      setError("Could not load links.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not add the link.");
        return;
      }
      setLabel("");
      setUrl("");
      await refresh();
    } catch {
      setError("Connection error.");
    } finally {
      setSaving(false);
    }
  };

  const patch = async (id: string, body: Record<string, unknown>) => {
    await fetch(`/api/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this link from the linktree?")) return;
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    await refresh();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= links.length) return;
    const reordered = [...links];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setLinks(reordered);
    await Promise.all(
      reordered.map((link, i) =>
        fetch(`/api/links/${link.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: i + 1 }),
        }),
      ),
    );
    await refresh();
  };

  if (loading) return <div className="adm-loading">Loading links…</div>;

  return (
    <>
      {error && <div className="adm-error">{error}</div>}

      <div className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Add link</h2>
        </div>
        <form onSubmit={add} style={{ padding: 20 }} className="adm-filters">
          <div className="adm-filter" style={{ flex: 1, minWidth: 180 }}>
            <label className="field-label">Label (max 60)</label>
            <input
              className="field-input"
              maxLength={60}
              required
              placeholder="Instagram"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="adm-filter" style={{ flex: 2, minWidth: 220 }}>
            <label className="field-label">URL</label>
            <input
              className="field-input"
              type="url"
              required
              placeholder="https://instagram.com/mypractice"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="adm-btn" disabled={saving}>
            {saving ? "Adding…" : "+ Add"}
          </button>
        </form>
      </div>

      <div className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Linktree links</h2>
        </div>
        {links.length === 0 ? (
          <div className="adm-empty">No links yet. Add the first one above.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Label</th>
                  <th>URL</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {links.map((link, i) => (
                  <tr key={link.id} style={{ opacity: link.active ? 1 : 0.55 }}>
                    <td>
                      <div className="adm-actions">
                        <button
                          type="button"
                          className="adm-btn adm-btn--ghost adm-btn--sm"
                          disabled={i === 0}
                          onClick={() => void move(i, -1)}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="adm-btn adm-btn--ghost adm-btn--sm"
                          disabled={i === links.length - 1}
                          onClick={() => void move(i, 1)}
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td>{link.label}</td>
                    <td>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.url}
                      </a>
                    </td>
                    <td>
                      <span className={`chip ${link.active ? "chip--confirmed" : "chip--cancelled"}`}>
                        {link.active ? "visible" : "hidden"}
                      </span>
                    </td>
                    <td>
                      <div className="adm-actions">
                        <button
                          type="button"
                          className="adm-btn adm-btn--ghost adm-btn--sm"
                          onClick={() => void patch(link.id, { active: !link.active })}
                        >
                          {link.active ? "Hide" : "Show"}
                        </button>
                        <button
                          type="button"
                          className="adm-btn adm-btn--danger adm-btn--sm"
                          onClick={() => void remove(link.id)}
                        >
                          Remove
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
    </>
  );
}
