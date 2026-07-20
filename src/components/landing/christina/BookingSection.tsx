import type { SiteContent } from "@/lib/content";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { ArrowIcon, TickIcon, lines } from "./bits";

/**
 * Sección de reservas: copy del diseño a la izquierda y el widget
 * nativo del template (BookingFlow → Supabase + Google Calendar,
 * gestionado desde /admin/bookings) a la derecha, en la card dorada.
 */
export function BookingSection({ content }: { content: SiteContent }) {
  const title = lines(content["booking.title"]);
  const features = lines(content["booking.features"]);

  return (
    <section className="booking" id="booking">
      <div className="container">
        <div className="booking-grid">
          <div className="booking-copy reveal">
            <span className="eyebrow">— {content["booking.eyebrow"]}</span>
            <h2>
              {title.map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
              <em>{content["booking.title_em"]}</em>
            </h2>
            <p>{content["booking.body"]}</p>
            <div className="booking-features">
              {features.map((f, i) => (
                <div key={i} className="booking-feature">
                  <TickIcon />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <a className="btn btn-primary" href="#contact">
              {content["booking.cta"]}
              <ArrowIcon />
            </a>
          </div>
          <div className="cal reveal">
            <div className="cal-head">
              <span className="gcal-dot" />
              Live availability
            </div>
            <BookingFlow />
          </div>
        </div>
      </div>
    </section>
  );
}
