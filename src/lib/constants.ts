export type QuestionType = "single-select" | "multi-select" | "free-text" | "pain-details";

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
