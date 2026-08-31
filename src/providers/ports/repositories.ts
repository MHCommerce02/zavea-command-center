import { Recommendation, ScheduleItem, Task, TaskStatus, WorkspaceContext } from "../../domain/entities";

// ---------------------------------------------------------------------------
// Ports (interfaces). The Supabase adapter implements these today; a mock
// adapter could implement them for tests; a future re-platform only ever
// needs a new adapter behind these same interfaces. Nothing above this line
// may import from providers/supabase directly.
// ---------------------------------------------------------------------------

export interface AuthProvider {
  signInWithPassword(
    email: string,
    password: string
  ): Promise<{ userId: string } | { error: string; status?: number; code?: string }>;
  signOut(): Promise<void>;
  getCurrentUserId(): Promise<string | null>;
  onAuthStateChange(callback: (userId: string | null) => void): () => void;
}

export interface WorkspaceRepository {
  resolveWorkspaceForCurrentUser(): Promise<WorkspaceContext | { error: string }>;
}

export interface RecommendationRepository {
  listActive(workspaceId: string): Promise<Recommendation[] | { error: string }>;
  dismiss(recommendationId: string): Promise<Recommendation | { error: string }>;
  restore(recommendationId: string): Promise<Recommendation | { error: string }>;
}

export interface TaskRepository {
  listForWorkspace(workspaceId: string): Promise<Task[] | { error: string }>;
  updateStatus(taskId: string, newStatus: TaskStatus, reason?: string): Promise<Task | { error: string }>;
}

export interface ScheduleRepository {
  getTodayTimeline(workspaceId: string, tasks: Task[]): Promise<ScheduleItem[] | { error: string }>;
}

export function isError<T>(value: T | { error: string }): value is { error: string } {
  return typeof value === "object" && value !== null && "error" in value;
}
