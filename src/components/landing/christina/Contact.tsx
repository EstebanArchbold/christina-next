"use client";

import { useState } from "react";
import { ArrowIcon } from "./bits";

interface ContactProps {
  eyebrow: string;
  titleLines: string[];
  titleEm: string;
  body: string;
  email: string;
  availability: string;
  location: string;
  reasons: string[];
  note: string;
}

const IcoMail = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <rect x="2" y="3" width="12" height="10" rx="1" />
    <path d="M2 5 L8 9 L14 5" />
  </svg>
);
const IcoCal = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <rect x="2" y="3" width="12" height="11" rx="1" />
    <path d="M2 6 L14 6 M5 2 L5 5 M11 2 L11 5" />
  </svg>
);
const IcoPin = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d="M8 1 C5 1 3 3 3 6 C3 10 8 15 8 15 C8 15 13 10 13 6 C13 3 11 1 8 1 Z" />
    <circle cx="8" cy="6" r="2" />
  </svg>
);

/** Formulario de contacto → POST /api/contact (se lee en /admin/mensajes). */
export function Contact(props: ContactProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.get("first_name"),
          last_name: data.get("last_name"),
          email: data.get("email"),
          reason: data.get("reason"),
          message: data.get("message"),
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
      form.reset();
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-copy reveal">
            <span className="eyebrow">— {props.eyebrow}</span>
            <h2>
              {props.titleLines.map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
              <em>{props.titleEm}</em>
            </h2>
            <p>{props.body}</p>
            <div className="contact-points">
              <div className="contact-point">
                <span className="ico"><IcoMail /></span>
                <div>
                  <strong>Email</strong>
                  {props.email}
                </div>
              </div>
              <div className="contact-point">
                <span className="ico"><IcoCal /></span>
                <div>
                  <strong>Availability</strong>
                  {props.availability}
                </div>
              </div>
              <div className="contact-point">
                <span className="ico"><IcoPin /></span>
                <div>
                  <strong>Location</strong>
                  {props.location}
                </div>
              </div>
            </div>
          </div>
          <form className="form reveal" onSubmit={onSubmit}>
            <div className="form-row-split">
              <div className="form-row">
                <label htmlFor="ct-first">First name</label>
                <input id="ct-first" name="first_name" type="text" placeholder="Alex" required maxLength={60} />
              </div>
              <div className="form-row">
                <label htmlFor="ct-last">Last name</label>
                <input id="ct-last" name="last_name" type="text" placeholder="Reed" required maxLength={60} />
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="ct-email">Email</label>
              <input id="ct-email" name="email" type="email" placeholder="you@company.com" required maxLength={120} />
            </div>
            <div className="form-row">
              <label htmlFor="ct-reason">What brings you here?</label>
              <select id="ct-reason" name="reason" required defaultValue="">
                <option value="" disabled>
                  Select one…
                </option>
                {props.reasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="ct-message">Anything you&apos;d like to share</label>
              <textarea
                id="ct-message"
                name="message"
                placeholder="A few sentences about what's going on…"
                maxLength={2000}
              />
            </div>
            <button className="btn btn-light" type="submit" disabled={sending || sent}>
              {sent ? "Message sent — talk soon ✓" : sending ? "Sending…" : "Send message"}
              {!sent && !sending && <ArrowIcon />}
            </button>
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}
            <div className="form-note">{props.note}</div>
          </form>
        </div>
      </div>
    </section>
  );
}
