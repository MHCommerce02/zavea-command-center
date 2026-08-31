"use client";

import { ChevronDown, Clock, Sparkles, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Recommendation } from "../domain/entities";
import { PriorityRing, FactorBar } from "./PriorityUI";

const SEVERITY_STYLE: Record<string, { dot: string; text: string; label: string }> = {
  critical: { dot: "zc-dot-critical", text: "zc-text-critical", label: "Critical" },
  watch: { dot: "zc-dot-watch", text: "zc-text-watch", label: "Watch" },
  opportunity: { dot: "zc-dot-good", text: "zc-text-good", label: "Opportunity" },
  info: { dot: "zc-dot-good", text: "zc-text-good", label: "Info" },
};

export function RecommendationCard({
  rec,
  expanded,
  onToggle,
  onDismissOrRestore,
  busy,
}: {
  rec: Recommendation;
  expanded: boolean;
  onToggle: () => void;
  onDismissOrRestore: () => void;
  busy: boolean;
}) {
  const style = SEVERITY_STYLE[rec.severity] ?? SEVERITY_STYLE.info;
  const dismissed = rec.status === "dismissed";

  return (
    <div className="zc-card" style={{ padding: 16, opacity: dismissed ? 0.45 : 1 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <PriorityRing value={rec.priorityScore} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span className={`zc-severity-dot ${style.dot}`} />
            <span className={`zc-eyebrow ${style.text}`}>
              {style.label} · {rec.category}
            </span>
          </div>
          <div className="zc-card-title">{rec.title}</div>
        </div>
      </div>

      <p className="zc-body-text" style={{ marginTop: 10 }}>
        {rec.reasoning}
      </p>

      {rec.metrics.length > 0 && (
        <div className="zc-metric-row">
          {rec.metrics.map((m, i) => (
            <div key={`${m.label}-${i}`} className="zc-metric-chip">
              <span className="zc-metric-chip-label">{m.label}</span>
              <span className="zc-metric-chip-value">{m.value}</span>
            </div>
          ))}
        </div>
      )}

      <button className="zc-expand-toggle" onClick={onToggle}>
        <ChevronDown size={14} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
        {expanded ? "Hide reasoning" : "Why this priority"}
      </button>

      {expanded && (
        <div style={{ marginTop: 8, marginBottom: 4 }}>
          <FactorBar label="Urgency" value={rec.urgency} />
          <FactorBar label="Business impact" value={rec.businessImpact} />
          <FactorBar label="Confidence" value={rec.confidence} />
          <FactorBar label="Data quality" value={rec.dataQuality} />
        </div>
      )}

      <div className="zc-card-footer">
        <div className="zc-footer-item">
          <Clock size={13} />
          <span>{rec.estimatedMinutes} min</span>
        </div>
        {rec.expectedImpact && (
          <div className="zc-footer-item zc-text-muted" style={{ flex: 1, minWidth: 0 }}>
            <Sparkles size={13} style={{ flexShrink: 0 }} />
            <span className="zc-truncate">{rec.expectedImpact}</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <div className="zc-action-pill">
          <ArrowRight size={13} />
          <span>{rec.recommendedAction}</span>
        </div>
      </div>

      <button className="zc-dismiss-btn" onClick={onDismissOrRestore} disabled={busy}>
        {dismissed ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
        {busy ? "Saving…" : dismissed ? "Restore" : "Dismiss"}
      </button>
    </div>
  );
}
