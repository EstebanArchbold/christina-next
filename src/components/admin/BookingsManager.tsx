"use client";

import { useCallback, useEffect, useState } from "react";
import type { Booking, BookingSettings } from "@/types/domain";
import { DEFAULT_BOOKING_SETTINGS } from "@/types/domain";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const STATUS_LABEL: Record<string, string> = {
  pending: "pending",
  confirmed: "confirmed",
  cancelled: "cancelled",
};

/* ── Configuración de disponibilidad (el "manage" del calendario) ── */
function CalendarSettings() {
  const [settings, setSettings] = useState<BookingSettings>(DEFAULT_BOOKING_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => data.booking && setSettings(data.booking))
      .catch(() => setError("Could not load settings."))
      .finally(() => setLoading(false));
  }, []);

  const toggleDay = (day: number) => {
    setSettings((s) => ({
      ...s,
      openDays: s.openDays.includes(day)
        ? s.openDays.filter((d) => d !== day)
        : [...s.openDays, day].sort(),
    }));
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking: settings }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save.");
        return;
      }
      setMessage("Settings saved.");
    } catch {
      setError("Connection error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="adm-loading">Loading settings…</div>;

  return (
    <div className="adm-panel">
      <div className="adm-panel-head">
        <h2 className="adm-panel-title">Calendar · availability</h2>
      </div>
      <div style={{ padding: 20, display: "grid", gap: 18 }}>
        {error && <div className="adm-error" style={{ marginBottom: 0 }}>{error}</div>}
        {message && <div style={{ color: "#2d5a34", fontSize: 13 }}>{message}</div>}

        <div>
          <label className="field-label">Open days</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {DAY_NAMES.map((name, day) => (
              <button
                key={day}
                type="button"
                className={`adm-btn adm-btn--sm ${settings.openDays.includes(day) ? "" : "adm-btn--ghost"}`}
                onClick={() => toggleDay(day)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="adm-form-row">
          <div>
            <label className="field-label">Opens at</label>
            <input
              className="field-input"
              type="time"
              value={settings.openTime}
              onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Closes at</label>
            <input
              className="field-input"
              type="time"
              value={settings.closeTime}
              onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
            />
          </div>
        </div>

        <div className="adm-form-row">
          <div>
            <label className="field-label">Slot length (minutes)</label>
            <input
              className="field-input"
              type="number"
              min={15}
              max={480}
              value={settings.slotMinutes}
              onChange={(e) => setSettings({ ...settings, slotMinutes: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="field-label">Bookings per slot</label>
            <input
              className="field-input"
              type="number"
              min={1}
              max={100}
              value={settings.maxPerSlot}
              onChange={(e) => setSettings({ ...settings, maxPerSlot: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <button type="button" className="adm-btn" disabled={saving} onClick={save}>
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Lista de reservas ── */
export function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "all">("upcoming");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const params =
        filter === "upcoming" ? `?from=${new Date().toISOString().slice(0, 10)}` : "";
      const res = await fetch(`/api/bookings${params}`);
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setStatus = async (id: string, status: string) => {
    if (status === "cancelled" && !confirm("Cancel this booking? It will also be removed from Google Calendar.")) {
      return;
    }
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await refresh();
  };

  return (
    <>
      {error && <div className="adm-error">{error}</div>}

      <CalendarSettings />

      <div className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Bookings</h2>
          <div className="adm-viewtoggle">
            <button
              type="button"
              className={filter === "upcoming" ? "is-active" : ""}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </button>
            <button
              type="button"
              className={filter === "all" ? "is-active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>
          </div>
        </div>

        {loading ? (
          <div className="adm-loading">Loading bookings…</div>
        ) : bookings.length === 0 ? (
          <div className="adm-empty">No {filter === "upcoming" ? "upcoming " : ""}bookings.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {new Date(`${b.date}T12:00:00`).toLocaleDateString("en-CA", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                    <td>
                      {b.start_time}–{b.end_time}
                    </td>
                    <td>{b.name}</td>
                    <td>
                      <div style={{ fontSize: 12.5 }}>{b.email}</div>
                      {b.phone && (
                        <div style={{ fontSize: 12, color: "var(--tpl-gris)" }}>{b.phone}</div>
                      )}
                    </td>
                    <td style={{ maxWidth: 200, fontSize: 12.5 }}>{b.notes}</td>
                    <td>
                      <span className={`chip chip--${b.status}`}>{STATUS_LABEL[b.status]}</span>
                      {b.google_event_id && (
                        <div style={{ fontSize: 10, color: "var(--tpl-gris)", marginTop: 4 }}>
                          on Google Calendar
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="adm-actions">
                        {b.status === "pending" && (
                          <button
                            type="button"
                            className="adm-btn adm-btn--sm"
                            onClick={() => void setStatus(b.id, "confirmed")}
                          >
                            Confirm
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button
                            type="button"
                            className="adm-btn adm-btn--danger adm-btn--sm"
                            onClick={() => void setStatus(b.id, "cancelled")}
                          >
                            Cancel
                          </button>
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
    </>
  );
}
