import { Task, TaskStatus } from "../../domain/entities";
import { TaskRepository } from "../ports/repositories";
import { getSupabaseBrowserClient } from "./client";
import { Database } from "../../types/database";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];

function mapRow(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priorityScore: row.priority_score,
    estimatedMinutes: row.estimated_duration_minutes,
    recommendationId: row.recommendation_id,
    source: row.source,
  };
}

export class SupabaseTaskRepository implements TaskRepository {
  async listForWorkspace(workspaceId: string) {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("priority_score", { ascending: false });

    if (error) return { error: `Failed to load tasks: ${error.message}` };
    return (data ?? []).map(mapRow);
  }

  // Deliberately does NOT write to tasks via a plain .update() for status
  // changes — it calls the update_task_status RPC (013_task_actions_rpc.sql)
  // so the transaction-local actor context is set correctly before the
  // trigger-only task_status_history insert fires. Never write to
  // task_status_history directly from here.
  async updateStatus(taskId: string, newStatus: TaskStatus, reason?: string) {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("update_task_status", {
      p_task_id: taskId,
      p_new_status: newStatus,
      p_reason: reason,
    });

    if (error) return { error: `Failed to update task status: ${error.message}` };
    return mapRow(data as TaskRow);
  }
}
