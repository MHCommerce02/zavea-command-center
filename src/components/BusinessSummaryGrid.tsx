"use client";

import { useEffect, useState } from "react";
import { BusinessSummary } from "../domain/entities";
import { businessSummaryRepository } from "../lib/container";
import { isError } from "../providers/ports/repositories";
import { LoadingSkeleton } from "./StateViews";

function fmtCurrency(v: number | null): string {
  if (v === null) return "--";
  return `$${v.toFixed(2)}`;
}
function fmtNumber(v: number | null): string {
  if (v === null) return "--";
  return v % 1 === 0 ? `${v}` : v.toFixed(1);
}
function fmtPercent(v: number | null): string {
  if (v === null) return "--";
  return `${v.toFixed(2)}%`;
}
function fmtRatio(v: number | null): string {
  if (v === null) return "--";
  return v.toFixed(2);
}

export function BusinessSummaryGrid({ workspaceId }: { workspaceId: string }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [summary, setSummary] = useState<BusinessSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("loading");
      const result = await businessSummaryRepository.getSummary(workspaceId);
      if (cancelled) return;
      if (isError(result)) {
        setErrorMessage(result.error);
        setStatus("error");
        return;
      }
      setSummary(result);
      setStatus("ready");
    })();
    return () => {
      cancelled = true;
    };
  }, [workspaceId]);

  if (status === "loading") {
    return (
      <div style={{ marginBottom: 20 }}>
        <LoadingSkeleton rows={1} />
      </div>
    );
  }

  if (status === "error" || !summary) {
    return (
      <div className="zc-body-text" style={{ marginBottom: 16 }}>
        Couldn&apos;t load business summary{errorMessage ? `: ${errorMessage}` : "."}
      </div>
    );
  }

  const tiles: { label: string; value: string }[] = [
    { label: "Profit", value: fmtCurrency(summary.profit) },
    { label: "Revenue", value: fmtCurrency(summary.revenue) },
    { label: "COGS", value: fmtCurrency(summary.cogs) },
    { label: "Ad spend", value: fmtCurrency(summary.adSpend) },
    { label: "ROAS", value: fmtRatio(summary.roas) },
    { label: "Orders", value: fmtNumber(summary.orders) },
    { label: "CPA", value: fmtCurrency(summary.cpa) },
    { label: "Sessions", value: fmtNumber(summary.sessions) },
    { label: "ATC rate", value: fmtPercent(summary.atcRate) },
    { label: "Checkout rate", value: fmtPercent(summary.checkoutRate) },
    { label: "Conversion", value: fmtPercent(summary.conversionRate) },
  ];

  return (
    <div style={{ marginBottom: 20 }}>
      <div className="zc-section-heading" style={{ marginBottom: 4 }}>
        Business status
      </div>
      <p className="zc-body-text" style={{ marginBottom: 10 }}>
        Last {summary.windowDays} days, real Shopify + Meta data.
      </p>
      <div className="zc-metric-grid">
        {tiles.map((t) => (
          <div key={t.label} className="zc-card" style={{ padding: "12px 14px" }}>
            <div className="zc-label">{t.label}</div>
            <div className="zc-metric-value">{t.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
