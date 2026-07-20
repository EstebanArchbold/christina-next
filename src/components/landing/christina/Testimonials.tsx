"use client";

import { useEffect, useState } from "react";

export interface Testimonial {
  quote: string;
  role: string;
  meta: string;
}

interface TestimonialsProps {
  eyebrow: string;
  title: string;
  titleEm: string;
  note: string;
  items: Testimonial[];
}

/** Carrusel con auto-rotación cada 7s, pausado al pasar el mouse. */
export function Testimonials({ eyebrow, title, titleEm, note, items }: TestimonialsProps) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (items.length === 0) return null;

  return (
    <section
      className="testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">— {eyebrow}</span>
          <h2>
            {title}
            <br />
            <em>{titleEm}</em>
          </h2>
          <p>{note}</p>
        </div>
        <div className="testimonial-carousel reveal">
          <div className="testimonial-track">
            {items.map((t, i) => (
              <div key={i} className={`testimonial-card ${i === idx ? "active" : ""}`}>
                <div className="testimonial-quote-mark">“</div>
                <div className="testimonial-quote">{t.quote}</div>
                <div className="testimonial-meta">
                  <span className="role">{t.role}</span>
                  {t.meta}
                </div>
              </div>
            ))}
          </div>
          {items.length > 1 && (
            <div className="testimonial-controls">
              <button
                className="testimonial-arrow"
                onClick={() => setIdx((idx - 1 + items.length) % items.length)}
                aria-label="Previous testimonial"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 2 L4 7 L9 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {items.map((_, i) => (
                <button
                  key={i}
                  className={`testimonial-dot ${i === idx ? "active" : ""}`}
                  onClick={() => setIdx(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
              <button
                className="testimonial-arrow"
                onClick={() => setIdx((idx + 1) % items.length)}
                aria-label="Next testimonial"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 2 L10 7 L5 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
