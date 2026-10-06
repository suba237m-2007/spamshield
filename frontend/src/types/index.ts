export interface User { id: number; name: string; email: string; created_at: string }
export interface Check {
  id: number; text: string; label: "spam" | "ham"; spam_probability: number;
  engine: "model" | "heuristic"; reasons: string[]; created_at: string;
}
export interface Stats {
  total: number; spam: number; ham: number; spam_rate: number;
  per_day: { date: string; spam: number; ham: number }[];
}
export interface ModelInfo {
  engine: "model" | "heuristic"; note: string | null;
  metrics: { accuracy: number; precision: number; recall: number; f1: number; dataset_size: number } | null;
}
