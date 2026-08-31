"use client";

import { useEffect, useRef, useState } from "react";
import { CircleDot, Send } from "lucide-react";
import { Recommendation, WorkspaceContext } from "../domain/entities";
import { recommendationRepository } from "../lib/container";
import { isError } from "../providers/ports/repositories";
import { askZavea, EXAMPLE_QUESTIONS } from "../domain/ask-zavea/mock-response-engine";
import { ErrorState, LoadingSkeleton } from "./StateViews";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export function AskZavea({ workspace }: { workspace: WorkspaceContext }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    setStatus("loading");
    const result = await recommendationRepository.listActive(workspace.workspaceId);
    if (isError(result)) {
      setErrorMessage(result.error);
      setStatus("error");
      return;
    }
    setRecs(result.filter((r) => r.status === "active"));
    setStatus("ready");
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace.workspaceId]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  const send = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || status !== "ready") return;
    const answer = askZavea(q, recs);
    setMessages((m) => [...m, { role: "user", text: q }, { role: "assistant", text: answer }]);
    setInput("");
  };

  return (
    <div className="zc-view" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="zc-section-heading">Ask ZAVÉA</div>
      <p className="zc-body-text" style={{ marginTop: 4, marginBottom: 12 }}>
        Grounded in the persisted ZAVÉA workspace data — not a generic chatbot.
      </p>

      {status === "loading" && <LoadingSkeleton rows={2} />}
      {status === "error" && errorMessage && <ErrorState message={errorMessage} onRetry={load} />}

      {status === "ready" && (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {EXAMPLE_QUESTIONS.map((q) => (
              <button key={q} className="zc-chip" onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>

          <div className="zc-chat-log" ref={logRef}>
            {messages.length === 0 && (
              <div className="zc-body-text" style={{ opacity: 0.6, padding: "20px 0" }}>
                Tap a question above, or ask your own.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`zc-bubble ${m.role === "user" ? "zc-bubble-user" : "zc-bubble-ai"}`}>
                {m.role === "assistant" && <CircleDot size={13} className="zc-text-accent" style={{ marginBottom: 4 }} />}
                <div style={{ whiteSpace: "pre-line" }}>{m.text}</div>
              </div>
            ))}
          </div>

          <div className="zc-chat-input-row">
            <input
              className="zc-chat-input"
              placeholder="Ask about your business..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="zc-send-btn" onClick={() => send()}>
              <Send size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
