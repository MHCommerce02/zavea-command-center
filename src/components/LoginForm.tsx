"use client";

import { useState } from "react";

export function LoginForm({ onSignIn }: { onSignIn: (email: string, password: string) => Promise<boolean> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const ok = await onSignIn(email, password);
    setSubmitting(false);
    if (!ok) setError("Sign-in failed. Check your email and password.");
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
        {error && <div className="zc-error-banner">{error}</div>}
        <button className="zc-btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="zc-body-text">
        This calls Supabase Auth directly — no service-role key, no hard-coded UUID. Your session is a real, standard
        Supabase session.
      </p>
    </div>
  );
}
