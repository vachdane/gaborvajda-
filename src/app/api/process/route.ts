import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const processSchema = z.object({
  assessment_id: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = processSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid assessment_id" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  try {
    // Invoke Supabase Edge Function (fire-and-forget from client perspective,
    // but the Edge Function has 60s to complete)
    const res = await fetch(
      `${supabaseUrl}/functions/v1/process-assessment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ assessment_id: parsed.data.assessment_id }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Edge Function error:", res.status, errText);
      return NextResponse.json(
        { error: "Processing failed", detail: errText },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Process invocation error:", err);
    return NextResponse.json(
      { error: "Failed to invoke processing" },
      { status: 500 }
    );
  }
}
