"use client";

import { Textarea } from "@/components/ui/textarea";
import { PAIN_HINTS } from "@/lib/constants";

interface PainDetailsProps {
  selectedWasters: string[];
  value: Record<string, string>;
  freeTextExtras?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

export function PainDetails({
  selectedWasters,
  value,
  freeTextExtras,
  onChange,
}: PainDetailsProps) {
  const handleChange = (wasterId: string, text: string) => {
    onChange({ ...value, [wasterId]: text });
  };

  return (
    <div className="space-y-6">
      {selectedWasters.map((wasterId) => {
        const hint = PAIN_HINTS[wasterId];
        if (!hint) return null;

        // Use the user's custom label for "Egyéb" options
        const label =
          hint.question === "Egyéb időrabló terület" && freeTextExtras?.[wasterId]
            ? freeTextExtras[wasterId]
            : hint.question;

        return (
          <div key={wasterId} className="space-y-2">
            <label className="text-base font-semibold font-body text-foreground">
              {label}
            </label>
            <Textarea
              value={value[wasterId] || ""}
              onChange={(e) => handleChange(wasterId, e.target.value)}
              placeholder={hint.placeholder}
              rows={3}
              className="w-full resize-none"
            />
          </div>
        );
      })}
    </div>
  );
}
