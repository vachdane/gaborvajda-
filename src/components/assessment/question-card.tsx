"use client";

import { Button } from "@/components/ui/button";
import { SingleSelect } from "./single-select";
import { MultiSelect } from "./multi-select";
import { FreeText } from "./free-text";
import { PainDetails } from "./pain-details";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { Question } from "@/lib/constants";

interface QuestionCardProps {
  question: Question;
  answers: Record<string, unknown>;
  freeTextExtras: Record<string, string>;
  onAnswer: (value: unknown) => void;
  onFreeTextExtra: (questionId: string, value: string) => void;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  isFirst: boolean;
}

export function QuestionCard({
  question,
  answers,
  freeTextExtras,
  onAnswer,
  onFreeTextExtra,
  onNext,
  onPrev,
  canProceed,
  isFirst,
}: QuestionCardProps) {
  const currentAnswer = answers[question.id];

  return (
    <div className="animate-fade-in-up">
      <div className="space-y-6">
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground leading-tight">
          {question.text}
        </h2>

        <div className="pt-2">
          {question.type === "single-select" && question.options && (
            <SingleSelect
              options={question.options}
              value={currentAnswer as string | undefined}
              freeTextValue={freeTextExtras[question.id]}
              onChange={(v) => onAnswer(v)}
              onFreeTextChange={(v) => onFreeTextExtra(question.id, v)}
            />
          )}

          {question.type === "multi-select" && question.options && (
            <MultiSelect
              options={question.options}
              value={(currentAnswer as string[]) || []}
              freeTextValues={freeTextExtras}
              onChange={(v) => onAnswer(v)}
              onFreeTextChange={(optionId, v) => onFreeTextExtra(optionId, v)}
            />
          )}

          {question.type === "free-text" && (
            <FreeText
              value={(currentAnswer as string) || ""}
              onChange={(v) => onAnswer(v)}
            />
          )}

          {question.type === "pain-details" && (
            <PainDetails
              selectedWasters={(answers.time_wasters as string[]) || []}
              value={(currentAnswer as Record<string, string>) || {}}
              freeTextExtras={freeTextExtras}
              onChange={(v) => onAnswer(v)}
            />
          )}
        </div>

        <div className="flex items-center gap-3 pt-4">
          {!isFirst && (
            <Button variant="ghost" size="sm" onClick={onPrev}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Vissza
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={!canProceed && question.required}
            className="ml-auto"
          >
            Tovább
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
