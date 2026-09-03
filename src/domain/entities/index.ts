// Domain entities. These are the shapes the UI and repository interfaces
// depend on. They are deliberately independent of any Supabase-specific
// row shape -- the Supabase adapter is responsible for mapping raw rows
// into these types (see providers/supabase/*).

export type Severity = "critical" | "watch" | "opportunity" | "info";
export type TaskStatus =
  | "recommended"
  | "accepted"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "dismissed"
  | "blocked"
  | "deferred";

export interface MetricEvidence {
  label: string;
  value: string;
  note?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  priorityScore: number;
  urgency: number;
  businessImpact: number;
  confidence: number;
  dataQuality: number;
  reasoning: string;
  recommendedAction: string;
  estimatedMinutes: number;
  expectedImpact: string | null;
  status: "active" | "accepted" | "dismissed" | "expired" | "superseded" | "completed";
  metrics: MetricEvidence[];
  eventType: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priorityScore: number;
  estimatedMinutes: number;
  recommendationId: string | null;
  source: string;
}

export interface ScheduleItem {
  kind: "task" | "locked";
  id: string;
  title: string;
  start: string;
  end: string;
  task?: Task;
}

export interface WorkspaceContext {
  workspaceId: string;
  userId: string;
  workspaceName: string;
}

// A quick "at a glance" business summary, shown at the top of Mission
// Control. Aggregated over a trailing window (currently 7 days) from
// real Shopify + Meta data.
export interface BusinessSummary {
  windowDays: number;
  revenue: number | null;
  adSpend: number | null;
  roas: number | null;
  orders: number | null;
  cpa: number | null;
  sessions: number | null;
  atcRate: number | null;
  checkoutRate: number | null;
  conversionRate: number | null;
  cogs: number | null;
  transactionFees: number | null;
  profit: number | null;
}

export interface Product {
  id: string;
  shopifyProductId: string;
  title: string;
  status: "active" | "draft" | "archived";
  description: string | null;
  colors: string[];
  sizes: string[];
}

export interface DailyPnlRow {
  date: string;
  revenue: number;
  cogs: number;
  adSpend: number;
  transactionFees: number;
  profit: number;
}
