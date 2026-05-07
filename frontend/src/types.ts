// All shared types live here. If you add a DB column, add it here too.

export const STAGES = [
  "Applied",
  "Recruiter Screen",
  "Technical Interview",
  "Final Round",
  "Offer",
  "Rejected",
  "Archived",
] as const;

export type Stage = typeof STAGES[number];

export interface Job {
  id: number;
  title: string;
  company: string;
  url: string | null;
  source: string;
  stage: Stage;
  applied_at: string;
  last_updated: string;   // ISO string — this drives the staleness logic
  notes: string;
  contact_name: string | null;
  contact_email: string | null;
  salary_min: number | null;
  salary_max: number | null;
  location: string | null;
  remote: "remote" | "hybrid" | "onsite" | "unknown";
  created_at: string;
}