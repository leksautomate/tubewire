import { TrendingKeyword } from "@/lib/mock-data";

export default function TrendingKeywords({ keywords }: { keywords: TrendingKeyword[] }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">Trending Keywords</h2>
        <span className="text-xs text-neutral-500">Last 7 days (approximated)</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {keywords.map((k) => (
          <div
            key={k.term}
            className="min-w-[180px] shrink-0 rounded-lg border border-white/10 bg-neutral-900/60 p-3"
          >
            <span className="inline-block rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
              +{k.percentIncrease}%
            </span>
            <div className="mt-2 text-sm text-neutral-500">Increase in searches</div>
            <div className="font-medium">{k.term}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
