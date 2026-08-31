// Domain entities. These are the shapes the UI and repository interfaces
// depend on. They are deliberately independent of any Supabase-specific
// row shape — the Supabase adapter is responsible for mapping raw rows
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
  priorityScore: number; // stored, computed once by the domain Priority Engine at write time — never recomputed client-side
  urgency: number;
  businessImpact: number;
  confidence: number;
  dataQuality: number;
  reasoning: string;
  recommendedAction: string;
  estimatedMinutes: number;
  expectedImpact: string | null;
  status: "active" | "accepted" | "dismissed" | "expired" | "superseded" | "completed";
  metrics: MetricEvidence[]; // resolved from recommendation_evidence + event_evidence -> metric_snapshots
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
  start: string; // ISO timestamp
  end: string; // ISO timestamp
  task?: Task;
}

export interface WorkspaceContext {
  workspaceId: string;
  userId: string;
  workspaceName: string;
}
