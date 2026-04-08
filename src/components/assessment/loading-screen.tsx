"use client";

import { Bot } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center">
          <Bot className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
      </div>
      <h3 className="font-heading text-xl font-semibold text-foreground mt-8">
        Az AI elemzi a válaszaidat...
      </h3>
      <p className="text-muted-foreground mt-2 font-body text-center max-w-sm">
        Személyre szabott javaslatokat készítünk a céged számára. Ez általában
        10-20 másodpercet vesz igénybe.
      </p>
    </div>
  );
}
