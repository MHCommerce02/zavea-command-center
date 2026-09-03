import {
  AuthProvider,
  BusinessSummaryRepository,
  DailyPnlRepository,
  ProductCatalogRepository,
  RecommendationRepository,
  ScheduleRepository,
  TaskRepository,
  WorkspaceRepository,
} from "../providers/ports/repositories";
import { SupabaseAuthProvider } from "../providers/supabase/auth-provider";
import { SupabaseBusinessSummaryRepository } from "../providers/supabase/business-summary-repository";
import { SupabaseDailyPnlRepository } from "../providers/supabase/daily-pnl-repository";
import { SupabaseProductCatalogRepository } from "../providers/supabase/product-catalog-repository";
import { SupabaseRecommendationRepository } from "../providers/supabase/recommendation-repository";
import { SupabaseScheduleRepository } from "../providers/supabase/schedule-repository";
import { SupabaseTaskRepository } from "../providers/supabase/task-repository";
import { SupabaseWorkspaceRepository } from "../providers/supabase/workspace-repository";

export const authProvider: AuthProvider = new SupabaseAuthProvider();
export const workspaceRepository: WorkspaceRepository = new SupabaseWorkspaceRepository();
export const recommendationRepository: RecommendationRepository = new SupabaseRecommendationRepository();
export const taskRepository: TaskRepository = new SupabaseTaskRepository();
export const scheduleRepository: ScheduleRepository = new SupabaseScheduleRepository();
export const businessSummaryRepository: BusinessSummaryRepository = new SupabaseBusinessSummaryRepository();
export const productCatalogRepository: ProductCatalogRepository = new SupabaseProductCatalogRepository();
export const dailyPnlRepository: DailyPnlRepository = new SupabaseDailyPnlRepository();
