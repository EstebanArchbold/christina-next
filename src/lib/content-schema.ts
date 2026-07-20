/**
 * ★ Núcleo del "WordPress simplificado".
 *
 * Cada texto editable de la página pública se declara aquí con su
 * restricción (maxLength) y su valor por defecto. El admin genera el
 * formulario automáticamente a partir de esta lista y el servidor
 * valida contra ella.
 *
 * Este schema corresponde a la landing de Christina Abounassar
 * (Executive Therapy Toronto) — port del sitio WordPress a Next.js.
 * Labels y help en inglés: son la UI que ve la clienta en el admin.
 */

export interface ContentField {
  key: string;
  label: string;
  /** Grupo bajo el que aparece en el admin */
  section: string;
  type: "text" | "textarea";
  maxLength: number;
  default: string;
  help?: string;
}

export const CONTENT_FIELDS: ContentField[] = [
  /* ── Site ── */
  { key: "site.name", label: "Brand name", section: "Site", type: "text", maxLength: 40, default: "Christina Abounassar" },
  { key: "site.tagline", label: "Tagline (for SEO)", section: "Site", type: "text", maxLength: 80, default: "Executive Therapy · Toronto" },
  { key: "site.email", label: "Contact email", section: "Site", type: "text", maxLength: 80, default: "hello@christinaabounassar.ca" },

  /* ── Hero ── */
  {
    key: "hero.pill", label: "Top pill (pulse)", section: "Hero", type: "text", maxLength: 70,
    default: "Now booking · First session within 5 days",
    help: "The notice with the animated gold dot above the headline.",
  },
  {
    key: "hero.headline", label: "Headline", section: "Hero", type: "textarea", maxLength: 90,
    default: "Stop carrying the\nweight alone.",
    help: "Each line of the box is one line of the headline.",
  },
  {
    key: "hero.headline_em", label: "Headline · gold phrase", section: "Hero", type: "text", maxLength: 40,
    default: "Find your calm.",
    help: "Shown in gold italics at the end of the headline.",
  },
  {
    key: "hero.sub", label: "Subtitle", section: "Hero", type: "textarea", maxLength: 300,
    default: "Executive burnout therapy designed for the realities of high-performance work. Virtual sessions across Ontario, booked around your calendar — never the other way around.",
  },
  { key: "hero.cta1", label: "Primary button", section: "Hero", type: "text", maxLength: 35, default: "Book your first session" },
  { key: "hero.cta2", label: "Secondary button", section: "Hero", type: "text", maxLength: 35, default: "Meet Christina" },
  {
    key: "hero.meta", label: "Credentials strip", section: "Hero", type: "textarea", maxLength: 220,
    default: "MSW · RSW Ontario\n8+ Years Experience\nEMDR · EFT · CBT · DBT\nVirtual & In-person · Toronto",
    help: "One item per line; shown with a gold dot below the buttons.",
  },

  /* ── About ── */
  { key: "about.eyebrow", label: "Eyebrow", section: "About", type: "text", maxLength: 40, default: "About Christina" },
  {
    key: "about.title", label: "Title", section: "About", type: "textarea", maxLength: 60,
    default: "Direct, warm,\nand",
    help: "Each line of the box is one line of the title.",
  },
  { key: "about.title_em", label: "Title · gold word", section: "About", type: "text", maxLength: 30, default: "no-fluff." },
  {
    key: "about.lede", label: "Pull quote", section: "About", type: "textarea", maxLength: 220,
    default: "“Therapy shouldn't feel like another meeting on your calendar. It should feel like the one place where nothing is waiting for you.”",
  },
  {
    key: "about.p1", label: "Paragraph 1", section: "About", type: "textarea", maxLength: 500,
    default: "For over 8 years, I've worked with overwhelmed executives and high-performing professionals who look composed on the outside and are running on empty on the inside. You know the feeling — the 2 a.m. wake-ups, the short fuse at home, the quiet dread before Monday.",
  },
  {
    key: "about.p2", label: "Paragraph 2", section: "About", type: "textarea", maxLength: 500,
    default: "My approach is evidence-based but never clinical. I pull from EMDR, EFT, CBT and DBT — whatever actually moves the needle for you — and I'll tell you the truth, with warmth and humor, about what I see.",
  },
  {
    key: "about.credentials", label: "Credential pills", section: "About", type: "textarea", maxLength: 400,
    default: "MSW · Master of Social Work\nRSW · Registered Social Worker · Ontario\nEMDR · Trained\nEFT · Trained\nCBT · Trained\nDBT · Trained\n8+ · Years experience",
    help: "One credential per line. The part before the first · is highlighted.",
  },
  { key: "about.sig_name", label: "Signature · name", section: "About", type: "text", maxLength: 60, default: "Christina Abounassar, MSW, RSW" },
  { key: "about.sig_role", label: "Signature · role", section: "About", type: "text", maxLength: 60, default: "Founder · Executive Therapy Toronto" },

  /* ── Services ── */
  { key: "services.eyebrow", label: "Eyebrow", section: "Services", type: "text", maxLength: 40, default: "What I help with" },
  { key: "services.title", label: "Title", section: "Services", type: "text", maxLength: 40, default: "Real problems." },
  { key: "services.title_em", label: "Title · gold phrase", section: "Services", type: "text", maxLength: 40, default: "Real strategies." },
  {
    key: "services.intro", label: "Intro", section: "Services", type: "textarea", maxLength: 300,
    default: "Whether you're juggling five deadlines, replaying last week's argument, or feeling invisible at home — these are the three things my clients come to me for most.",
  },
  { key: "service1.tag", label: "Service 1 · tag", section: "Services", type: "text", maxLength: 35, default: "Executive Burnout" },
  { key: "service1.title", label: "Service 1 · title", section: "Services", type: "text", maxLength: 45, default: "Burnout & Stress Relief" },
  {
    key: "service1.copy", label: "Service 1 · text", section: "Services", type: "textarea", maxLength: 300,
    default: "Break the cycle of exhaustion that strong coffee and weekend sleep can't touch. Evidence-based work on nervous-system regulation, boundaries, and recovery.",
  },
  { key: "service2.tag", label: "Service 2 · tag", section: "Services", type: "text", maxLength: 35, default: "Family & Relationships" },
  { key: "service2.title", label: "Service 2 · title", section: "Services", type: "text", maxLength: 45, default: "Family & Partner Therapy" },
  {
    key: "service2.copy", label: "Service 2 · text", section: "Services", type: "textarea", maxLength: 300,
    default: "The stress from work doesn't stay at work. Rebuild connection at home, navigate conflict, and come back to the version of you your family recognizes.",
  },
  { key: "service3.tag", label: "Service 3 · tag", section: "Services", type: "text", maxLength: 35, default: "Emotional Regulation" },
  { key: "service3.title", label: "Service 3 · title", section: "Services", type: "text", maxLength: 45, default: "Communication & Regulation" },
  {
    key: "service3.copy", label: "Service 3 · text", section: "Services", type: "textarea", maxLength: 300,
    default: "Learn to handle big feelings without blowing up or shutting down. Practical tools for the meetings, the texts, and the conversations that matter.",
  },
  { key: "services.cta", label: "Card link text", section: "Services", type: "text", maxLength: 30, default: "Book a consult" },

  /* ── Benefits ── */
  { key: "benefits.eyebrow", label: "Eyebrow", section: "Benefits", type: "text", maxLength: 40, default: "Why work with me" },
  { key: "benefits.title", label: "Title", section: "Benefits", type: "text", maxLength: 40, default: "Built for the way" },
  { key: "benefits.title_em", label: "Title · gold phrase", section: "Benefits", type: "text", maxLength: 40, default: "you actually live." },
  {
    key: "benefits.intro", label: "Intro", section: "Benefits", type: "textarea", maxLength: 300,
    default: "You deserve support that actually gets you. My practice is connection-centered, evidence-based, and designed for executive realities — not the other way around.",
  },
  { key: "benefit1.title", label: "Benefit I · title", section: "Benefits", type: "text", maxLength: 60, default: "Executive experience, human approach" },
  {
    key: "benefit1.copy", label: "Benefit I · text", section: "Benefits", type: "textarea", maxLength: 300,
    default: "I specialize in the realities of executive life. No judgment for the late-night emails. No lectures about balance. Just real talk and proven tools.",
  },
  { key: "benefit2.title", label: "Benefit II · title", section: "Benefits", type: "text", maxLength: 60, default: "Connection-centered, always" },
  {
    key: "benefit2.copy", label: "Benefit II · text", section: "Benefits", type: "textarea", maxLength: 300,
    default: "Therapy is a relationship. You'll know where you stand, what we're working on, and why. You don't have to perform — here, you can just be.",
  },
  { key: "benefit3.title", label: "Benefit III · title", section: "Benefits", type: "text", maxLength: 60, default: "Flexible, Virtual Sessions" },
  {
    key: "benefit3.copy", label: "Benefit III · text", section: "Benefits", type: "textarea", maxLength: 300,
    default: "Access support on your schedule, wherever you are in Ontario. Weekend and early-AM availability. Book and reschedule in seconds.",
  },
  { key: "benefits.expect_label", label: "“Expect” strip · label", section: "Benefits", type: "text", maxLength: 40, default: "What you can expect" },
  {
    key: "benefits.expect", label: "“Expect” strip · items", section: "Benefits", type: "textarea", maxLength: 300,
    default: "Feel calmer and less reactive under pressure\nSleep better · reduce rumination\nCommunicate at home without blowing up or shutting down",
    help: "One item per line (shown with the gold check).",
  },

  /* ── Booking section ── */
  { key: "booking.eyebrow", label: "Eyebrow", section: "Booking section", type: "text", maxLength: 40, default: "Book a session" },
  {
    key: "booking.title", label: "Title", section: "Booking section", type: "textarea", maxLength: 80,
    default: "Open my calendar.\nPick a time.",
    help: "Each line of the box is one line of the title.",
  },
  { key: "booking.title_em", label: "Title · gold phrase", section: "Booking section", type: "text", maxLength: 30, default: "That's it." },
  {
    key: "booking.body", label: "Text", section: "Booking section", type: "textarea", maxLength: 300,
    default: "My schedule is synced live with my calendar — early mornings before your stand-up, evenings after bedtime, weekend hours. Whatever fits into your day.",
  },
  {
    key: "booking.features", label: "Feature list", section: "Booking section", type: "textarea", maxLength: 400,
    default: "See every free slot on my calendar — no back-and-forth emails\n50-minute sessions · Virtual or in-person Toronto\nReschedule up to 24h before · No change fees\nFree 15-minute intro call to see if we're a fit",
    help: "One item per line (shown with the gold check).",
  },
  { key: "booking.cta", label: "Secondary button", section: "Booking section", type: "text", maxLength: 35, default: "Book free 15-min intro" },

  /* ── Testimonials ── */
  { key: "testimonials.eyebrow", label: "Eyebrow", section: "Testimonials", type: "text", maxLength: 40, default: "Client Reflections" },
  { key: "testimonials.title", label: "Title", section: "Testimonials", type: "text", maxLength: 40, default: "What it's like" },
  { key: "testimonials.title_em", label: "Title · gold phrase", section: "Testimonials", type: "text", maxLength: 40, default: "to work with me." },
  {
    key: "testimonials.note", label: "Confidentiality note", section: "Testimonials", type: "text", maxLength: 140,
    default: "Client names omitted and details altered for confidentiality. Shared with permission.",
  },
  {
    key: "testimonial1.quote", label: "Testimonial 1 · quote", section: "Testimonials", type: "textarea", maxLength: 400,
    default: "For the first time in years, I can sit through a board meeting without my chest tightening. Christina helped me separate the weight of leadership from the weight I'd been adding to it myself.",
  },
  { key: "testimonial1.role", label: "Testimonial 1 · role", section: "Testimonials", type: "text", maxLength: 40, default: "CFO" },
  { key: "testimonial1.meta", label: "Testimonial 1 · detail", section: "Testimonials", type: "text", maxLength: 60, default: "Financial services · Toronto" },
  {
    key: "testimonial2.quote", label: "Testimonial 2 · quote", section: "Testimonials", type: "textarea", maxLength: 400,
    default: "She's direct. That's what I needed. I'd been in therapy that felt like a confessional — this feels like strategy with a heart. My marriage is different now. Actually different.",
  },
  { key: "testimonial2.role", label: "Testimonial 2 · role", section: "Testimonials", type: "text", maxLength: 40, default: "Founder" },
  { key: "testimonial2.meta", label: "Testimonial 2 · detail", section: "Testimonials", type: "text", maxLength: 60, default: "SaaS · Ottawa" },
  {
    key: "testimonial3.quote", label: "Testimonial 3 · quote", section: "Testimonials", type: "textarea", maxLength: 400,
    default: "The 7am slot on Tuesdays saved me. I didn't have to choose between my career and doing the work. That alone made me trust the process — and then the work itself was extraordinary.",
  },
  { key: "testimonial3.role", label: "Testimonial 3 · role", section: "Testimonials", type: "text", maxLength: 40, default: "Managing Director" },
  { key: "testimonial3.meta", label: "Testimonial 3 · detail", section: "Testimonials", type: "text", maxLength: 60, default: "Consulting · Toronto" },
  {
    key: "testimonial4.quote", label: "Testimonial 4 · quote", section: "Testimonials", type: "textarea", maxLength: 400,
    default: "I came in for burnout. I left with tools my whole team benefits from. Worth every session — and Christina makes the hard parts feel safe.",
    help: "Leave the quote empty to hide a testimonial.",
  },
  { key: "testimonial4.role", label: "Testimonial 4 · role", section: "Testimonials", type: "text", maxLength: 40, default: "VP Engineering" },
  { key: "testimonial4.meta", label: "Testimonial 4 · detail", section: "Testimonials", type: "text", maxLength: 60, default: "Tech · Remote Ontario" },

  /* ── Contact ── */
  { key: "contact.eyebrow", label: "Eyebrow", section: "Contact", type: "text", maxLength: 40, default: "Get in touch" },
  {
    key: "contact.title", label: "Title", section: "Contact", type: "textarea", maxLength: 60,
    default: "Send a note.\nI'll",
    help: "Each line of the box is one line of the title.",
  },
  { key: "contact.title_em", label: "Title · gold phrase", section: "Contact", type: "text", maxLength: 40, default: "reply personally." },
  {
    key: "contact.body", label: "Text", section: "Contact", type: "textarea", maxLength: 400,
    default: "Thank you for spending time on my site. Book a free 15-minute consult by sending a message — I'll reply within one business day (check your junk folder just in case). I'm already excited to meet you.",
  },
  { key: "contact.availability", label: "Availability", section: "Contact", type: "text", maxLength: 80, default: "Mon–Fri 7am–9pm · Sat mornings · Toronto ET" },
  { key: "contact.location", label: "Location", section: "Contact", type: "text", maxLength: 80, default: "Virtual across Ontario · In-person Toronto" },
  {
    key: "contact.reasons", label: "“What brings you here?” options", section: "Contact", type: "textarea", maxLength: 300,
    default: "Executive burnout\nFamily / relationship stress\nEmotional regulation\nWork stress & anxiety\nSomething else",
    help: "One selector option per line.",
  },
  {
    key: "contact.note", label: "Note under the button", section: "Contact", type: "text", maxLength: 90,
    default: "Your information is private and never shared. Secure SSL.",
  },

  /* ── Footer ── */
  {
    key: "footer.blurb", label: "Brand description", section: "Footer", type: "textarea", maxLength: 220,
    default: "Registered Social Worker (MSW, RSW) providing evidence-based therapy to executives and professionals across Ontario.",
  },
  { key: "footer.copyright", label: "Copyright", section: "Footer", type: "text", maxLength: 80, default: "© 2026 Christina Abounassar · MSW, RSW" },
  {
    key: "footer.crisis", label: "Crisis line", section: "Footer", type: "text", maxLength: 100,
    default: "If you're in crisis, call or text 988 · Available 24/7",
  },

  /* ── Linktree ── */
  { key: "linktree.title", label: "Title", section: "Linktree", type: "text", maxLength: 40, default: "@christinaabounassar" },
  { key: "linktree.bio", label: "Bio", section: "Linktree", type: "textarea", maxLength: 160, default: "Executive therapy · Toronto. All my links in one place." },

  /* ── Blog ── */
  { key: "blog.title", label: "Section title", section: "Blog", type: "text", maxLength: 40, default: "Journal" },
  { key: "blog.intro", label: "Intro", section: "Blog", type: "text", maxLength: 160, default: "Notes on burnout, leadership, and living well under pressure." },

  /* ── Newsletter ── */
  { key: "newsletter.title", label: "Title", section: "Newsletter", type: "text", maxLength: 60, default: "Subscribe to the newsletter" },
  {
    key: "newsletter.body", label: "Text", section: "Newsletter", type: "textarea", maxLength: 200,
    default: "Occasional notes on stress, leadership and recovery. No spam.",
  },

  /* ── Booking page ── */
  { key: "bookingpage.title", label: "Page title", section: "Booking page", type: "text", maxLength: 40, default: "Book a session" },
  {
    key: "bookingpage.body", label: "Supporting text", section: "Booking page", type: "textarea", maxLength: 300,
    default: "Pick the day and time that work for you and you'll get a confirmation by email.",
  },
];

/** Posiciones fijas de foto/video que el admin puede reemplazar. */
export interface MediaSlotDef {
  slot: string;
  label: string;
  /** Guía para el cliente: qué foto debería ir aquí */
  hint: string;
  accept: "image" | "video-or-image";
}

export const MEDIA_SLOTS: MediaSlotDef[] = [
  { slot: "about", label: "Portrait · About", hint: "Editorial portrait of Christina, 4:5 (vertical).", accept: "image" },
  { slot: "service-1", label: "Photo · Service 1 (Burnout)", hint: "16:10 image — e.g. office at dusk.", accept: "image" },
  { slot: "service-2", label: "Photo · Service 2 (Family)", hint: "16:10 image — e.g. warm living room, family.", accept: "image" },
  { slot: "service-3", label: "Photo · Service 3 (Communication)", hint: "16:10 image — e.g. two people talking.", accept: "image" },
  { slot: "linktree-avatar", label: "Linktree avatar", hint: "Square logo or photo.", accept: "image" },
];

const fieldByKey = new Map(CONTENT_FIELDS.map((f) => [f.key, f]));

export function getField(key: string): ContentField | undefined {
  return fieldByKey.get(key);
}

export const CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  CONTENT_FIELDS.map((f) => [f.key, f.default]),
);
