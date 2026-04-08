import { z } from "zod";

export const leadSchema = z.object({
  email: z.string().email("Érvényes email címet adj meg"),
  phone: z.string().optional().nullable(),
  gdpr_consent: z.literal(true, {
    message: "Az adatvédelmi hozzájárulás kötelező",
  }),
});

export const assessSchema = z.object({
  email: z.string().email(),
  answers: z.record(z.string(), z.unknown()),
  industry: z.string().min(1),
  team_size: z.string().min(1),
});

export const sendEmailSchema = z.object({
  assessment_id: z.string().uuid(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type AssessInput = z.infer<typeof assessSchema>;
