"use client";

import { useEffect, useState } from "react";
import type { SiteEvent } from "@/types/domain";

interface EventDraft {
  id?: string;
  title: string;
  description: string;
  location: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

const EMPTY: EventDraft = { title: "", description: "", location: "", date: "", time: "19:00" };

const FMT = new Intl.DateTimeFormat("en-CA", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function EventsManager() {
  const [events, setEvents] = useState<SiteEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EventDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data.events ?? []);
    } catch {
      setError("Could not load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.date || !editing.time) {
      setError("Date and time are required.");
      return;
    }
    setSaving(true);
    setError("");
    const starts_at = new Date(`${editing.date}T${editing.time}:00`).toISOString();
    const isNew = !editing.id;
    try {
      const res = await fetch(isNew ? "/api/events" : `/api/events/${editing.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editing.title,
          description: editing.description,
          location: editing.location,
          starts_at,
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

  const setStatus = async (event: SiteEvent, status: "active" | "cancelled") => {
    await fetch(`/api/events/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this event permanently?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    await refresh();
  };

  const startEdit = (event: SiteEvent) => {
    const d = new Date(event.starts_at);
    setEditing({
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`,
      time: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
    });
  };

  if (loading) return <div className="adm-loading">Loading events…</div>;

  return (
    <>
      {error && !editing && <div className="adm-error">{error}</div>}

      <div className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Events</h2>
          <button type="button" className="adm-btn" onClick={() => setEditing({ ...EMPTY })}>
            + New event
          </button>
        </div>
        {events.length === 0 ? (
          <div className="adm-empty">No events yet.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Event</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{FMT.format(new Date(event.starts_at))}</td>
                    <td>
                      <strong>{event.title}</strong>
                      {event.description && (
                        <div style={{ fontSize: 12, color: "var(--tpl-gris)" }}>
                          {event.description}
                        </div>
                      )}
                    </td>
                    <td>{event.location}</td>
                    <td>
                      <span
                        className={`chip ${event.status === "active" ? "chip--confirmed" : "chip--cancelled"}`}
                      >
                        {event.status === "active" ? "active" : "cancelled"}
                      </span>
                    </td>
                    <td>
                      <div className="adm-actions">
                        <button
                          type="button"
                          className="adm-btn adm-btn--ghost adm-btn--sm"
                          onClick={() => startEdit(event)}
                        >
                          Edit
                        </button>
                        {event.status === "active" ? (
                          <button
                            type="button"
                            className="adm-btn adm-btn--danger adm-btn--sm"
                            onClick={() => void setStatus(event, "cancelled")}
                          >
                            Cancel
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="adm-btn adm-btn--ghost adm-btn--sm"
                              onClick={() => void setStatus(event, "active")}
                            >
                              Reactivate
                            </button>
                            <button
                              type="button"
                              className="adm-btn adm-btn--danger adm-btn--sm"
                              onClick={() => void remove(event.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
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
            <h3 className="adm-modal-title">{editing.id ? "Edit event" : "New event"}</h3>
            {error && <div className="adm-error">{error}</div>}
            <div className="adm-form">
              <div>
                <label className="field-label">Title (max 90)</label>
                <input
                  className="field-input"
                  maxLength={90}
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div className="adm-form-row">
                <div>
                  <label className="field-label">Date</label>
                  <input
                    className="field-input"
                    type="date"
                    value={editing.date}
                    onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="field-label">Time</label>
                  <input
                    className="field-input"
                    type="time"
                    value={editing.time}
                    onChange={(e) => setEditing({ ...editing, time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="field-label">Location (max 120)</label>
                <input
                  className="field-input"
                  maxLength={120}
                  value={editing.location}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">Description (max 500)</label>
                <textarea
                  className="field-input"
                  rows={3}
                  maxLength={500}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
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
