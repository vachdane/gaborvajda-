import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase/service";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/claude-prompt";
import { sendAssessmentEmail } from "@/lib/send-email";
import { z } from "zod";

export const maxDuration = 60;

const processSchema = z.object({
  assessment_id: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = processSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid assessment_id" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Fetch assessment
    const { data: assessment, error: fetchError } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", parsed.data.assessment_id)
      .single();

    if (fetchError || !assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    // Skip if already processed
    if (assessment.ai_suggestions) {
      return NextResponse.json({ success: true, already_processed: true });
    }

    // Call Claude API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const userPrompt = buildUserPrompt(
      assessment.answers as Record<string, unknown>,
      assessment.industry,
      assessment.team_size
    );

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

    // Send email
    try {
      await sendAssessmentEmail(assessment.id);
    } catch (emailError) {
      console.error("Email send error:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Process error:", err);
    return NextResponse.json(
      { error: "Processing failed" },
      { status: 500 }
    );
  }
}
