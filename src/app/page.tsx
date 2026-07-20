import { About } from "@/components/landing/christina/About";
import { Benefits } from "@/components/landing/christina/Benefits";
import { BookingSection } from "@/components/landing/christina/BookingSection";
import { Contact } from "@/components/landing/christina/Contact";
import { Footer } from "@/components/landing/christina/Footer";
import { Hero } from "@/components/landing/christina/Hero";
import { RevealObserver } from "@/components/landing/christina/Reveal";
import { Services } from "@/components/landing/christina/Services";
import { Testimonials, type Testimonial } from "@/components/landing/christina/Testimonials";
import { lines } from "@/components/landing/christina/bits";
import { getContent, getMediaSlots } from "@/lib/content";
import "@/components/landing/christina.css";

export const revalidate = 60;

export default async function HomePage() {
  const [content, media] = await Promise.all([getContent(), getMediaSlots()]);

  // Testimonios con cita vacía se ocultan (así el admin puede usar 1–4).
  const testimonials: Testimonial[] = [1, 2, 3, 4]
    .map((n) => ({
      quote: (content[`testimonial${n}.quote`] ?? "").trim(),
      role: content[`testimonial${n}.role`] ?? "",
      meta: content[`testimonial${n}.meta`] ?? "",
    }))
    .filter((t) => t.quote !== "");

  return (
    <div className="et">
      <RevealObserver />
      <Hero content={content} />
      <About content={content} portraitUrl={media["about"]} />
      <Services content={content} media={media} />
      <Benefits content={content} />
      <BookingSection content={content} />
      <Testimonials
        eyebrow={content["testimonials.eyebrow"]}
        title={content["testimonials.title"]}
        titleEm={content["testimonials.title_em"]}
        note={content["testimonials.note"]}
        items={testimonials}
      />
      <Contact
        eyebrow={content["contact.eyebrow"]}
        titleLines={lines(content["contact.title"])}
        titleEm={content["contact.title_em"]}
        body={content["contact.body"]}
        email={content["site.email"]}
        availability={content["contact.availability"]}
        location={content["contact.location"]}
        reasons={lines(content["contact.reasons"])}
        note={content["contact.note"]}
      />
      <Footer content={content} />
    </div>
  );
}
