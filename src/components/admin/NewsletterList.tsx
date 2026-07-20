"use client";

import { useEffect, useState } from "react";
import type { Subscriber } from "@/types/domain";

export function NewsletterList() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/newsletter")
      .then((r) => r.json())
      .then((data) => setSubscribers(data.subscribers ?? []))
      .catch(() => setError("Could not load subscribers."))
      .finally(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    const csv = ["email,subscribed_at"]
      .concat(subscribers.map((s) => `${s.email},${s.created_at.slice(0, 10)}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="adm-loading">Loading subscribers…</div>;

  return (
    <>
      {error && <div className="adm-error">{error}</div>}
      <div className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Subscribers ({subscribers.length})</h2>
          <button
            type="button"
            className="adm-btn adm-btn--ghost"
            onClick={exportCsv}
            disabled={subscribers.length === 0}
          >
            Export CSV
          </button>
        </div>
        {subscribers.length === 0 ? (
          <div className="adm-empty">No subscribers yet.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id}>
                    <td>{s.email}</td>
                    <td>{new Date(s.created_at).toLocaleDateString("en-CA")}</td>
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
