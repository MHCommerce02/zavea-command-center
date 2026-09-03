import { DailyPnlRow } from "../../domain/entities";
import { DailyPnlRepository } from "../ports/repositories";
import { getSupabaseBrowserClient } from "./client";

export class SupabaseDailyPnlRepository implements DailyPnlRepository {
  async listDays(workspaceId: string, days: number): Promise<DailyPnlRow[] | { error: string }> {
    const supabase = getSupabaseBrowserClient();
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceIso = since.toISOString();

    const { data, error } = await supabase
      .from("metric_snapshots")
      .select("value, period_start, metric_definitions ( key )")
      .eq("workspace_id", workspaceId)
      .eq("granularity", "day")
      .in("metric_definitions.key", ["revenue", "cogs", "ad_spend", "transaction_fees"])
      .gte("period_start", sinceIso)
      .order("period_start", { ascending: false });

    if (error) return { error: `Failed to load daily P&L: ${error.message}` };

    const byDay = new Map<string, { revenue: number; cogs: number; adSpend: number; transactionFees: number }>();

    for (const row of data ?? []) {
      const def = Array.isArray(row.metric_definitions) ? row.metric_definitions[0] : row.metric_definitions;
      if (!def) continue;
      const day = row.period_start.slice(0, 10);
      const existing = byDay.get(day) ?? { revenue: 0, cogs: 0, adSpend: 0, transactionFees: 0 };
      if (def.key === "revenue") existing.revenue += row.value;
      if (def.key === "cogs") existing.cogs += row.value;
      if (def.key === "ad_spend") existing.adSpend += row.value;
      if (def.key === "transaction_fees") existing.transactionFees += row.value;
      byDay.set(day, existing);
    }

    return Array.from(byDay.entries())
      .map(([date, v]) => ({
        date,
        revenue: v.revenue,
        cogs: v.cogs,
        adSpend: v.adSpend,
        transactionFees: v.transactionFees,
        profit: v.revenue - v.cogs - v.adSpend - v.transactionFees,
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }
}
