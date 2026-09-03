"use client";

import { useState } from "react";
import { Radar, CalendarClock, MessageCircle, Shirt, LineChart } from "lucide-react";
import { useWorkspaceSession } from "../lib/use-workspace-session";
import { LoginForm } from "./LoginForm";
import { MissionControl } from "./MissionControl";
import { MyDay } from "./MyDay";
import { AskZavea } from "./AskZavea";
import { ProductsView } from "./ProductsView";
import { DailyPnlView } from "./DailyPnlView";
import { ErrorState, LoadingSkeleton } from "./StateViews";

type Tab = "mission" | "day" | "ask" | "products" | "pnl";

const TABS: { key: Tab; label: string; icon: typeof Radar }[] = [
  { key: "mission", label: "Mission Control", icon: Radar },
  { key: "day", label: "My Day", icon: CalendarClock },
  { key: "ask", label: "Ask ZAVÉA", icon: MessageCircle },
  { key: "products", label: "Products", icon: Shirt },
  { key: "pnl", label: "Daily P&L", icon: LineChart },
];

const SUBTITLES: Record<Tab, string> = {
  mission: "What is happening in my business right now?",
  day: "What should I work on, and in what order?",
  ask: "Ask anything about the business",
  products: "Every active and draft product",
  pnl: "Revenue, cost, and profit, per day",
};

export function AppShell() {
  const [tab, setTab] = useState<Tab>("mission");
  const { status, workspace, errorMessage, signIn, retry } = useWorkspaceSession();

  return (
    <div className="zc-root">
      <div className="zc-header">
        <div className="zc-brand">ZAVÉA Command Center</div>
        <div className="zc-brand-sub">{status === "ready" ? SUBTITLES[tab] : workspace?.workspaceName}</div>
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
          {tab === "products" && <ProductsView workspaceId={workspace.workspaceId} />}
          {tab === "pnl" && <DailyPnlView workspaceId={workspace.workspaceId} />}

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
