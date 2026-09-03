"use client";

import { useEffect, useState } from "react";
import { DailyPnlRow } from "../domain/entities";
import { dailyPnlRepository } from "../lib/container";
import { isError } from "../providers/ports/repositories";
import { ErrorState, EmptyState, LoadingSkeleton } from "./StateViews";

const WINDOW_DAYS = 30;

function fmt(v: number): string {
  const sign = v < 0 ? "-" : "";
  return `${sign}$${Math.abs(v).toFixed(2)}`;
}

export function DailyPnlView({ workspaceId }: { workspaceId: string }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rows, setRows] = useState<DailyPnlRow[]>([]);

  const load = async () => {
    setStatus("loading");
    const result = await dailyPnlRepository.listDays(workspaceId, WINDOW_DAYS);
    if (isError(result)) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }
    setRows(result);
    setStatus("ready");
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const totalProfit = rows.reduce((sum, r) => sum + r.profit, 0);

  return (
    <div className="zc-view">
      <div className="zc-section-heading">Daily P&amp;L</div>
      <p className="zc-body-text" style={{ marginBottom: 4 }}>
        Last {WINDOW_DAYS} days. Revenue, cost of goods sold, ad spend, and transaction fees, per day.
      </p>
      <p className="zc-body-text" style={{ marginBottom: 16, fontSize: 11, opacity: 0.7 }}>
        Transaction fees are $0 whenever there are no real orders on a day -- there is nothing to charge a fee on yet.
      </p>

      {status === "loading" && <LoadingSkeleton rows={4} />}
      {status === "error" && errorMessage && <ErrorState message={errorMessage} onRetry={load} />}
      {status === "ready" && rows.length === 0 && (
        <EmptyState title="No P&L data yet" body="Nothing has been recorded for this window." />
      )}

      {status === "ready" && rows.length > 0 && (
        <>
          <div className="zc-card" style={{ padding: 14, marginBottom: 12 }}>
            <div className="zc-label">Total profit, last {rows.length} days</div>
            <div className="zc-metric-value" style={{ color: totalProfit < 0 ? "var(--zc-critical)" : undefined }}>
              {fmt(totalProfit)}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1fr 1fr 1fr 1fr 1fr",
                gap: 4,
                padding: "0 12px",
                fontSize: 11,
                opacity: 0.6,
              }}
            >
              <span>Date</span>
              <span>Revenue</span>
              <span>COGS</span>
              <span>Ad spend</span>
              <span>Fees</span>
              <span>Profit</span>
            </div>
            {rows.map((r) => (
              <div key={r.date} className="zc-card" style={{ padding: 12 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.1fr 1fr 1fr 1fr 1fr 1fr",
                    gap: 4,
                    fontSize: 13,
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{r.date}</span>
                  <span>{fmt(r.revenue)}</span>
                  <span>{fmt(r.cogs)}</span>
                  <span>{fmt(r.adSpend)}</span>
                  <span>{fmt(r.transactionFees)}</span>
                  <span style={{ fontWeight: 600, color: r.profit < 0 ? "var(--zc-critical)" : "var(--zc-good)" }}>
                    {fmt(r.profit)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
