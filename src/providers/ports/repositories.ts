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
