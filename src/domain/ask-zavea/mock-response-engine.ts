import { Recommendation } from "../entities";

/**
 * Ported from the Phase 1 prototype's askZavea(). Same keyword-matching,
 * same operator-voice output shape — the only thing that changed is where
 * `recs` comes from: real, persisted Supabase data instead of a hardcoded
 * mock array. This function has no knowledge of Supabase at all, which is
 * what makes it swappable for a real AI provider later without any change
 * to Mission Control, My Day, or this call site.
 */
export function askZavea(question: string, recs: Recommendation[]): string {
  if (recs.length === 0) {
    return "There's nothing active in the system right now — once a recommendation exists, I can tell you what to prioritize.";
  }

  const q = question.toLowerCase();
  const top = recs[0];
  const critical = recs.find((r) => r.severity === "critical");
  const opportunities = recs.filter((r) => r.severity === "opportunity");

  const fmt = (r: Recommendation) =>
    `Do this first:\n\n${r.title}\n\nWhy:\n${r.reasoning}\n\nPriority: ${r.priorityScore}/100\nEstimated time: ${r.estimatedMinutes} minutes`;

  if (q.includes("right now") || q.includes("first") || q.includes("do next")) {
    return `${fmt(top)}\n\nI would not increase ad spend until this is resolved.`;
  }
  if (q.includes("sales down") || q.includes("why are sales") || q.includes("biggest problem")) {
    return critical
      ? `${critical.title}\n\n${critical.reasoning}\n\nSupporting data: ${critical.metrics
          .map((m) => `${m.label} ${m.value}`)
          .join(", ")}.\n\nThis is the most likely explanation — confidence ${critical.confidence}%.`
      : `Nothing critical is flagged right now. The closest thing to a concern is "${top.title}."`;
  }
  if (q.includes("increase") && q.includes("spend")) {
    const test = recs.find((r) => r.category === "Meta Ads" && r.severity === "opportunity");
    if (!test) return `Nothing on the Meta Ads side is a clear scale candidate right now.`;
    return `Not yet — check "${top.title}" first.\n\n"${test.title}" (${test.expectedImpact ?? "early signal"}) is closer to a scale candidate, but confidence is still ${test.confidence}%. I'd wait for more data before increasing spend.`;
  }
  if (q.includes("working") || q.includes("good") || q.includes("healthy")) {
    if (opportunities.length === 0) return "Nothing stands out as a clear opportunity right now.";
    return opportunities.map((o) => `${o.title} — ${o.expectedImpact ?? o.reasoning}`).join("\n\n");
  }
  if (q.includes("test next") || q.includes("what should i test")) {
    const product = recs.find((r) => r.category === "Products");
    if (!product) return "No product-level opportunity is flagged right now.";
    return `${product.title}\n\n${product.recommendedAction}\n\n${product.expectedImpact ?? ""}`;
  }
  if (q.includes("which task")) {
    return `${top.title} — priority ${top.priorityScore}/100, about ${top.estimatedMinutes} minutes. Everything else can wait behind it.`;
  }
  return `${fmt(top)}\n\nAsk me about a specific ad, product, or "what's working" and I'll pull the numbers behind it.`;
}

export const EXAMPLE_QUESTIONS = [
  "What should I do right now?",
  "Why are sales down?",
  "What is the biggest problem in the business?",
  "Should I increase ad spend?",
  "What is working?",
  "What should I test next?",
];
