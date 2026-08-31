"use client";

import { useMemo, useState } from "react";

interface SignInResult {
  userId?: string;
  error?: string;
  status?: number;
  code?: string;
}

function useBuildDiagnostics() {
  return useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null;
    const projectRef = url ? url.replace("https://", "").split(".")[0] : null;
    const keySuffix = key ? key.slice(-8) : null;
    return { url, projectRef, keySuffix, urlPresent: !!url, keyPresent: !!key };
  }, []);
}

export function LoginForm({
  onSignIn,
}: {
  onSignIn: (email: string, password: string) => Promise<SignInResult>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SignInResult | null>(null);
  const diag = useBuildDiagnostics();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    const r = await onSignIn(email, password);
    setSubmitting(false);
    if (r.error) setResult(r);
  };

  return (
    <div className="zc-view" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
      <div>
        <div className="zc-brand">ZAVÉA Command Center</div>
        <div className="zc-brand-sub">Sign in with your Supabase account</div>
      </div>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          className="zc-login-input"
          type="email"
          placeholder="Email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="zc-login-input"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {result?.error && (
          <div className="zc-error-banner">
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Sign-in failed</div>
            <div>{result.error}</div>
            {(result.status || result.code) && (
              <div style={{ marginTop: 4, opacity: 0.8, fontFamily: "monospace", fontSize: 11 }}>
                {result.status ? `HTTP ${result.status}` : ""}
                {result.status && result.code ? " · " : ""}
                {result.code ?? ""}
              </div>
            )}
          </div>
        )}
        <button className="zc-btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="zc-body-text">
        This calls Supabase Auth directly -- no service-role key, no hard-coded UUID. Your session is a real, standard
        Supabase session.
      </p>

      <div
        style={{
          fontFamily: "monospace",
          fontSize: 10.5,
          color: "var(--zc-text-muted)",
          border: "1px solid var(--zc-border)",
          borderRadius: 8,
          padding: 10,
          lineHeight: 1.6,
        }}
      >
        <div>build config check</div>
        <div>project ref: {diag.projectRef ?? "MISSING -- NEXT_PUBLIC_SUPABASE_URL not set in this build"}</div>
        <div>
          anon key: {diag.keyPresent ? `…${diag.keySuffix}` : "MISSING -- NEXT_PUBLIC_SUPABASE_ANON_KEY not set in this build"}
        </div>
        <div>expected project ref: xvvrrprigmhayyeglizg</div>
      </div>
    </div>
  );
}
