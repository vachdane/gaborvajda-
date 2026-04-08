-- AI Felmérés Database Schema
-- Run this in the Supabase SQL Editor

-- leads table
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  phone text,
  gdpr_consent boolean NOT NULL DEFAULT false,
  gdpr_consented_at timestamptz,
  source text DEFAULT 'felmeres',
  created_at timestamptz DEFAULT now()
);

-- assessments table
CREATE TABLE assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  answers jsonb NOT NULL,
  industry text,
  team_size text,
  ai_suggestions text,
  email_html text,
  email_sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- RLS: deny all public access (service role bypasses RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_assessments_lead_id ON assessments(lead_id);
CREATE INDEX idx_leads_email ON leads(email);
