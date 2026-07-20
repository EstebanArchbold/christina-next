import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { createServiceClient } from "@/lib/supabase/admin";

const contactSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(60),
  last_name: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("That email doesn't look right").max(120),
  reason: z.string().trim().max(80).default(""),
  message: z.string().trim().max(2000).default(""),
});

/** POST — envío público del formulario de contacto de la landing. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const supabase = createServiceClient();
  const { error } = await supabase.from("contact_messages").insert(parsed.data);
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ ok: true });
}

/** GET — lista de mensajes recibidos. Solo admin. */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ messages: data });
}
