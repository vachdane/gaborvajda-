import { createClient } from "https://esm.sh/@supabase/supabase-js@2.102.1";

const SYSTEM_PROMPT = `Te Vajda Gábor vagy, üzleti AI tervező és építő. Egyedi, AI-alapú üzleti alkalmazásokat tervezel és építesz magyar kis- és középvállalkozásoknak.

A háttered: 10+ év termékdesign tapasztalat (Philips, Honeywell, 70+ B2B SaaS projekt), Certified Scrum Product Owner. Nem fejlesztő vagy, nem ügynökség — hanem egy termékdesigner aki épít. Először megérted az üzleti problémát, aztán megtervezed és megépíted a megoldást.

Amit csinálsz: egyedi digitális eszközöket építesz, amelyek kiváltják a kézi, Excel-alapú vagy szétszórt munkafolyamatokat. Az alkalmazásaid AI képességeket is tartalmaznak (hangalapú adatbevitel, dokumentum-generálás, intelligens javaslatok, automatikus összefoglalók), de csak ott, ahol az valódi értéket teremt.

A feladatod: a kitöltött felmérés alapján adj 3-5 konkrét, gyakorlatias, ROI-fókuszú automatizálási és AI javaslatot.

FONTOS SZABÁLYOK:
- NE említs konkrét eszközneveket, szoftvereket vagy platformokat (NE írj Make.com-ot, Zapiert, ChatGPT-t, n8n-t, semmilyen konkrét terméket). Ehelyett írd le MIT csinálna a megoldás, ne azt MILYEN ESZKÖZZEL.
- Beszélj megoldásokról, rendszerekről, automatizálásokról — de ne reklámozz eszközöket
- A válaszaikból idézz vissza konkrétumokat, hogy lássák: tényleg megértetted a problémájukat
- Tegezz, legyél barátságos de szakmai
- Az iparágukra szabd a javaslatokat
- A csapatméret alapján kalibráld a becsléseket
- Ha kicsi a cég (1-5 fő), az egyszerű, gyorsan bevezethető megoldásokat preferáld
- Ha nagyobb a cég (15+ fő), a komplexebb, integrált rendszerek is szóba jöhetnek

Minden javaslatot az alábbi struktúrában adj meg:

## [Javaslat címe]

**Probléma:** [Amit most kézzel/ineffektíven csinálnak — a válaszaikból konkrétan visszaidézve]
**Megoldás:** [MIT csinálna a rendszer, hogyan működne a gyakorlatban — eszköznevek NÉLKÜL]
**Becsült megtakarítás:** [óra/hét VAGY Ft/hó — konkrét de reális]
**Komplexitás:** [Egyszerű ⭐ / Közepes ⭐⭐ / Haladó ⭐⭐⭐]

---

A végén adj egy összesítést:

## Összesítés
**Becsült összes megtakarítás:** [X óra/hét vagy Y Ft/hó]
**Ajánlott első lépés:** [Melyik javaslattal érdemes kezdeni és miért]`;

function buildUserPrompt(
  answers: Record<string, unknown>,
  industry: string,
  teamSize: string
): string {
  const lines: string[] = [
    `Iparág: ${industry}`,
    `Csapatméret: ${teamSize}`,
    "",
  ];

  const labelMap: Record<string, string> = {
    time_wasters: "Legnagyobb időrabló feladatok",
    current_tools: "Jelenleg használt eszközök",
    pain_details: "Részletes fájdalompontok területenként",
    dream_automation: "Álom automatizáció",
    revenue: "Éves forgalom",
  };

  for (const [key, value] of Object.entries(answers)) {
    if (key === "industry" || key === "team_size") continue;

    const label = labelMap[key] || key;

    if (key === "pain_details" && typeof value === "object" && value !== null) {
      lines.push(`${label}:`);
      for (const [area, detail] of Object.entries(
        value as Record<string, string>
      )) {
        if (detail) {
          lines.push(`  - ${area}: ${detail}`);
        }
      }
    } else if (Array.isArray(value)) {
      lines.push(`${label}: ${value.join(", ")}`);
    } else if (value) {
      lines.push(`${label}: ${value}`);
    }
  }

  return lines.join("\n");
}

// --- Email template ---

function markdownToHtml(markdown: string): string {
  const html = markdown
    .replace(
      /^## (.+)$/gm,
      '<h2 style="font-family: Georgia, serif; font-size: 20px; color: #2E2518; margin: 28px 0 12px 0; padding-top: 16px;">$1</h2>'
    )
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong style="color: #2E2518;">$1</strong>'
    )
    .replace(/\n\n/g, '</p><p style="font-family: Arial, sans-serif; font-size: 15px; color: #4A3D2E; line-height: 1.7; margin: 0 0 12px 0;">')
    .replace(/\n/g, "<br>")
    .replace(/---/g, '<hr style="border: none; border-top: 1px solid #E8DFD4; margin: 24px 0;">');

  return `<p style="font-family: Arial, sans-serif; font-size: 15px; color: #4A3D2E; line-height: 1.7; margin: 0 0 12px 0;">${html}</p>`;
}

function renderEmailHtml(
  firstName: string,
  industry: string,
  suggestions: string,
  calendlyUrl: string
): string {
  const suggestionsHtml = markdownToHtml(suggestions);

  return `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Automatizálási Javaslatok</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFFCF7; font-family: Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FFFCF7;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px; text-align: center;">
              <h1 style="font-family: Georgia, serif; font-size: 28px; color: #2E2518; margin: 0;">
                Vajda Gábor
              </h1>
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: #8B7D6B; margin: 8px 0 0 0;">
                Üzleti AI tervező és építő
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background-color: #FFFFFF; border-radius: 12px; padding: 32px; border: 1px solid #E8DFD4;">

              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #4A3D2E; line-height: 1.7; margin: 0 0 16px 0;">
                Szia ${firstName}!
              </p>
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #4A3D2E; line-height: 1.7; margin: 0 0 24px 0;">
                Köszönöm, hogy kitöltötted a felmérést! Átnéztem a válaszaidat — mint <strong>${industry}</strong> területen dolgozó szakembernek, az alábbi AI automatizálási lehetőségeket javaslom:
              </p>

              <!-- AI Suggestions -->
              <div style="border-left: 3px solid #C2613A; padding-left: 20px; margin: 24px 0;">
                ${suggestionsHtml}
              </div>

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 32px 0 16px 0;">
                <tr>
                  <td align="center">
                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #4A3D2E; line-height: 1.7; margin: 0 0 20px 0;">
                      Szeretnéd, ha részletesebben átbeszélnénk ezeket a lehetőségeket?<br>
                      Foglalj egy ingyenes, 30 perces konzultációt:
                    </p>
                    <a href="${calendlyUrl}" target="_blank" style="display: inline-block; background-color: #C2613A; color: #FFFFFF; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 36px; border-radius: 50px;">
                      Konzultáció foglalása &rarr;
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; text-align: center;">
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: #2E2518; font-weight: 600; margin: 0;">
                Vajda Gábor
              </p>
              <p style="font-family: Arial, sans-serif; font-size: 13px; color: #8B7D6B; line-height: 1.6; margin: 4px 0 0 0;">
                Üzleti AI tervező és építő<br>
                Egyedi alkalmazások magyar vállalkozásoknak.<br>
                <a href="https://www.gaborvajda.com" style="color: #C2613A; text-decoration: none;">www.gaborvajda.com</a>
              </p>
              <p style="font-family: Arial, sans-serif; font-size: 11px; color: #B0A696; margin: 16px 0 0 0;">
                Ezt az emailt azért kaptad, mert kitöltötted az AI felmérést a felmeres.gaborvajda.com oldalon.<br>
                Saasxpert Kft.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function getFirstName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : parts[0];
}

// --- Main handler ---

Deno.serve(async (req) => {
  try {
    const { assessment_id } = await req.json();

    if (!assessment_id) {
      return new Response(JSON.stringify({ error: "Missing assessment_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Init Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY")!;
    const fromEmail =
      Deno.env.get("RESEND_FROM_EMAIL") ||
      "Vajda Gábor <gabor@gaborvajda.com>";
    const calendlyUrl =
      Deno.env.get("CALENDLY_URL") ||
      "https://calendly.com/saasxpert/30min";

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Fetch assessment
    const { data: assessment, error: fetchError } = await supabase
      .from("assessments")
      .select("*, leads(*)")
      .eq("id", assessment_id)
      .single();

    if (fetchError || !assessment) {
      return new Response(
        JSON.stringify({ error: "Assessment not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Skip if already processed
    if (assessment.ai_suggestions) {
      return new Response(
        JSON.stringify({ status: "already_processed" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Call Claude API (using raw fetch — no SDK needed in Deno)
    const userPrompt = buildUserPrompt(
      assessment.answers as Record<string, unknown>,
      assessment.industry,
      assessment.team_size
    );

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        temperature: 0.7,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error("Claude API error:", claudeRes.status, errText);
      return new Response(
        JSON.stringify({ error: "Claude API failed", detail: errText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const claudeData = await claudeRes.json();
    const aiSuggestions =
      claudeData.content?.[0]?.type === "text"
        ? claudeData.content[0].text
        : "";

    // Save AI suggestions to DB
    await supabase
      .from("assessments")
      .update({ ai_suggestions: aiSuggestions })
      .eq("id", assessment.id);

    // Send email via Resend (raw fetch)
    const lead = assessment.leads;
    if (lead && aiSuggestions) {
      const firstName = getFirstName(lead.name || "");
      const emailHtml = renderEmailHtml(
        firstName,
        assessment.industry,
        aiSuggestions,
        calendlyUrl
      );

      const subjectName = firstName || lead.email.split("@")[0];

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: lead.email,
          subject: `${subjectName}, itt az AI automatizálási javaslatod!`,
          html: emailHtml,
        }),
      });

      if (!resendRes.ok) {
        const errText = await resendRes.text();
        console.error("Resend error:", resendRes.status, errText);
      } else {
        // Update email_sent_at
        await supabase
          .from("assessments")
          .update({
            email_html: emailHtml,
            email_sent_at: new Date().toISOString(),
          })
          .eq("id", assessment.id);
      }
    }

    return new Response(
      JSON.stringify({ status: "done", assessment_id }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Process error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
