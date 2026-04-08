import { AssessmentFlow } from "@/components/assessment/assessment-flow";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in-up">
          <p
            className="text-lg text-primary font-bold mb-3"
            style={{ fontFamily: "var(--font-handwriting), cursive" }}
          >
            Ingyenes AI felmérés
          </p>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Fedezd fel, hol spórolhatnál
            <br className="hidden md:block" />
            <span className="text-primary"> AI-val a cégedben</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-xl mx-auto leading-relaxed font-body">
            Töltsd ki ezt a rövid, 2 perces felmérést, és küldök neked egy
            személyre szabott javaslatot — konkrét megoldásokkal és
            megtakarítás becsléssel.
          </p>
        </div>

        {/* Assessment */}
        <AssessmentFlow />

        {/* Footer */}
        <footer className="mt-20 text-center">
          <p className="text-sm text-muted-foreground font-body">
            &copy; {new Date().getFullYear()} Vajda Gábor e.v. &middot;{" "}
            <a
              href="https://www.gaborvajda.com"
              className="text-primary hover:underline"
            >
              www.gaborvajda.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
