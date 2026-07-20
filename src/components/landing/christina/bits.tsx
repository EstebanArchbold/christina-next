/** Piezas compartidas de la landing (iconos, horizonte, helpers). */

/** Divide un textarea del admin en líneas no vacías. */
export function lines(value: string | undefined): string[] {
  return (value ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d="M1 7 H13 M8 2 L13 7 L8 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TickIcon = () => (
  <svg className="tick" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M3 9 L7 13 L15 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Silueta de montañas al pie del hero. */
export const Horizon = () => (
  <svg className="horizon" viewBox="0 0 1600 180" preserveAspectRatio="none" aria-hidden>
    <defs>
      <linearGradient id="horizonFade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0a0e18" stopOpacity="0" />
        <stop offset="60%" stopColor="#0a0e18" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0a0e18" stopOpacity="1" />
      </linearGradient>
    </defs>
    <path d="M 0 180 L 0 100 L 150 70 L 280 110 L 420 50 L 580 90 L 720 40 L 880 80 L 1040 60 L 1200 100 L 1360 70 L 1500 110 L 1600 80 L 1600 180 Z" fill="#0a0e18" opacity="0.8" />
    <path d="M 0 180 L 0 140 L 120 130 L 300 150 L 480 120 L 650 140 L 820 115 L 1000 135 L 1180 110 L 1360 140 L 1550 125 L 1600 140 L 1600 180 Z" fill="#141b2d" opacity="0.6" />
    <rect x="0" y="0" width="1600" height="180" fill="url(#horizonFade)" />
  </svg>
);
