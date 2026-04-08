"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send } from "lucide-react";

interface ContactFormProps {
  name: string;
  email: string;
  phone: string;
  gdprConsent: boolean;
  isSubmitting: boolean;
  error: string | null;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onGdprChange: (value: boolean) => void;
  onSubmit: () => void;
  onPrev: () => void;
}

export function ContactForm({
  name,
  email,
  phone,
  gdprConsent,
  isSubmitting,
  error,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onGdprChange,
  onSubmit,
  onPrev,
}: ContactFormProps) {
  const canSubmit =
    name.trim().length > 0 &&
    email.includes("@") &&
    email.includes(".") &&
    gdprConsent &&
    !isSubmitting;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="animate-fade-in-up">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground leading-tight">
            Már csak egy lépés!
          </h2>
          <p className="text-muted-foreground mt-2 font-body leading-relaxed">
            Add meg az elérhetőségedet, és küldök egy személyre szabott
            javaslatot AI automatizálási lehetőségekkel a céged számára.
          </p>
        </div>

        <div className="space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="name">Név *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Kovács Tamás"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email cím *</Label>
            <Input
              id="email"
              type="email"
              placeholder="pelda@email.hu"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefonszám (opcionális)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+36 30 123 4567"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
            />
          </div>

          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="gdpr"
              checked={gdprConsent}
              onCheckedChange={(checked) => onGdprChange(checked === true)}
            />
            <Label
              htmlFor="gdpr"
              className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
            >
              Elfogadom, hogy az adataimat a Saasxpert Kft. az AI felmérés
              kiértékelése és a személyre szabott javaslat elküldése céljából
              kezelje. Az adataimat bármikor töröltethetem.
            </Label>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive font-body">{error}</p>
        )}

        <div className="flex items-center gap-3 pt-4">
          <Button type="button" variant="ghost" size="sm" onClick={onPrev}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Vissza
          </Button>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="ml-auto"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Feldolgozás...</span>
            ) : (
              <>
                Kérem a javaslatokat
                <Send className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
