"use client";

import { useEffect, useRef, useState } from "react";
import { MEDIA_SLOTS } from "@/lib/content-schema";
import type { GalleryImage } from "@/types/domain";

function isVideo(url: string) {
  return /\.(mp4|webm)(\?|$)/i.test(url);
}

/* ── Slot fijo (hero, about, avatar) ── */
function SlotCard({
  slot,
  label,
  hint,
  accept,
  url,
  onChanged,
}: {
  slot: string;
  label: string;
  hint: string;
  accept: "image" | "video-or-image";
  url?: string;
  onChanged: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`/api/media/${slot}`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not upload the file.");
        return;
      }
      onChanged();
    } catch {
      setError("Connection error.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await fetch(`/api/media/${slot}`, { method: "DELETE" });
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-media-card">
      <div className="adm-media-preview">
        {url ? (
          isVideo(url) ? (
            <video src={url} muted loop autoPlay playsInline />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={url} alt={label} />
          )
        ) : (
          <div className="adm-media-empty">{hint}</div>
        )}
        {url && <span className="adm-media-badge">active</span>}
      </div>
      <div className="adm-media-label">{label}</div>
      <div className="adm-media-hint">{hint}</div>
      {error && <div className="field-error">{error}</div>}
      <div className="adm-actions">
        <button
          type="button"
          className="adm-btn adm-btn--sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading…" : url ? "Replace" : "Upload"}
        </button>
        {url && (
          <button
            type="button"
            className="adm-btn adm-btn--danger adm-btn--sm"
            disabled={busy}
            onClick={remove}
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept === "video-or-image" ? "image/*,video/mp4,video/webm" : "image/*"}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ── Manager completo ── */
export function MediaManager() {
  const [slots, setSlots] = useState<Record<string, string>>({});
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [error, setError] = useState("");
  const galleryInput = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    try {
      const [slotsRes, galleryRes] = await Promise.all([
        fetch("/api/media-slots"),
        fetch("/api/gallery"),
      ]);
      const galleryData = await galleryRes.json();
      setGallery(galleryData.images ?? []);
      if (slotsRes.ok) {
        const data = await slotsRes.json();
        setSlots(data.slots ?? {});
      }
    } catch {
      setError("Could not load media.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const uploadGallery = async (file: File) => {
    setGalleryBusy(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/gallery", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not upload the image.");
        return;
      }
      await refresh();
    } catch {
      setError("Connection error.");
    } finally {
      setGalleryBusy(false);
    }
  };

  const removeGalleryImage = async (id: string) => {
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    setGallery((g) => g.filter((img) => img.id !== id));
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= gallery.length) return;
    const reordered = [...gallery];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setGallery(reordered);
    await Promise.all(
      reordered.map((img, i) =>
        fetch(`/api/gallery/${img.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: i + 1 }),
        }),
      ),
    );
  };

  if (loading) return <div className="adm-loading">Loading media…</div>;

  return (
    <>
      {error && <div className="adm-error">{error}</div>}

      <div className="adm-media-group">Fixed slots</div>
      <div className="adm-media-grid">
        {MEDIA_SLOTS.map((def) => (
          <SlotCard
            key={def.slot}
            slot={def.slot}
            label={def.label}
            hint={def.hint}
            accept={def.accept}
            url={slots[def.slot]}
            onChanged={() => void refresh()}
          />
        ))}
      </div>

      <div className="adm-media-group" style={{ display: "flex", gap: 14, alignItems: "center" }}>
        Gallery
        <button
          type="button"
          className="adm-btn adm-btn--sm"
          disabled={galleryBusy}
          onClick={() => galleryInput.current?.click()}
        >
          {galleryBusy ? "Uploading…" : "+ Add photo"}
        </button>
        <input
          ref={galleryInput}
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadGallery(file);
            e.target.value = "";
          }}
        />
      </div>

      {gallery.length === 0 ? (
        <div className="adm-empty">No photos in the gallery yet.</div>
      ) : (
        <div className="adm-media-grid">
          {gallery.map((img, i) => (
            <div className="adm-media-card" key={img.id}>
              <div className="adm-media-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt} />
              </div>
              <div className="adm-actions">
                <button
                  type="button"
                  className="adm-btn adm-btn--ghost adm-btn--sm"
                  disabled={i === 0}
                  onClick={() => void move(i, -1)}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn--ghost adm-btn--sm"
                  disabled={i === gallery.length - 1}
                  onClick={() => void move(i, 1)}
                >
                  →
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn--danger adm-btn--sm"
                  onClick={() => void removeGalleryImage(img.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
