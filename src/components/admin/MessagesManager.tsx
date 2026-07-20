"use client";

import { Fragment, useEffect, useState } from "react";
import type { ContactMessage } from "@/types/domain";

/** Bandeja de mensajes del formulario de contacto de la landing. */
export function MessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => setMessages(data.messages ?? []))
      .catch(() => setError("Could not load messages."))
      .finally(() => setLoading(false));
  }, []);

  const toggleRead = async (msg: ContactMessage) => {
    const res = await fetch(`/api/contact/${msg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !msg.read }),
    });
    if (res.ok) {
      setMessages((list) => list.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m)));
    }
  };

  const remove = async (msg: ContactMessage) => {
    if (!window.confirm(`Delete the message from ${msg.first_name} ${msg.last_name}?`)) return;
    const res = await fetch(`/api/contact/${msg.id}`, { method: "DELETE" });
    if (res.ok) setMessages((list) => list.filter((m) => m.id !== msg.id));
  };

  const open = (msg: ContactMessage) => {
    setOpenId(openId === msg.id ? null : msg.id);
    if (!msg.read) void toggleRead(msg);
  };

  if (loading) return <div className="adm-loading">Loading messages…</div>;

  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      {error && <div className="adm-error">{error}</div>}
      <div className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">
            Inbox ({messages.length}){unread > 0 ? ` · ${unread} unread` : ""}
          </h2>
        </div>
        {messages.length === 0 ? (
          <div className="adm-empty">No messages yet.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <Fragment key={m.id}>
                    <tr
                      onClick={() => open(m)}
                      style={{ cursor: "pointer", fontWeight: m.read ? 400 : 600 }}
                    >
                      <td>
                        {m.first_name} {m.last_name}
                        <div style={{ fontSize: 12, color: "var(--tpl-gris)", fontWeight: 400 }}>
                          {m.email}
                        </div>
                      </td>
                      <td>{m.reason}</td>
                      <td>{new Date(m.created_at).toLocaleDateString("en-CA")}</td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <button
                          type="button"
                          className="adm-btn adm-btn--ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            void toggleRead(m);
                          }}
                        >
                          {m.read ? "Mark unread" : "Mark read"}
                        </button>{" "}
                        <button
                          type="button"
                          className="adm-btn adm-btn--danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            void remove(m);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {openId === m.id && (
                      <tr>
                        <td colSpan={4} style={{ whiteSpace: "pre-wrap", background: "var(--tpl-bg)" }}>
                          {m.message || <em>(no message)</em>}
                          <div style={{ marginTop: 10 }}>
                            <a className="adm-btn adm-btn--ghost" href={`mailto:${m.email}`}>
                              Reply by email
                            </a>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
