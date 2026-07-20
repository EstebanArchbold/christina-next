import type { SiteContent } from "@/lib/content";
import { lines } from "./bits";

const ROMAN = ["I", "II", "III"];

export function Benefits({ content }: { content: SiteContent }) {
  const benefits = [1, 2, 3].map((n, i) => ({
    num: ROMAN[i],
    title: content[`benefit${n}.title`],
    copy: content[`benefit${n}.copy`],
  }));
  const expect = lines(content["benefits.expect"]);

  return (
    <section className="benefits" id="benefits">
      <div className="benefits-bg-orb" />
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">— {content["benefits.eyebrow"]}</span>
          <h2>
            {content["benefits.title"]}
            <br />
            <em>{content["benefits.title_em"]}</em>
          </h2>
          <p>{content["benefits.intro"]}</p>
        </div>
        <div className="benefits-grid reveal">
          {benefits.map((b) => (
            <div key={b.num} className="benefit">
              <div className="benefit-num">{b.num} ·</div>
              <h4>{b.title}</h4>
              <p>{b.copy}</p>
            </div>
          ))}
        </div>
        <div className="expect-strip reveal">
          <div className="label">{content["benefits.expect_label"]}</div>
          {expect.map((e, i) => (
            <div key={i} className="expect-item">
              <span className="check">✓</span>
              <span>{e}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
