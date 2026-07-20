"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#benefits", label: "Why Me" },
  { href: "#booking", label: "Book" },
  { href: "#contact", label: "Contact" },
] as const;

export function Nav({ brand }: { brand: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className="hero-nav" aria-label="Main navigation">
        <a className="brand" href="#top">
          <span className="brand-mark">C</span>
          <span>{brand}</span>
        </a>
        <ul>
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden>
            <path d="M0 1h22M0 7h22M0 13h22" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </nav>

      <div className={`nav-overlay ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <button
          type="button"
          className="nav-close"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
        >
          ×
        </button>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
