// Composition root. This is the ONLY file that should import concrete
// Supabase adapters directly — every component and hook imports from here
// and depends only on the port interface types. Swapping the backend later
// (e.g. a different data source, or a mock for tests) means editing only
// this file.

import {
  AuthProvider,
  RecommendationRepository,
  ScheduleRepository,
  TaskRepository,
  WorkspaceRepository,
} from "../providers/ports/repositories";
import { SupabaseAuthProvider } from "../providers/supabase/auth-provider";
import { SupabaseRecommendationRepository } from "../providers/supabase/recommendation-repository";
import { SupabaseScheduleRepository } from "../providers/supabase/schedule-repository";
import { SupabaseTaskRepository } from "../providers/supabase/task-repository";
import { SupabaseWorkspaceRepository } from "../providers/supabase/workspace-repository";

export const authProvider: AuthProvider = new SupabaseAuthProvider();
export const workspaceRepository: WorkspaceRepository = new SupabaseWorkspaceRepository();
export const recommendationRepository: RecommendationRepository = new SupabaseRecommendationRepository();
export const taskRepository: TaskRepository = new SupabaseTaskRepository();
export const scheduleRepository: ScheduleRepository = new SupabaseScheduleRepository();
