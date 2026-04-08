import { NextRequest, NextResponse } from "next/server";
import { sendEmailSchema } from "@/lib/validation";
import { sendAssessmentEmail } from "@/lib/send-email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = sendEmailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await sendAssessmentEmail(parsed.data.assessment_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json(
      { error: "Hiba az email küldés során." },
      { status: 500 }
    );
  }
}
