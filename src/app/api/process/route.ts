import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase/service";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/claude-prompt";
import { sendAssessmentEmail } from "@/lib/send-email";
import { z } from "zod";

const processSchema = z.object({
  assessment_id: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = processSchema.safeParse(body);

  if (!parsed.success) {
    return new Response("Invalid assessment_id", { status: 400 });
  }

  // Use streaming response to keep connection alive on Vercel Hobby plan
  // (10s timeout only applies to time-to-first-byte)
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode("data: processing\n\n"));

        const supabase = createServiceClient();

        const { data: assessment, error: fetchError } = await supabase
          .from("assessments")
          .select("*")
          .eq("id", parsed.data.assessment_id)
          .single();

        if (fetchError || !assessment) {
          controller.enqueue(encoder.encode("data: error\n\n"));
          controller.close();
          return;
        }

        if (assessment.ai_suggestions) {
          controller.enqueue(encoder.encode("data: already_done\n\n"));
          controller.close();
          return;
        }

        controller.enqueue(encoder.encode("data: calling_ai\n\n"));

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

        controller.enqueue(encoder.encode("data: saving\n\n"));

        // Save AI suggestions
        await supabase
          .from("assessments")
          .update({ ai_suggestions: aiSuggestions })
          .eq("id", assessment.id);

        controller.enqueue(encoder.encode("data: sending_email\n\n"));

        // Send email
        try {
          await sendAssessmentEmail(assessment.id);
        } catch (emailError) {
          console.error("Email send error:", emailError);
        }

        controller.enqueue(encoder.encode("data: done\n\n"));
      } catch (err) {
        console.error("Process error:", err);
        controller.enqueue(encoder.encode("data: error\n\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
