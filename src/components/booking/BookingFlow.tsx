"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Slot } from "@/lib/slots";

const DAY_FMT = new Intl.DateTimeFormat("en-CA", { weekday: "short" });
const NICE_FMT = new Intl.DateTimeFormat("en-CA", { weekday: "long", day: "numeric", month: "long" });

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function BookingFlow() {
  const days = useMemo(() => {
    const out: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      out.push(d);
    }
    return out;
  }, []);

  const [openDays, setOpenDays] = useState<number[] | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slot, setSlot] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ date: string; start: string } | null>(null);

  const loadSlots = useCallback(async (iso: string) => {
    setLoadingSlots(true);
    setSlot(null);
    try {
      const res = await fetch(`/api/availability?date=${iso}`);
      const data = await res.json();
      setSlots(data.slots ?? []);
      if (openDaysRefreshNeeded(data.openDays)) setOpenDays(data.openDays);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }

    function openDaysRefreshNeeded(incoming?: number[]) {
      return Array.isArray(incoming);
    }
  }, []);

  // Cargar disponibilidad del primer día al montar (también trae openDays)
  useEffect(() => {
    const first = toISO(days[0]);
    setDate(first);
    void loadSlots(first);
  }, [days, loadSlots]);

  const selectDay = (d: Date) => {
    const iso = toISO(d);
    setDate(iso);
    void loadSlots(iso);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !slot) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, date, start: slot, notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "The booking could not be created.");
        if (res.status === 400) void loadSlots(date);
        return;
      }
      setSuccess({ date, start: slot });
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    const d = new Date(`${success.date}T12:00:00`);
    return (
      <div className="booking-success" role="status">
        <strong>Booking received!</strong>
        <br />
        See you on {NICE_FMT.format(d)} at {success.start}. A confirmation is on its way to your
        email.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      {/* ── 1. Día ── */}
      <label className="field-label">1 · Pick a day</label>
      <div className="booking-days">
        {days.map((d) => {
          const iso = toISO(d);
          const closed = openDays !== null && !openDays.includes(d.getDay());
          return (
            <button
              key={iso}
              type="button"
              className={`booking-day ${date === iso ? "is-selected" : ""}`}
              disabled={closed}
              onClick={() => selectDay(d)}
            >
              <span className="booking-day-name">{DAY_FMT.format(d)}</span>
              <span className="booking-day-num">{d.getDate()}</span>
            </button>
          );
        })}
      </div>

      {/* ── 2. Hora ── */}
      <label className="field-label">2 · Pick a time</label>
      {loadingSlots ? (
        <p style={{ fontStyle: "italic", color: "var(--tpl-gris)" }}>Loading times…</p>
      ) : slots.length === 0 ? (
        <p style={{ fontStyle: "italic", color: "var(--tpl-gris)" }}>
          No times available for this day. Try another date.
        </p>
      ) : (
        <div className="booking-slots">
          {slots.map((s) => (
            <button
              key={s.start}
              type="button"
              className={`booking-slot ${slot === s.start ? "is-selected" : ""}`}
              disabled={!s.available}
              onClick={() => setSlot(s.start)}
            >
              {s.start}
            </button>
          ))}
        </div>
      )}

      {/* ── 3. Datos ── */}
      <label className="field-label">3 · Your details</label>
      <div style={{ display: "grid", gap: 14 }}>
        <input
          className="field-input"
          placeholder="Full name"
          required
          minLength={2}
          maxLength={90}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="field-input"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="field-input"
          type="tel"
          placeholder="Phone (optional)"
          maxLength={30}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <textarea
          className="field-input"
          placeholder="Notes (optional)"
          rows={3}
          maxLength={500}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && (
        <div className="field-error" role="alert" style={{ marginTop: 12 }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn-accent"
        disabled={submitting || !date || !slot}
        style={{ marginTop: 24 }}
      >
        {submitting ? "Sending…" : "Confirm booking"}
      </button>
    </form>
  );
}
