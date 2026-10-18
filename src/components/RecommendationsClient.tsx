"use client";

import { useState } from "react";
import { OutlierResult } from "@/lib/outliers";
import { formatCompactNumber } from "@/lib/format";

export default function RecommendationsClient() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [basedOn, setBasedOn] = useState<OutlierResult[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!niche.trim()) return;

    setLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setRecommendation(data.recommendation);
      setBasedOn(data.basedOn ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="A niche to analyze (e.g. personal finance, retro tech)"
          className="flex-1 rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm placeholder:text-neutral-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {recommendation && (
        <div className="mt-6 rounded-lg border border-white/10 bg-neutral-900/60 p-5">
          <div className="mb-3 text-xs font-medium uppercase tracking-wide text-cyan-400">
            Claude's take
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-200">
            {recommendation}
          </div>
        </div>
      )}

      {basedOn.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
            Based on these outliers
          </div>
          <div className="space-y-2">
            {basedOn.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-md border border-white/10 bg-neutral-900/40 px-3 py-2 text-xs"
              >
                <span className="truncate pr-3">{o.title}</span>
                <span className="shrink-0 text-neutral-500">
                  {formatCompactNumber(o.views)} views · {o.outlierMultiplier}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
