"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Clock, Lock, XCircle } from "lucide-react";
import { ScheduleItem, Task, WorkspaceContext } from "../domain/entities";
import { scheduleRepository, taskRepository } from "../lib/container";
import { isError } from "../providers/ports/repositories";
import { ErrorState, EmptyState, LoadingSkeleton } from "./StateViews";

function priorityTier(priority: number) {
  if (priority >= 85) return { label: "Now", cls: "zc-tier-now" };
  if (priority >= 55) return { label: "Next", cls: "zc-tier-next" };
  return { label: "Later", cls: "zc-tier-later" };
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function MyDay({ workspace }: { workspace: WorkspaceContext }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<ScheduleItem[]>([]);
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);

  const load = async () => {
    setStatus("loading");
    const tasksResult = await taskRepository.listForWorkspace(workspace.workspaceId);
    if (isError(tasksResult)) {
      setErrorMessage(tasksResult.error);
      setStatus("error");
      return;
    }
    const timelineResult = await scheduleRepository.getTodayTimeline(workspace.workspaceId, tasksResult);
    if (isError(timelineResult)) {
      setErrorMessage(timelineResult.error);
      setStatus("error");
      return;
    }
    setTimeline(timelineResult);
    setStatus("ready");
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace.workspaceId]);

  const applyStatusChange = async (task: Task, newStatus: Task["status"], reason: string) => {
    setBusyTaskId(task.id);
    const result = await taskRepository.updateStatus(task.id, newStatus, reason);
    setBusyTaskId(null);
    if (isError(result)) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }
    setTimeline((prev) =>
      prev.map((item) => (item.kind === "task" && item.id === task.id ? { ...item, task: result } : item))
    );
  };

  return (
    <div className="zc-view">
      <div className="zc-section-heading">Today&apos;s agenda</div>

      {status === "loading" && <LoadingSkeleton rows={5} />}

      {status === "error" && errorMessage && <ErrorState message={errorMessage} onRetry={load} />}

      {status === "ready" && timeline.length === 0 && (
        <EmptyState title="Nothing scheduled" body="No tasks or fixed events for today yet." />
      )}

      {status === "ready" && timeline.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          {timeline.map((item) => {
            if (item.kind === "locked") {
              return (
                <div key={item.id} className="zc-task-row zc-task-locked">
                  <div className="zc-task-time">{fmtTime(item.start)}</div>
                  <Lock size={16} className="zc-text-muted" style={{ marginTop: 1 }} />
                  <div style={{ flex: 1 }}>
                    <div className="zc-task-title">{item.title}</div>
                    <div className="zc-task-reason">Fixed calendar event — never moved by reprioritization</div>
                  </div>
                </div>
              );
            }

            const task = item.task!;
            const tier = priorityTier(task.priorityScore);
            const isCompleted = task.status === "completed";
            const isDismissed = task.status === "dismissed";
            const busy = busyTaskId === task.id;

            return (
              <div key={item.id} className="zc-task-row" style={{ opacity: isDismissed ? 0.5 : 1 }}>
                <div className="zc-task-time">{fmtTime(item.start)}</div>
                <button
                  className="zc-task-check"
                  disabled={busy}
                  onClick={() =>
                    applyStatusChange(
                      task,
                      isCompleted ? "recommended" : "completed",
                      isCompleted ? "Reopened from My Day" : "Marked complete from My Day"
                    )
                  }
                >
                  {isCompleted ? (
                    <CheckCircle2 size={18} className="zc-text-good" />
                  ) : (
                    <Circle size={18} className="zc-text-muted" />
                  )}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span className={`zc-tier-badge ${tier.cls}`}>{tier.label}</span>
                    <div className={`zc-task-title ${isCompleted ? "zc-task-done" : ""}`}>{task.title}</div>
                  </div>
                  {task.description && <div className="zc-task-reason">{task.description}</div>}
                  <div style={{ display: "flex", gap: 12, marginTop: 4, alignItems: "center" }}>
                    <span className="zc-task-meta">
                      <Clock size={11} />
                      {fmtTime(item.start)}–{fmtTime(item.end)}
                    </span>
                    <span className="zc-task-meta">Priority {task.priorityScore}</span>
                    <span className="zc-task-meta" style={{ textTransform: "capitalize" }}>
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                  {!isCompleted && !isDismissed && (
                    <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                      {task.status === "recommended" && (
                        <button
                          className="zc-dismiss-btn"
                          disabled={busy}
                          onClick={() => applyStatusChange(task, "accepted", "Accepted from My Day")}
                        >
                          Accept
                        </button>
                      )}
                      <button
                        className="zc-dismiss-btn"
                        disabled={busy}
                        onClick={() => applyStatusChange(task, "dismissed", "Dismissed from My Day")}
                      >
                        <XCircle size={12} /> Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
