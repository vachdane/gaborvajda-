import { CheckCircle, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ThankYouPage() {
  const calendlyUrl =
    process.env.NEXT_PUBLIC_CALENDLY_URL ||
    "https://calendly.com/gaborvajda/30min";

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
            Köszönjük a válaszaidat!
          </h1>

          <p className="text-muted-foreground mt-4 text-lg leading-relaxed font-body max-w-md mx-auto">
            Az AI elemzés alapján összeállítottuk a személyre szabott
            javaslataidat. Hamarosan megkapod emailben!
          </p>

          <div className="mt-10 p-6 bg-card rounded-xl border border-border max-w-md mx-auto">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Szeretnéd részletesebben átbeszélni?
            </h2>
            <p className="text-muted-foreground mt-2 text-sm font-body">
              Foglalj egy ingyenes, 30 perces konzultációt, ahol személyesen
              átbeszéljük a javaslatokat.
            </p>
            <div className="mt-5">
              <Button asChild size="lg">
                <a href={calendlyUrl} target="_blank" rel="noopener noreferrer">
                  Konzultáció foglalása
                  <Calendar className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <Button variant="ghost" asChild>
              <Link href="https://www.gaborvajda.com">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Vissza a főoldalra
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
