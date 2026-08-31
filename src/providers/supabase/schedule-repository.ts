import { ScheduleItem, Task } from "../../domain/entities";
import { buildTimeline } from "../../domain/scheduling/schedule-tasks";
import { ScheduleRepository } from "../ports/repositories";
import { getSupabaseBrowserClient } from "./client";

export class SupabaseScheduleRepository implements ScheduleRepository {
  async getTodayTimeline(workspaceId: string, tasks: Task[]): Promise<ScheduleItem[] | { error: string }> {
    const supabase = getSupabaseBrowserClient();
    const today = new Date().toISOString().slice(0, 10);

    const { data: run, error: runError } = await supabase
      .from("schedule_runs")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("run_date", today)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (runError) return { error: `Failed to load schedule run: ${runError.message}` };

    let scheduledPlacements: { task: Task; start: string; end: string }[] = [];
    const scheduledTaskIds = new Set<string>();

    if (run) {
      const { data: placements, error: placementsError } = await supabase
        .from("scheduled_tasks")
        .select("task_id, start_time, end_time, tasks(*)")
        .eq("schedule_run_id", run.id)
        .eq("status", "active")
        .order("start_time", { ascending: true });

      if (placementsError) return { error: `Failed to load scheduled tasks: ${placementsError.message}` };

      for (const p of placements ?? []) {
        const taskRow = Array.isArray(p.tasks) ? p.tasks[0] : p.tasks;
        if (!taskRow) continue;
        scheduledTaskIds.add(p.task_id);
        scheduledPlacements.push({
          task: {
            id: taskRow.id,
            title: taskRow.title,
            description: taskRow.description,
            status: taskRow.status,
            priorityScore: taskRow.priority_score,
            estimatedMinutes: taskRow.estimated_duration_minutes,
            recommendationId: taskRow.recommendation_id,
            source: taskRow.source,
          },
          start: p.start_time,
          end: p.end_time,
        });
      }
    }

    const { data: fixedEventsRaw, error: fixedError } = await supabase
      .from("fixed_calendar_events")
      .select("id, title, start_time, end_time")
      .eq("workspace_id", workspaceId)
      .eq("locked", true)
      .gte("start_time", `${today}T00:00:00Z`)
      .lt("start_time", `${today}T23:59:59Z`)
      .order("start_time", { ascending: true });

    if (fixedError) return { error: `Failed to load fixed calendar events: ${fixedError.message}` };

    const fixedEvents = (fixedEventsRaw ?? []).map((e) => ({
      id: e.id,
      title: e.title,
      start: e.start_time,
      end: e.end_time,
    }));

    const unscheduledTasks = tasks.filter(
      (t) => !scheduledTaskIds.has(t.id) && t.status !== "completed" && t.status !== "dismissed"
    );

    return buildTimeline(scheduledPlacements, unscheduledTasks, fixedEvents);
  }
}
