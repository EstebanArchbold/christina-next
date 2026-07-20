import type { SiteContent } from "@/lib/content";
import { ArrowIcon, Horizon, lines } from "./bits";
import { Nav } from "./Nav";

export function Hero({ content }: { content: SiteContent }) {
  const headline = lines(content["hero.headline"]);
  const meta = lines(content["hero.meta"]);

  return (
    <div
      className="hero"
      id="top"
      style={{ background: "linear-gradient(180deg, #0a0e18 0%, #141b2d 60%, #0a0e18 100%)" }}
    >
      <div className="starfield" />
      <div className="breath-orb" style={{ width: 600, height: 600, top: "20%", right: "-10%" }} />
      <div className="breath-orb" style={{ width: 400, height: 400, bottom: "10%", left: "-5%", animationDelay: "2s" }} />
      <Horizon />
      <Nav brand={content["site.name"]} />
      <div className="hero-inner">
        <div className="breath-pulse">
          <span className="dot" />
          {content["hero.pill"]}
        </div>
        <h1 className="hero-title">
          {headline.map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
          <em>{content["hero.headline_em"]}</em>
        </h1>
        <p className="hero-sub">{content["hero.sub"]}</p>
        <div className="hero-cta-row">
          <a className="btn btn-primary" href="#booking">
            {content["hero.cta1"]}
            <ArrowIcon />
          </a>
          <a className="btn btn-ghost" href="#about">
            {content["hero.cta2"]}
          </a>
        </div>
        <div className="hero-meta">
          {meta.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
