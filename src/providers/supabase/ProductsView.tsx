"use client";

import { useEffect, useState } from "react";
import { Product } from "../domain/entities";
import { productCatalogRepository } from "../lib/container";
import { isError } from "../providers/ports/repositories";
import { ErrorState, EmptyState, LoadingSkeleton } from "./StateViews";

const STATUS_STYLE: Record<string, { dot: string; text: string; label: string }> = {
  active: { dot: "zc-dot-good", text: "zc-text-good", label: "Active" },
  draft: { dot: "zc-dot-watch", text: "zc-text-watch", label: "Draft" },
  archived: { dot: "zc-dot-critical", text: "zc-text-muted", label: "Archived" },
};

export function ProductsView({ workspaceId }: { workspaceId: string }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "draft">("all");

  const load = async () => {
    setStatus("loading");
    const result = await productCatalogRepository.listAll(workspaceId);
    if (isError(result)) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }
    setProducts(result);
    setStatus("ready");
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const activeCount = products.filter((p) => p.status === "active").length;
  const draftCount = products.filter((p) => p.status === "draft").length;
  const visible = products.filter((p) => filter === "all" || p.status === filter);

  return (
    <div className="zc-view">
      <div className="zc-section-heading">Products</div>
      <p className="zc-body-text" style={{ marginBottom: 12 }}>
        {activeCount} active, {draftCount} draft.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["all", "active", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="zc-filter-pill"
            style={{
              opacity: filter === f ? 1 : 0.55,
              fontWeight: filter === f ? 600 : 400,
            }}
          >
            {f === "all" ? "All" : f === "active" ? "Active" : "Draft"}
          </button>
        ))}
      </div>

      {status === "loading" && <LoadingSkeleton rows={4} />}
      {status === "error" && errorMessage && <ErrorState message={errorMessage} onRetry={load} />}
      {status === "ready" && visible.length === 0 && (
        <EmptyState title="No products in this view" body="Try a different filter." />
      )}

      {status === "ready" && visible.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {visible.map((p) => {
            const st = STATUS_STYLE[p.status] ?? STATUS_STYLE.active;
            return (
              <div key={p.id} className="zc-card" style={{ padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span className={`zc-severity-dot ${st.dot}`} />
                  <span className={`zc-eyebrow ${st.text}`}>{st.label}</span>
                </div>
                <div className="zc-card-title" style={{ marginBottom: 6 }}>
                  {p.title}
                </div>
                {p.description && (
                  <p className="zc-body-text" style={{ marginBottom: 8 }}>
                    {p.description}
                  </p>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                  {p.colors.map((c) => (
                    <span key={c} className="zc-tag-pill">
                      {c}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.sizes.map((s) => (
                    <span key={s} className="zc-tag-pill zc-tag-pill-muted">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
