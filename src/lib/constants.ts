export type QuestionType = "single-select" | "multi-select" | "free-text" | "pain-details";
export type Lang = "hu" | "en";

export interface QuestionOption {
  id: string;
  label: string;
  hasFreeText?: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  required: boolean;
}

// Hints for each time waster — used in the dynamic pain detail step
export const PAIN_HINTS: Record<string, { question: string; placeholder: string }> = {
  ajanlatkeszites: {
    question: "Ajánlatkészítés, árazás",
    placeholder: "Pl. Mennyi időt vesz igénybe egy ajánlat? Mi benne az ismétlődő rész?",
  },
  adminisztracio: {
    question: "Adminisztráció, papírmunka",
    placeholder: "Pl. Milyen papírmunkát csinálsz rendszeresen? Mi veszi el a legtöbb időt?",
  },
  ugyfelkommunikacio: {
    question: "Ügyfélkommunikáció",
    placeholder: "Pl. Ugyanazokat a kérdéseket kapod újra meg újra? Mennyi emailt kapsz naponta?",
  },
  szamlazas: {
    question: "Számlázás, pénzügyek",
    placeholder: "Pl. Mi okozza a legtöbb gondot? Mennyi időt töltesz vele havonta?",
  },
  csapatkoordinacio: {
    question: "Csapatkoordináció, beosztás",
    placeholder: "Pl. Honnan tudod, ki hol tart? Hogyan osztod be a feladatokat?",
  },
  keszletkezeles: {
    question: "Készletkezelés, rendelés",
    placeholder: "Pl. Hogyan követed a készletet? Mi okozza a legnagyobb kihívást?",
  },
  riportok: {
    question: "Riportok, kimutatások",
    placeholder: "Pl. Milyen adatokat kell rendszeresen összesítened? Mennyi időbe telik?",
  },
  crm: {
    question: "Ügyféladatok kezelése",
    placeholder: "Pl. Hol tartod nyilván az ügyfeleidet? Mi a legproblémásabb benne?",
  },
  egyeb_waster: {
    question: "Egyéb időrabló terület",
    placeholder: "Pl. Milyen feladatról van szó? Mennyi időt vesz igénybe?",
  },
};

export const QUESTIONS: Question[] = [
  {
    id: "industry",
    text: "Először is — melyik területen dolgozol?",
    type: "single-select",
    required: true,
    options: [
      { id: "epitoipar", label: "Építőipar / Kivitelezés" },
      { id: "vendeglatas", label: "Vendéglátás / Szállás" },
      { id: "kereskedelem", label: "Kereskedelem (bolt, webshop)" },
      {
        id: "szolgaltatas",
        label: "Szolgáltatás (szépségápolás, szerviz, takarítás stb.)",
      },
      { id: "penzugy", label: "Pénzügy / Könyvelés" },
      { id: "jogi", label: "Jogi szolgáltatások" },
      { id: "sales", label: "Értékesítés / Sales" },
      { id: "egeszsegugy", label: "Egészségügy" },
      { id: "egyeb", label: "Egyéb", hasFreeText: true },
    ],
  },
  {
    id: "team_size",
    text: "Hányan vagytok a csapatban?",
    type: "single-select",
    required: true,
    options: [
      { id: "1", label: "Egyedül dolgozom" },
      { id: "2-5", label: "2–5 fő" },
      { id: "6-15", label: "6–15 fő" },
      { id: "16-50", label: "16–50 fő" },
      { id: "50+", label: "50+ fő" },
    ],
  },
  {
    id: "time_wasters",
    text: "Mire megy el a legtöbb időd, ami nem közvetlenül termel pénzt?",
    type: "multi-select",
    required: true,
    options: [
      { id: "ajanlatkeszites", label: "Ajánlatkészítés, árazás" },
      { id: "adminisztracio", label: "Adminisztráció, papírmunka" },
      {
        id: "ugyfelkommunikacio",
        label: "Ügyfélkommunikáció (email, telefon, chat)",
      },
      { id: "szamlazas", label: "Számlázás, pénzügyek" },
      { id: "csapatkoordinacio", label: "Csapatkoordináció, beosztás" },
      { id: "keszletkezeles", label: "Készletkezelés, rendelés" },
      { id: "riportok", label: "Riportok, kimutatások" },
      { id: "crm", label: "Ügyféladatok kezelése (CRM)" },
      { id: "egyeb_waster", label: "Egyéb", hasFreeText: true },
    ],
  },
  {
    id: "current_tools",
    text: "Milyen eszközöket használtok jelenleg a mindennapi munkához?",
    type: "multi-select",
    required: true,
    options: [
      { id: "excel", label: "Excel / Google Sheets" },
      { id: "email", label: "Email" },
      { id: "docs", label: "Word / Google Docs" },
      { id: "papir", label: "Papír alapú rendszer" },
      { id: "chat", label: "WhatsApp / Messenger csoportok" },
      {
        id: "szamlazo",
        label: "Számlázó program (Billingo, Számlázz.hu stb.)",
      },
      { id: "sajat", label: "Saját szoftver / belső rendszer" },
      {
        id: "dobozos",
        label: "Dobozos szoftver (pl. iScala, MiniCRM, Salesforce stb.)",
      },
      { id: "semmi", label: "Semmi különös, fejben tartom" },
      { id: "egyeb_tool", label: "Egyéb", hasFreeText: true },
    ],
  },
  {
    id: "pain_details",
    text: "Mesélj egy kicsit bővebben az egyes területekről!",
    type: "pain-details",
    required: true,
  },
  {
    id: "dream_automation",
    text: "Ha egy varázsütésre bármit automatizálhatnál a cégedben, mi lenne az?",
    type: "free-text",
    required: true,
  },
  {
    id: "revenue",
    text: "Utolsó kérdés — nagyjából mekkora az éves forgalmatok? (Ez segít releváns javaslatokat adni. Nem kötelező válaszolni.)",
    type: "single-select",
    required: false,
    options: [
      { id: "<50m", label: "< 50M Ft" },
      { id: "50-150m", label: "50–150M Ft" },
      { id: "150-500m", label: "150–500M Ft" },
      { id: "500m+", label: "500M+ Ft" },
      { id: "skip", label: "Nem szeretném megadni" },
    ],
  },
];

// ── English versions ──────────────────────────────────────────────────────────

export const PAIN_HINTS_EN: Record<string, { question: string; placeholder: string }> = {
  ajanlatkeszites: {
    question: "Quoting & Pricing",
    placeholder: "E.g. How long does it take to prepare a quote? What's the repetitive part?",
  },
  adminisztracio: {
    question: "Administration & Paperwork",
    placeholder: "E.g. What paperwork do you handle regularly? What takes the most time?",
  },
  ugyfelkommunikacio: {
    question: "Client Communication",
    placeholder: "E.g. Do you get the same questions over and over? How many emails do you receive daily?",
  },
  szamlazas: {
    question: "Invoicing & Finances",
    placeholder: "E.g. What causes the most trouble? How much time do you spend on it monthly?",
  },
  csapatkoordinacio: {
    question: "Team Coordination & Scheduling",
    placeholder: "E.g. How do you know who's working on what? How do you assign tasks?",
  },
  keszletkezeles: {
    question: "Inventory Management",
    placeholder: "E.g. How do you track inventory? What's the biggest challenge?",
  },
  riportok: {
    question: "Reports & Analytics",
    placeholder: "E.g. What data do you regularly need to compile? How long does it take?",
  },
  crm: {
    question: "Managing Client Data",
    placeholder: "E.g. Where do you keep track of your clients? What's the most problematic part?",
  },
  egyeb_waster: {
    question: "Other time-consuming area",
    placeholder: "E.g. What kind of task is it? How much time does it take?",
  },
};

export const QUESTIONS_EN: Question[] = [
  {
    id: "industry",
    text: "First of all — which field do you work in?",
    type: "single-select",
    required: true,
    options: [
      { id: "epitoipar", label: "Construction / Contracting" },
      { id: "vendeglatas", label: "Hospitality / Accommodation" },
      { id: "kereskedelem", label: "Retail (store, webshop)" },
      { id: "szolgaltatas", label: "Services (beauty, maintenance, cleaning, etc.)" },
      { id: "penzugy", label: "Finance / Accounting" },
      { id: "jogi", label: "Legal Services" },
      { id: "sales", label: "Sales" },
      { id: "egeszsegugy", label: "Healthcare" },
      { id: "egyeb", label: "Other", hasFreeText: true },
    ],
  },
  {
    id: "team_size",
    text: "How many people are on your team?",
    type: "single-select",
    required: true,
    options: [
      { id: "1", label: "Just me" },
      { id: "2-5", label: "2–5 people" },
      { id: "6-15", label: "6–15 people" },
      { id: "16-50", label: "16–50 people" },
      { id: "50+", label: "50+ people" },
    ],
  },
  {
    id: "time_wasters",
    text: "What takes up most of your time that doesn't directly generate revenue?",
    type: "multi-select",
    required: true,
    options: [
      { id: "ajanlatkeszites", label: "Quoting, pricing" },
      { id: "adminisztracio", label: "Administration, paperwork" },
      { id: "ugyfelkommunikacio", label: "Client communication (email, phone, chat)" },
      { id: "szamlazas", label: "Invoicing, finances" },
      { id: "csapatkoordinacio", label: "Team coordination, scheduling" },
      { id: "keszletkezeles", label: "Inventory management, ordering" },
      { id: "riportok", label: "Reports, analytics" },
      { id: "crm", label: "Managing client data (CRM)" },
      { id: "egyeb_waster", label: "Other", hasFreeText: true },
    ],
  },
  {
    id: "current_tools",
    text: "What tools do you currently use for day-to-day work?",
    type: "multi-select",
    required: true,
    options: [
      { id: "excel", label: "Excel / Google Sheets" },
      { id: "email", label: "Email" },
      { id: "docs", label: "Word / Google Docs" },
      { id: "papir", label: "Paper-based system" },
      { id: "chat", label: "WhatsApp / Messenger groups" },
      { id: "szamlazo", label: "Invoicing software (QuickBooks, Xero, etc.)" },
      { id: "sajat", label: "Custom software / internal system" },
      { id: "dobozos", label: "Off-the-shelf software (e.g. Salesforce, HubSpot, etc.)" },
      { id: "semmi", label: "Nothing special, I keep it in my head" },
      { id: "egyeb_tool", label: "Other", hasFreeText: true },
    ],
  },
  {
    id: "pain_details",
    text: "Tell us a bit more about each area!",
    type: "pain-details",
    required: true,
  },
  {
    id: "dream_automation",
    text: "If you could automate anything in your business with a magic wand, what would it be?",
    type: "free-text",
    required: true,
  },
  {
    id: "revenue",
    text: "Last question — roughly what is your annual revenue? (This helps us provide relevant suggestions. Not required.)",
    type: "single-select",
    required: false,
    options: [
      { id: "<50m", label: "Under €50,000" },
      { id: "50-150m", label: "€50,000 – €150,000" },
      { id: "150-500m", label: "€150,000 – €500,000" },
      { id: "500m+", label: "Over €500,000" },
      { id: "skip", label: "I'd prefer not to say" },
    ],
  },
];

export function getQuestions(lang: Lang): Question[] {
  return lang === "en" ? QUESTIONS_EN : QUESTIONS;
}

export function getPainHints(lang: Lang): Record<string, { question: string; placeholder: string }> {
  return lang === "en" ? PAIN_HINTS_EN : PAIN_HINTS;
}
