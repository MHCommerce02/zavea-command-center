import { WorkspaceContext } from "../../domain/entities";
import { WorkspaceRepository } from "../ports/repositories";
import { getSupabaseBrowserClient } from "./client";

export class SupabaseWorkspaceRepository implements WorkspaceRepository {
  async resolveWorkspaceForCurrentUser(): Promise<WorkspaceContext | { error: string }> {
    const supabase = getSupabaseBrowserClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "Not authenticated." };
    }

    // RLS on workspace_members already restricts rows to the current user's
    // own memberships, so no explicit .eq('user_id', ...) is strictly
    // required — but including it keeps the query's intent explicit and
    // avoids relying on RLS alone to communicate what this query does.
    const { data, error } = await supabase
      .from("workspace_members")
      .select("workspace_id, role, workspaces(id, name)")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      return { error: `Could not resolve workspace membership: ${error.message}` };
    }
    if (!data || !data.workspaces) {
      return { error: "This account is not a member of any workspace yet." };
    }

    const workspace = Array.isArray(data.workspaces) ? data.workspaces[0] : data.workspaces;

    return {
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      userId: user.id,
    };
  }
}
