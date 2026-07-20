import type { SiteContent } from "@/lib/content";
import { lines } from "./bits";

/** Una credencial "MSW · Master of Social Work" → pill con la sigla resaltada. */
function Credential({ raw }: { raw: string }) {
  const sep = raw.indexOf("·");
  if (sep === -1) return <span className="credential">{raw}</span>;
  return (
    <span className="credential">
      <strong>{raw.slice(0, sep).trim()}</strong>· {raw.slice(sep + 1).trim()}
    </span>
  );
}

export function About({ content, portraitUrl }: { content: SiteContent; portraitUrl?: string }) {
  const title = lines(content["about.title"]);
  const creds = lines(content["about.credentials"]);

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="reveal" style={{ position: "relative" }}>
            <div className="about-portrait-frame" />
            {portraitUrl ? (
              <div className="about-portrait">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="media-cover" src={portraitUrl} alt={content["about.sig_name"]} />
              </div>
            ) : (
              <div className="about-portrait img-placeholder">[ Christina · editorial 4:5 ]</div>
            )}
          </div>
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 20 }}>— {content["about.eyebrow"]}</div>
            <h3>
              {title.map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
              <em>{content["about.title_em"]}</em>
            </h3>
            <p className="about-lede">{content["about.lede"]}</p>
            <p>{content["about.p1"]}</p>
            <p>{content["about.p2"]}</p>
            <div className="credentials">
              {creds.map((c, i) => (
                <Credential key={i} raw={c} />
              ))}
            </div>
            <div className="about-signature">
              <div className="sig">Christina</div>
              <div className="sig-label">
                <strong>{content["about.sig_name"]}</strong>
                {content["about.sig_role"]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
