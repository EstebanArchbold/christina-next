import type { Metadata } from "next";
import Link from "next/link";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { getContent } from "@/lib/content";
import "@/components/landing/landing.css";

export const metadata: Metadata = { title: "Book a session" };

export default async function BookingPage() {
  const content = await getContent();

  return (
    <main className="booking-page">
      <Link href="/" className="post-back">
        ← {content["site.name"]}
      </Link>
      <h1 className="section-title">{content["bookingpage.title"]}</h1>
      <p className="section-intro">{content["bookingpage.body"]}</p>
      <BookingFlow />
    </main>
  );
}
