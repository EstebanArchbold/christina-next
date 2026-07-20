import Link from "next/link";
import type { SiteContent } from "@/lib/content";

export function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <span className="brand-mark" style={{ width: 32, height: 32, fontSize: 16 }}>C</span>
              <span>{content["site.name"]}</span>
            </div>
            <p>{content["footer.blurb"]}</p>
          </div>
          <div>
            <h5>Practice</h5>
            <ul>
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#benefits">Why Me</a></li>
              <li><a href="#booking">Book</a></li>
            </ul>
          </div>
          <div>
            <h5>Resources</h5>
            <ul>
              <li><Link href="/blog">Journal</Link></li>
              <li><Link href="/linktree">Links</Link></li>
              <li><Link href="/book">Book online</Link></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul>
              <li>
                <a href={`mailto:${content["site.email"]}`}>{content["site.email"]}</a>
              </li>
              <li><a href="#contact">Toronto, Ontario</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{content["footer.copyright"]}</span>
          <span>{content["footer.crisis"]}</span>
        </div>
      </div>
    </footer>
  );
}
