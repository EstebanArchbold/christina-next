import type { SiteContent } from "@/lib/content";
import { ArrowIcon } from "./bits";

export function Services({ content, media }: { content: SiteContent; media: Record<string, string> }) {
  const services = [1, 2, 3].map((n) => ({
    num: `0${n}`,
    tag: content[`service${n}.tag`],
    title: content[`service${n}.title`],
    copy: content[`service${n}.copy`],
    img: media[`service-${n}`],
  }));

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">— {content["services.eyebrow"]}</span>
          <h2>
            {content["services.title"]}
            <br />
            <em>{content["services.title_em"]}</em>
          </h2>
          <p>{content["services.intro"]}</p>
        </div>
        <div className="services-grid">
          {services.map((s) => (
            <div key={s.num} className="service reveal">
              <div className={`service-img ${s.img ? "" : "img-placeholder-light"}`}>
                <span className="service-num">{s.num}</span>
                {s.img ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img className="media-cover" src={s.img} alt={s.title} loading="lazy" />
                ) : (
                  <>[ {s.tag} ]</>
                )}
              </div>
              <div className="service-body">
                <div className="service-tag">{s.tag}</div>
                <h4>{s.title}</h4>
                <p>{s.copy}</p>
                <a className="service-arrow" href="#booking">
                  {content["services.cta"]}
                  <ArrowIcon />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
