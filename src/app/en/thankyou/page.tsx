"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("aid");
  const processedRef = useRef(false);

  const calendlyUrl =
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    "https://calendly.com/saasxpert/30min";

  useEffect(() => {
    if (!assessmentId || processedRef.current) return;
    processedRef.current = true;

    fetch("/api/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assessment_id: assessmentId }),
    }).catch((err) => {
      console.error("Background processing error:", err);
    });
  }, [assessmentId]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-accent-light flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Thank you for your answers!
          </h1>

          <p className="text-muted-foreground mt-4 text-lg leading-relaxed font-body max-w-md mx-auto">
            The AI is putting together your personalised suggestions.
            You&apos;ll receive them by email shortly!
          </p>

          <div className="mt-10 p-6 bg-card rounded-xl border border-border max-w-md mx-auto">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Want to discuss this in more detail?
            </h2>
            <p className="text-muted-foreground mt-2 text-sm font-body">
              Book a free 30-minute consultation and we&apos;ll walk through
              the suggestions together.
            </p>
            <div className="mt-5">
              <Button asChild size="lg">
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a consultation
                  <Calendar className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <Button variant="ghost" asChild>
              <Link href="https://www.gaborvajda.com">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to main site
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ThankYouPageEn() {
  return (
    <Suspense fallback={null}>
      <ThankYouContent />
    </Suspense>
  );
}
