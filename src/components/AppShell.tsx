"use client";

import { useState } from "react";
import { Radar, CalendarClock, MessageCircle } from "lucide-react";
import { useWorkspaceSession } from "../lib/use-workspace-session";
import { LoginForm } from "./LoginForm";
import { MissionControl } from "./MissionControl";
import { MyDay } from "./MyDay";
import { AskZavea } from "./AskZavea";
import { ErrorState, LoadingSkeleton } from "./StateViews";

type Tab = "mission" | "day" | "ask";

const TABS: { key: Tab; label: string; icon: typeof Radar }[] = [
  { key: "mission", label: "Mission Control", icon: Radar },
  { key: "day", label: "My Day", icon: CalendarClock },
  { key: "ask", label: "Ask ZAVÉA", icon: MessageCircle },
];

export function AppShell() {
  const [tab, setTab] = useState<Tab>("mission");
  const { status, workspace, errorMessage, signIn, retry } = useWorkspaceSession();

  return (
    <div className="zc-root">
      <div className="zc-header">
        <div className="zc-brand">ZAVÉA Command Center</div>
        <div className="zc-brand-sub">
          {status === "ready" && tab === "mission" && "What is happening in my business right now?"}
          {status === "ready" && tab === "day" && "What should I work on, and in what order?"}
          {status === "ready" && tab === "ask" && "Ask anything about the business"}
          {status !== "ready" && workspace?.workspaceName}
        </div>
      </div>

      {status === "checking" && (
        <div className="zc-view">
          <LoadingSkeleton rows={3} />
        </div>
      )}

      {status === "signed-out" && <LoginForm onSignIn={signIn} />}

      {status === "resolving-workspace" && (
        <div className="zc-view">
          <LoadingSkeleton rows={3} />
        </div>
      )}

      {status === "error" && (
        <div className="zc-view">
          <ErrorState message={errorMessage ?? "Unknown error resolving your workspace."} onRetry={retry} />
        </div>
      )}

      {status === "ready" && workspace && (
        <>
          {tab === "mission" && <MissionControl workspace={workspace} />}
          {tab === "day" && <MyDay workspace={workspace} />}
          {tab === "ask" && <AskZavea workspace={workspace} />}

          <div className="zc-tabbar">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} className={`zc-tab ${tab === key ? "zc-tab-active" : ""}`} onClick={() => setTab(key)}>
                <Icon size={19} />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
