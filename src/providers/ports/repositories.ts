import {
  BusinessSummary,
  DailyPnlRow,
  Product,
  Recommendation,
  ScheduleItem,
  Task,
  TaskStatus,
  WorkspaceContext,
} from "../../domain/entities";

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

export interface BusinessSummaryRepository {
  getSummary(workspaceId: string): Promise<BusinessSummary | { error: string }>;
}

export interface ProductCatalogRepository {
  listAll(workspaceId: string): Promise<Product[] | { error: string }>;
}

export interface DailyPnlRepository {
  listDays(workspaceId: string, days: number): Promise<DailyPnlRow[] | { error: string }>;
}

export function isError<T>(value: T | { error: string }): value is { error: string } {
  return typeof value === "object" && value !== null && "error" in value;
}
