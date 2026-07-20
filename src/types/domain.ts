export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type EventStatus = "active" | "cancelled";

export interface SiteEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  starts_at: string;
  ends_at: string | null;
  status: EventStatus;
  created_at: string;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  notes: string;
  status: BookingStatus;
  google_event_id: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  reason: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface BookingSettings {
  /** 0=domingo … 6=sábado */
  openDays: number[];
  openTime: string; // HH:MM
  closeTime: string; // HH:MM
  slotMinutes: number;
  maxPerSlot: number;
}

export const DEFAULT_BOOKING_SETTINGS: BookingSettings = {
  openDays: [1, 2, 3, 4, 5, 6],
  openTime: "09:00",
  closeTime: "18:00",
  slotMinutes: 60,
  maxPerSlot: 1,
};
