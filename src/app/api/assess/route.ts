import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase/service";
import { assessSchema } from "@/lib/validation";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/claude-prompt";
import { sendAssessmentEmail } from "@/lib/send-email";

export const maxDuration = 30;

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

    // Insert assessment
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

    // Call Claude API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const userPrompt = buildUserPrompt(parsed.data.answers, parsed.data.industry, parsed.data.team_size);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const aiSuggestions =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Save AI suggestions
    await supabase
      .from("assessments")
      .update({ ai_suggestions: aiSuggestions })
      .eq("id", assessment.id);

    // Send email inline
    try {
      await sendAssessmentEmail(assessment.id);
    } catch (emailError) {
      console.error("Email send error:", emailError);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({ assessment_id: assessment.id, success: true });
  } catch (err) {
    console.error("Assessment error:", err);
    return NextResponse.json(
      { error: "Hiba az AI elemzés során. Kérlek próbáld újra." },
      { status: 500 }
    );
  }
}
