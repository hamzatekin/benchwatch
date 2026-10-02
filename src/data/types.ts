export type Category =
  | "coding"
  | "agentic"
  | "reasoning"
  | "preference"
  | "aggregator"
  | "computer-use"
  | "harness"
  | "drift";

export type Trust = "high" | "medium" | "low";
export type Independence = "independent" | "vendor-reported" | "mixed";

export interface Benchmark {
  id: string;
  name: string;
  org: string;
  url: string;
  category: Category;
  measures: string;
  currentLeader: string;
  leaderScore: string | null;
  takeaway: string;
  independence: Independence;
  trust: Trust;
  trustNote: string;
  /** Date the source's data reflects, YYYY-MM-DD */
  lastChecked: string;
  sourceUrls: string[];
}

export interface IntegrityIssue {
  title: string;
  summary: string;
  url: string;
  date: string;
}

export interface QuickAnswer {
  question: string;
  answer: string;
  why: string;
  price: string | null;
  runnerUp: string | null;
  sources: string[];
}

export interface HeroLeader {
  /** Benchmark id */
  benchmark: string;
  label: string;
  leader: string;
}

export interface Dataset {
  updated: string;
  hero: HeroLeader[];
  quickAnswers: QuickAnswer[];
  benchmarks: Benchmark[];
  integrityIssues: IntegrityIssue[];
}

export const CATEGORY_LABEL: Record<Category, string> = {
  coding: "Coding",
  agentic: "Agents & tools",
  reasoning: "Reasoning",
  preference: "Human preference",
  aggregator: "Aggregators",
  "computer-use": "Computer use",
  harness: "Harness vs model",
  drift: "Drift since launch",
};

export const TRUST_LABEL: Record<Trust, string> = {
  high: "Solid",
  medium: "Use with care",
  low: "Shaky",
};

export const INDEPENDENCE_LABEL: Record<Independence, string> = {
  independent: "Run independently",
  "vendor-reported": "Vendor-reported",
  mixed: "Mixed sources",
};

/** Days between two YYYY-MM-DD dates */
export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
}

export const STALE_AFTER_DAYS = 60;
