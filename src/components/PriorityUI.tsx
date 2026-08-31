"use client";

export function PriorityRing({ value, size = 44 }: { value: number; size?: number }) {
  const color = value >= 85 ? "var(--zc-critical)" : value >= 55 ? "var(--zc-watch)" : "var(--zc-good)";
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--zc-border)" strokeWidth="4" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: 13,
          color: "var(--zc-text)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function FactorBar({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--zc-text-muted)", marginBottom: 2 }}>
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="zc-bar-track">
        <div className="zc-bar-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
