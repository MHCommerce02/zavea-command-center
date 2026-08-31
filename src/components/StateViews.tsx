"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="zc-skeleton" style={{ height: 84, borderRadius: 14 }} />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="zc-error-banner">
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>Couldn&apos;t reach Supabase</div>
          <div>{message}</div>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "1px solid rgba(229,72,77,0.4)",
                borderRadius: 8,
                padding: "6px 10px",
                color: "inherit",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              <RefreshCw size={12} /> Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="zc-card" style={{ padding: 20, textAlign: "center" }}>
      <div className="zc-card-title" style={{ marginBottom: 6 }}>
        {title}
      </div>
      <div className="zc-body-text">{body}</div>
    </div>
  );
}
