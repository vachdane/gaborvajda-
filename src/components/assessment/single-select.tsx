"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { QuestionOption } from "@/lib/constants";

interface SingleSelectProps {
  options: QuestionOption[];
  value: string | undefined;
  freeTextValue?: string;
  onChange: (value: string) => void;
  onFreeTextChange?: (value: string) => void;
}

export function SingleSelect({
  options,
  value,
  freeTextValue,
  onChange,
  onFreeTextChange,
}: SingleSelectProps) {
  const selectedOption = options.find((o) => o.id === value);
  const showFreeText = selectedOption?.hasFreeText;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "px-5 py-2.5 rounded-full text-[15px] font-medium font-body border transition-all duration-200",
              value === option.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary hover:-translate-y-0.5"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {showFreeText && (
        <Input
          placeholder="Írd be a területed..."
          value={freeTextValue || ""}
          onChange={(e) => onFreeTextChange?.(e.target.value)}
          className="mt-3 w-full animate-fade-in-up"
          autoFocus
        />
      )}
    </div>
  );
}
