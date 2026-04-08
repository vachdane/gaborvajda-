"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAssessment } from "@/hooks/use-assessment";
import { ProgressBar } from "./progress-bar";
import { QuestionCard } from "./question-card";
import { ContactForm } from "./contact-form";
import { LoadingScreen } from "./loading-screen";
import { QUESTIONS, PAIN_HINTS } from "@/lib/constants";

export function AssessmentFlow() {
  const router = useRouter();
  const assessment = useAssessment();
  const [freeTextExtras, setFreeTextExtras] = useState<Record<string, string>>(
    {}
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFreeTextExtra = useCallback(
    (questionId: string, value: string) => {
      setFreeTextExtras((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    assessment.setSubmitting(true);
    assessment.setError(null);
    setIsProcessing(true);

    try {
      // Build the full answers object with labels for the API
      const answersWithLabels: Record<string, unknown> = {};
      for (const q of QUESTIONS) {
        const raw = assessment.answers[q.id];
        if (raw === undefined) continue;

        if (q.type === "single-select" && q.options) {
          const option = q.options.find((o) => o.id === raw);
          if (option?.hasFreeText && freeTextExtras[q.id]) {
            answersWithLabels[q.id] = `${option.label}: ${freeTextExtras[q.id]}`;
          } else {
            answersWithLabels[q.id] = option?.label || raw;
          }
        } else if (q.type === "multi-select" && q.options && Array.isArray(raw)) {
          answersWithLabels[q.id] = (raw as string[]).map(
            (id) => q.options!.find((o) => o.id === id)?.label || id
          );
        } else if (q.type === "pain-details") {
          // Convert pain details from {id: text} to {label: text}
          const painMap = raw as Record<string, string>;
          const labeled: Record<string, string> = {};
          for (const [id, text] of Object.entries(painMap)) {
            if (text.trim()) {
              const hint = PAIN_HINTS[id];
              labeled[hint?.question || id] = text;
            }
          }
          answersWithLabels[q.id] = labeled;
        } else {
          answersWithLabels[q.id] = raw;
        }
      }

      // Get industry and team_size labels
      const industryQ = QUESTIONS.find((q) => q.id === "industry");
      const industryOption = industryQ?.options?.find(
        (o) => o.id === assessment.answers.industry
      );
      const industryLabel =
        industryOption?.hasFreeText && freeTextExtras.industry
          ? `${industryOption.label}: ${freeTextExtras.industry}`
          : industryOption?.label || (assessment.answers.industry as string);

      const teamQ = QUESTIONS.find((q) => q.id === "team_size");
      const teamLabel =
        teamQ?.options?.find((o) => o.id === assessment.answers.team_size)
          ?.label || (assessment.answers.team_size as string);

      // Step 1: Save lead
      const leadRes = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: assessment.contactInfo.name,
          email: assessment.contactInfo.email,
          phone: assessment.contactInfo.phone || null,
          gdpr_consent: assessment.contactInfo.gdprConsent,
        }),
      });

      if (!leadRes.ok) {
        const data = await leadRes.json();
        throw new Error(data.error || "Hiba a mentés során");
      }

      // Step 2: Save assessment (fast — no Claude call)
      const assessRes = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: assessment.contactInfo.email,
          answers: answersWithLabels,
          industry: industryLabel,
          team_size: teamLabel,
        }),
      });

      if (!assessRes.ok) {
        const data = await assessRes.json();
        throw new Error(data.error || "Hiba az elemzés során");
      }

      const assessData = await assessRes.json();

      // Pass assessment_id to thank-you page for background processing
      router.push(`/koszonjuk?aid=${assessData.assessment_id}`);
    } catch (err) {
      assessment.setError(
        err instanceof Error
          ? err.message
          : "Váratlan hiba történt. Kérlek próbáld újra."
      );
      setIsProcessing(false);
    } finally {
      assessment.setSubmitting(false);
    }
  }, [assessment, freeTextExtras, router]);

  if (isProcessing && assessment.isSubmitting) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <ProgressBar
          currentStep={assessment.currentStep}
          totalSteps={assessment.totalSteps}
        />
      </div>

      {assessment.isQuestionStep && assessment.currentQuestion && (
        <QuestionCard
          key={assessment.currentQuestion.id}
          question={assessment.currentQuestion}
          answers={assessment.answers}
          freeTextExtras={freeTextExtras}
          onAnswer={(value) =>
            assessment.setAnswer(assessment.currentQuestion!.id, value)
          }
          onFreeTextExtra={handleFreeTextExtra}
          onNext={assessment.goNext}
          onPrev={assessment.goPrev}
          canProceed={assessment.canProceed()}
          isFirst={assessment.currentStep === 0}
        />
      )}

      {assessment.isContactStep && (
        <ContactForm
          name={assessment.contactInfo.name}
          email={assessment.contactInfo.email}
          phone={assessment.contactInfo.phone}
          gdprConsent={assessment.contactInfo.gdprConsent}
          isSubmitting={assessment.isSubmitting}
          error={assessment.error}
          onNameChange={(v) => assessment.setContact("name", v)}
          onEmailChange={(v) => assessment.setContact("email", v)}
          onPhoneChange={(v) => assessment.setContact("phone", v)}
          onGdprChange={(v) => assessment.setContact("gdprConsent", v)}
          onSubmit={handleSubmit}
          onPrev={assessment.goPrev}
        />
      )}
    </div>
  );
}
