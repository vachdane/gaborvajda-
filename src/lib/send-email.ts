import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/service";
import { renderEmailHtml } from "@/lib/email-template";

export async function sendAssessmentEmail(assessmentId: string) {
  const supabase = createServiceClient();

  const { data: assessment, error: assessError } = await supabase
    .from("assessments")
    .select("*, leads(*)")
    .eq("id", assessmentId)
    .single();

  if (assessError || !assessment) {
    throw new Error(`Assessment not found: ${assessmentId}`);
  }

  if (!assessment.ai_suggestions) {
    throw new Error(`No AI suggestions for assessment: ${assessmentId}`);
  }

  const lead = assessment.leads;
  if (!lead) {
    throw new Error(`Lead not found for assessment: ${assessmentId}`);
  }

  const emailHtml = renderEmailHtml({
    industry: assessment.industry,
    suggestions: assessment.ai_suggestions,
    calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/gaborvajda",
  });

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Vajda Gábor <gabor@gaborvajda.com>",
    to: lead.email,
    subject: `${lead.email.split("@")[0]}, itt az AI automatizálási javaslatod!`,
    html: emailHtml,
  });

  // Update assessment with email info
  await supabase
    .from("assessments")
    .update({
      email_html: emailHtml,
      email_sent_at: new Date().toISOString(),
    })
    .eq("id", assessmentId);
}
