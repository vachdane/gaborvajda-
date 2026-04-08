"use client";

import { Textarea } from "@/components/ui/textarea";

interface FreeTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FreeText({ value, onChange, placeholder }: FreeTextProps) {
  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Írd le pár mondatban..."}
        rows={4}
        className="w-full resize-none"
      />
      <p className="text-xs text-muted-foreground font-body">
        {value.length} / 500 karakter
      </p>
    </div>
  );
}
