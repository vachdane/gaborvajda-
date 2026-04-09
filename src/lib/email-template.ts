interface EmailTemplateProps {
  firstName: string;
  industry: string;
  suggestions: string;
  calendlyUrl: string;
}

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

export function renderEmailHtml({
  firstName,
  industry,
  suggestions,
  calendlyUrl,
}: EmailTemplateProps): string {
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
                AI tanácsadás és tervezés vállalkozásoknak
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
                AI tanácsadás és tervezés vállalkozásoknak<br>
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
