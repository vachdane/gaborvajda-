import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { assessSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = assessSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Find the lead by email
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id")
      .eq("email", parsed.data.email)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: "Lead nem található. Kérlek töltsd ki először a kapcsolati adatokat." },
        { status: 404 }
      );
    }

    // Insert assessment (without AI suggestions yet)
    const { data: assessment, error: assessError } = await supabase
      .from("assessments")
      .insert({
        lead_id: lead.id,
        answers: parsed.data.answers,
        industry: parsed.data.industry,
        team_size: parsed.data.team_size,
      })
      .select("id")
      .single();

    if (assessError || !assessment) {
      console.error("Supabase assessment insert error:", assessError);
      return NextResponse.json(
        { error: "Hiba az elemzés mentése során." },
        { status: 500 }
      );
    }

    return NextResponse.json({ assessment_id: assessment.id, success: true });
  } catch (err) {
    console.error("Assessment error:", err);
    return NextResponse.json(
      { error: "Hiba az elemzés mentése során. Kérlek próbáld újra." },
      { status: 500 }
    );
  }
}
