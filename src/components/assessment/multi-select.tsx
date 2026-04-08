"use client";

import { cn } from "@/lib/utils";
import type { QuestionOption } from "@/lib/constants";

interface MultiSelectProps {
  options: QuestionOption[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelect({ options, value, onChange }: MultiSelectProps) {
  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground font-body">
        Több választ is megjelölhetsz
      </p>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const isSelected = value.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-[15px] font-medium font-body border transition-all duration-200",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary hover:-translate-y-0.5"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
