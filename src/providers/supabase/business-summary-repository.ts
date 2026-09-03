import { BusinessSummary } from "../../domain/entities";
import { BusinessSummaryRepository } from "../ports/repositories";
import { getSupabaseBrowserClient } from "./client";

const WINDOW_DAYS = 7;

interface Point {
  key: string;
  aggregation: string;
  value: number;
}

function aggregate(points: Point[], key: string): number | null {
  const matching = points.filter((p) => p.key === key);
  if (matching.length === 0) return null;
  const values = matching.map((p) => p.value);
  const aggregation = matching[0].aggregation;
  return aggregation === "sum" ? values.reduce((a, b) => a + b, 0) : values.reduce((a, b) => a + b, 0) / values.length;
}

export class SupabaseBusinessSummaryRepository implements BusinessSummaryRepository {
  async getSummary(workspaceId: string): Promise<BusinessSummary | { error: string }> {
    const supabase = getSupabaseBrowserClient();
    const since = new Date();
    since.setDate(since.getDate() - WINDOW_DAYS);
    const sinceIso = since.toISOString();

    const { data, error } = await supabase
      .from("metric_snapshots")
      .select("value, period_start, metric_definitions ( key, aggregation )")
      .eq("workspace_id", workspaceId)
      .in("granularity", ["day"])
      .gte("period_start", sinceIso);

    if (error) return { error: `Failed to load business summary: ${error.message}` };

    const points: Point[] = [];
    for (const row of data ?? []) {
      const def = Array.isArray(row.metric_definitions) ? row.metric_definitions[0] : row.metric_definitions;
      if (!def) continue;
      points.push({ key: def.key, aggregation: def.aggregation, value: row.value });
    }

    const revenue = aggregate(points, "revenue");
    const adSpend = aggregate(points, "ad_spend");
    const orders = aggregate(points, "orders");
    const sessions = aggregate(points, "sessions");
    const atcRate = aggregate(points, "atc_rate");
    const checkoutRate = aggregate(points, "checkout_rate");
    const conversionRate = aggregate(points, "conversion_rate");
    const cogs = aggregate(points, "cogs");
    const transactionFees = aggregate(points, "transaction_fees");

    const roas = revenue !== null && adSpend !== null && adSpend > 0 ? revenue / adSpend : null;
    const cpa = adSpend !== null && orders !== null && orders > 0 ? adSpend / orders : null;
    const profit =
      revenue !== null && cogs !== null && adSpend !== null && transactionFees !== null
        ? revenue - cogs - adSpend - transactionFees
        : null;

    return {
      windowDays: WINDOW_DAYS,
      revenue,
      adSpend,
      roas,
      orders,
      cpa,
      sessions,
      atcRate,
      checkoutRate,
      conversionRate,
      cogs,
      transactionFees,
      profit,
    };
  }
}
