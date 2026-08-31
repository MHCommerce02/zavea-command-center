import { MetricEvidence, Recommendation, Severity } from "../../domain/entities";
import { RecommendationRepository } from "../ports/repositories";
import { getSupabaseBrowserClient } from "./client";

const SELECT = `
  id, title, category, severity, priority_score, urgency, business_impact, confidence, data_quality,
  reasoning, recommended_action, estimated_duration_minutes, expected_impact, status, created_at,
  business_events (
    type,
    event_evidence ( role, metric_snapshots ( value, metric_definitions ( display_name, unit, key ) ) )
  ),
  recommendation_evidence (
    metric_snapshots ( value, metric_definitions ( display_name, unit, key ) )
  )
`;

function formatValue(value: number, unit: string): string {
  if (unit === "currency") return `$${value}`;
  if (unit === "percent") return `${value}%`;
  return `${value}`;
}

// Rows come back from PostgREST with loosely-typed nested embeds (the exact
// array/object shape depends on relationship direction and can vary by
// SDK/PostgREST version), so this mapper is deliberately defensive rather
// than trusting a single assumed shape.
function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Recommendation {
  const metrics: MetricEvidence[] = [];

  for (const event of toArray(row.business_events)) {
    for (const evidence of toArray(event?.event_evidence)) {
      for (const snap of toArray(evidence?.metric_snapshots)) {
        for (const def of toArray(snap?.metric_definitions)) {
          metrics.push({ label: def.display_name, value: formatValue(snap.value, def.unit) });
        }
      }
    }
  }
  for (const evidence of toArray(row.recommendation_evidence)) {
    for (const snap of toArray(evidence?.metric_snapshots)) {
      for (const def of toArray(snap?.metric_definitions)) {
        metrics.push({ label: def.display_name, value: formatValue(snap.value, def.unit) });
      }
    }
  }

  const eventType = toArray(row.business_events)[0]?.type ?? "unknown";

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    severity: row.severity as Severity,
    priorityScore: row.priority_score,
    urgency: row.urgency,
    businessImpact: row.business_impact,
    confidence: row.confidence,
    dataQuality: row.data_quality,
    reasoning: row.reasoning,
    recommendedAction: row.recommended_action,
    estimatedMinutes: row.estimated_duration_minutes,
    expectedImpact: row.expected_impact,
    status: row.status,
    metrics,
    eventType,
    createdAt: row.created_at,
  };
}

export class SupabaseRecommendationRepository implements RecommendationRepository {
  async listActive(workspaceId: string) {
    const supabase = getSupabaseBrowserClient();
    // Fetches 'active' AND 'dismissed' (not 'expired'/'superseded'/'completed')
    // so a dismissed recommendation still renders — greyed out, with a
    // Restore action — exactly like the Phase 1 UX, and so that dismissal
    // is visibly still true after a real page refresh rather than the row
    // simply disappearing.
    const { data, error } = await supabase
      .from("recommendations")
      .select(SELECT)
      .eq("workspace_id", workspaceId)
      .in("status", ["active", "dismissed"])
      .order("priority_score", { ascending: false });

    if (error) return { error: `Failed to load recommendations: ${error.message}` };
    return (data ?? []).map(mapRow);
  }

  async dismiss(recommendationId: string) {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("recommendations")
      .update({ status: "dismissed" })
      .eq("id", recommendationId)
      .select(SELECT)
      .single();

    if (error) return { error: `Failed to dismiss recommendation: ${error.message}` };
    return mapRow(data);
  }

  async restore(recommendationId: string) {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("recommendations")
      .update({ status: "active" })
      .eq("id", recommendationId)
      .select(SELECT)
      .single();

    if (error) return { error: `Failed to restore recommendation: ${error.message}` };
    return mapRow(data);
  }
}
