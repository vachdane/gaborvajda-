import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { leadSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Túl sok kérés. Kérlek próbáld újra később." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("leads")
      .upsert(
        {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone || null,
          gdpr_consent: parsed.data.gdpr_consent,
          gdpr_consented_at: new Date().toISOString(),
          source: "felmeres",
        },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    if (error) {
      console.error("Supabase lead upsert error:", error);
      return NextResponse.json(
        { error: "Hiba a mentés során." },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead_id: data.id });
  } catch {
    return NextResponse.json(
      { error: "Érvénytelen kérés." },
      { status: 400 }
    );
  }
}
