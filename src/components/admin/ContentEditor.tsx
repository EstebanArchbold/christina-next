"use client";

import { useEffect, useMemo, useState } from "react";
import { CONTENT_FIELDS, type ContentField } from "@/lib/content-schema";

/**
 * Editor de textos de la página pública, generado automáticamente
 * desde CONTENT_FIELDS. Cada campo muestra su límite de caracteres
 * y no deja guardar si se supera.
 */
export function ContentEditor() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [initial, setInitial] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        setValues(data.content ?? {});
        setInitial(data.content ?? {});
      })
      .catch(() => setMessage({ type: "error", text: "Could not load content." }))
      .finally(() => setLoading(false));
  }, []);

  const sections = useMemo(() => {
    const map = new Map<string, ContentField[]>();
    for (const field of CONTENT_FIELDS) {
      const list = map.get(field.section) ?? [];
      list.push(field);
      map.set(field.section, list);
    }
    return [...map.entries()];
  }, []);

  const dirtyKeys = Object.keys(values).filter((k) => values[k] !== initial[k]);
  const overLimit = CONTENT_FIELDS.filter((f) => (values[f.key] ?? "").length > f.maxLength);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = Object.fromEntries(dirtyKeys.map((k) => [k, values[k]]));
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Could not save." });
        return;
      }
      setInitial({ ...values });
      setMessage({ type: "ok", text: "Changes saved. The public page is up to date." });
    } catch {
      setMessage({ type: "error", text: "Connection error." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="adm-loading">Loading content…</div>;

  return (
    <>
      {message && (
        <div
          className={message.type === "error" ? "adm-error" : undefined}
          style={
            message.type === "ok"
              ? {
                  border: "1px solid #7fae87",
                  background: "#eef5ef",
                  color: "#2d5a34",
                  padding: "13px 16px",
                  fontSize: 13,
                  marginBottom: 20,
                }
              : undefined
          }
          role="status"
        >
          {message.text}
        </div>
      )}

      {sections.map(([section, fields]) => (
        <div className="adm-panel" key={section}>
          <div className="adm-panel-head">
            <h2 className="adm-panel-title">{section}</h2>
          </div>
          <div style={{ padding: 20, display: "grid", gap: 18 }}>
            {fields.map((field) => {
              const value = values[field.key] ?? "";
              const over = value.length > field.maxLength;
              return (
                <div key={field.key}>
                  <label className="field-label" htmlFor={field.key}>
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.key}
                      className="field-input"
                      rows={3}
                      value={value}
                      aria-invalid={over}
                      onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                    />
                  ) : (
                    <input
                      id={field.key}
                      className="field-input"
                      type="text"
                      value={value}
                      aria-invalid={over}
                      onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                    />
                  )}
                  <div className={`field-count ${over ? "is-over" : ""}`}>
                    {value.length} / {field.maxLength}
                  </div>
                  {field.help && (
                    <div style={{ fontSize: 11.5, color: "var(--tpl-gris)" }}>{field.help}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "var(--tpl-bg)",
          padding: "14px 0",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <button
          type="button"
          className="adm-btn"
          onClick={save}
          disabled={saving || dirtyKeys.length === 0 || overLimit.length > 0}
        >
          {saving ? "Saving…" : `Save changes (${dirtyKeys.length})`}
        </button>
        {overLimit.length > 0 && (
          <span className="field-error">
            {overLimit.length === 1
              ? `"${overLimit[0].label}" is over its character limit.`
              : `${overLimit.length} fields are over their character limit.`}
          </span>
        )}
      </div>
    </>
  );
}
