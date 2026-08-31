"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Recommendation, WorkspaceContext } from "../domain/entities";
import { recommendationRepository } from "../lib/container";
import { isError } from "../providers/ports/repositories";
import { RecommendationCard } from "./RecommendationCard";
import { ErrorState, EmptyState, LoadingSkeleton } from "./StateViews";

export function MissionControl({ workspace }: { workspace: WorkspaceContext }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setStatus("loading");
    const result = await recommendationRepository.listActive(workspace.workspaceId);
    if (isError(result)) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }
    setRecs(result);
    setStatus("ready");
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace.workspaceId]);

  const toggleDismiss = async (rec: Recommendation) => {
    setBusyId(rec.id);
    const result =
      rec.status === "dismissed"
        ? await recommendationRepository.restore(rec.id)
        : await recommendationRepository.dismiss(rec.id);
    setBusyId(null);
    if (isError(result)) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }
    setRecs((prev) => prev.map((r) => (r.id === result.id ? result : r)));
  };

  return (
    <div className="zc-view">
      <div className="zc-section-heading" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <AlertTriangle size={16} className="zc-text-critical" />
        What needs my attention
      </div>

      {status === "loading" && <LoadingSkeleton rows={4} />}

      {status === "error" && errorMessage && <ErrorState message={errorMessage} onRetry={load} />}

      {status === "ready" && recs.length === 0 && (
        <EmptyState title="Nothing needs attention right now" body="No active recommendations in the ZAVÉA workspace." />
      )}

      {status === "ready" && recs.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recs.map((rec) => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              expanded={expandedId === rec.id}
              onToggle={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
              onDismissOrRestore={() => toggleDismiss(rec)}
              busy={busyId === rec.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
