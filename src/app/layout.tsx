import type { Metadata } from "next";
import { Fraunces, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Felmérés | Vajda Gábor",
  description:
    "Töltsd ki a rövid felmérést és megmutatom, hogyan spórolhatsz időt és pénzt AI-alapú automatizálással.",
  openGraph: {
    title: "AI Felmérés | Vajda Gábor",
    description:
      "Fedezd fel, hol automatizálhatnál AI-val a cégedben. Ingyenes, személyre szabott javaslatok.",
    url: "https://felmeres.gaborvajda.com",
    siteName: "Vajda Gábor",
    locale: "hu_HU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body
        className={`${fraunces.variable} ${dmSans.variable} ${caveat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
