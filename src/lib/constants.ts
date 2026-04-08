export type QuestionType = "single-select" | "multi-select" | "free-text";

export interface QuestionOption {
  id: string;
  label: string;
  hasFreeText?: boolean;
}

export interface Question {
  id: string;
  intro?: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  required: boolean;
  conditional?: {
    dependsOn: string;
    templates: Record<string, string>;
    defaultText: string;
  };
}

export const QUESTIONS: Question[] = [
  {
    id: "industry",
    intro:
      "Szia! Gábor vagyok. Segítek kideríteni, hol spórolhatnál időt és pénzt AI-alapú automatizálással.",
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
      {
        id: "penzugy",
        label: "Pénzügy / Könyvelés / Tanácsadás",
      },
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
    ],
  },
  {
    id: "current_tools",
    text: "Milyen eszközöket használtok jelenleg a mindennapi munkához?",
    type: "multi-select",
    required: true,
    options: [
      { id: "excel", label: "Excel / Google Sheets" },
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
    ],
  },
  {
    id: "pain_detail",
    text: "", // Set dynamically based on Q3
    type: "free-text",
    required: true,
    conditional: {
      dependsOn: "time_wasters",
      templates: {
        ajanlatkeszites:
          "Az ajánlatkészítésnél mi a legnagyobb probléma? Mennyi időt vesz igénybe átlagosan egy ajánlat?",
        ugyfelkommunikacio:
          "Az ügyfélkommunikációban mi fáj a legjobban? Ugyanazokat a kérdéseket kapod újra meg újra?",
        csapatkoordinacio:
          "A csapatkoordinációban mi a legfrusztrálóbb? Honnan tudod, ki hol tart éppen?",
        adminisztracio:
          "Az adminisztrációban mi veszi el a legtöbb idődet? Milyen papírmunkát csinálsz rendszeresen?",
        szamlazas:
          "A számlázásnál mi okozza a legtöbb gondot? Mennyi időt töltesz vele havonta?",
        keszletkezeles:
          "A készletkezelésnél mi a legnagyobb kihívás? Hogyan követed most a rendeléseket?",
        riportok:
          "A riportok készítésénél mi a legidőigényesebb? Milyen adatokat kell rendszeresen összesítened?",
        crm: "Az ügyféladatok kezelésénél mi a legproblémásabb? Hol tartod most nyilván az ügyfeleidet?",
      },
      defaultText:
        "Mesélj egy kicsit bővebben a legnagyobb időrabló feladatodról! Mi a legfrusztrálóbb benne?",
    },
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

export function getQuestionText(
  question: Question,
  answers: Record<string, unknown>
): string {
  if (!question.conditional) return question.text;

  const dependsOnAnswer = answers[question.conditional.dependsOn];
  if (Array.isArray(dependsOnAnswer) && dependsOnAnswer.length > 0) {
    const firstPick = dependsOnAnswer[0] as string;
    return (
      question.conditional.templates[firstPick] ||
      question.conditional.defaultText
    );
  }
  return question.conditional.defaultText;
}
