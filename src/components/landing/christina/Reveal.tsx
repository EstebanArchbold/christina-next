"use client";

import { useEffect } from "react";

/**
 * Observa todos los .reveal de la página y les agrega .in al entrar
 * en viewport (fade-in on scroll del diseño original).
 */
export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll(".et .reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
