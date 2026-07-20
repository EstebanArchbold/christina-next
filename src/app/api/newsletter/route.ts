import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError, requireAdmin } from "@/lib/api-helpers";
import { createServiceClient } from "@/lib/supabase/admin";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address").max(200),
});

/** POST — suscripción pública al newsletter. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0].message);

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: parsed.data.email.toLowerCase().trim() });

  if (error) {
    if (error.code === "23505") {
      // ya suscrito — lo tratamos como éxito
      return NextResponse.json({ ok: true, already: true });
    }
    return jsonError(error.message, 500);
  }

  return NextResponse.json({ ok: true });
}

/** GET — lista de suscriptores. Solo admin. */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ subscribers: data });
}
