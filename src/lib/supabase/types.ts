export interface Lead {
  id: string;
  email: string;
  phone: string | null;
  gdpr_consent: boolean;
  gdpr_consented_at: string | null;
  source: string;
  created_at: string;
}

export interface LeadInsert {
  email: string;
  phone?: string | null;
  gdpr_consent: boolean;
  gdpr_consented_at?: string | null;
  source?: string;
}

export interface Assessment {
  id: string;
  lead_id: string;
  answers: Record<string, unknown>;
  industry: string;
  team_size: string;
  ai_suggestions: string | null;
  email_html: string | null;
  email_sent_at: string | null;
  created_at: string;
}

export interface AssessmentInsert {
  lead_id: string;
  answers: Record<string, unknown>;
  industry: string;
  team_size: string;
  ai_suggestions?: string | null;
  email_html?: string | null;
}
