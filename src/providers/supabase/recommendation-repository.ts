import { MetricEvidence, Recommendation, Severity } from "../../domain/entities";
import { RecommendationRepository } from "../ports/repositories";
import { getSupabaseBrowserClient } from "./client";

const SELECT = `
  id, title, category, severity, priority_score, urgency, business_impact, confidence, data_quality,
  reasoning, recommended_action, estimated_duration_minutes, expected_impact, status, created_at,
  business_events (
    type,
    event_evidence ( role, metric_snapshots ( value, metric_definitions ( display_name, unit, key, aggregation ) ) )
  ),
  recommendation_evidence (
    metric_snapshots ( value, metric_definitions ( display_name, unit, key, aggregation ) )
  )
`;

function formatValue(value: number, unit: string): string {
  const rounded = Math.round(value * 100) / 100;
  if (unit === "currency") return `$${rounded}`;
  if (unit === "percent") return `${rounded}%`;
  return `${rounded}`;
}

function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

interface RawMetricPoint {
  key: string;
  displayName: string;
  unit: string;
  aggregation: string;
  value: number;
}

function summarizeMetrics(points: RawMetricPoint[]): MetricEvidence[] {
  const groups = new Map<string, RawMetricPoint[]>();
  for (const p of points) {
    const existing = groups.get(p.key);
    if (existing) existing.push(p);
    else groups.set(p.key, [p]);
  }

  const summarized: MetricEvidence[] = [];
  for (const group of groups.values()) {
    const { displayName, unit, aggregation } = group[0];
    const values = group.map((g) => g.value);
    const aggregated =
      aggregation === "sum" ? values.reduce((a, b) => a + b, 0) : values.reduce((a, b) => a + b, 0) / values.length;

    summarized.push({
      label: displayName,
      value: formatValue(aggregated, unit),
      note: group.length > 1 ? (aggregation === "sum" ? `total, ${group.length} days` : `avg, ${group.length} days`) : undefined,
    });
  }
  return summarized;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Recommendation {
  const points: RawMetricPoint[] = [];

  for (const event of toArray(row.business_events)) {
    for (const evidence of toArray(event?.event_evidence)) {
      for (const snap of toArray(evidence?.metric_snapshots)) {
        for (const def of toArray(snap?.metric_definitions)) {
          points.push({ key: def.key, displayName: def.display_name, unit: def.unit, aggregation: def.aggregation, value: snap.value });
        }
      }
    }
  }
  for (const evidence of toArray(row.recommendation_evidence)) {
    for (const snap of toArray(evidence?.metric_snapshots)) {
      for (const def of toArray(snap?.metric_definitions)) {
        points.push({ key: def.key, displayName: def.display_name, unit: def.unit, aggregation: def.aggregation, value: snap.value });
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
    metrics: summarizeMetrics(points),
    eventType,
    createdAt: row.created_at,
  };
}

export class SupabaseRecommendationRepository implements RecommendationRepository {
  async listActive(workspaceId: string) {
    const supabase = getSupabaseBrowserClient();
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
