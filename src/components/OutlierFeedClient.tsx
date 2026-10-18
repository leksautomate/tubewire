"use client";

import { useState } from "react";
import FiltersModal from "@/components/FiltersModal";
import OutlierVideoCard from "@/components/OutlierVideoCard";
import { OutlierVideo, quickFilters } from "@/lib/mock-videos";
import { formatTimeAgo } from "@/lib/format";
import { OutlierResult } from "@/app/api/outliers/route";
import { OutlierFilters, defaultFilters, filtersToSearchParams } from "@/lib/outlier-filters";

function toOutlierVideo(r: OutlierResult): OutlierVideo {
  return {
    id: r.id,
    title: r.title,
    thumbnailUrl: r.thumbnailUrl,
    durationLabel: r.durationLabel,
    channelName: r.channelName,
    views: r.views,
    publishedAgo: formatTimeAgo(r.publishedAt),
    vph: r.vph,
    outlierMultiplier: r.outlierMultiplier,
    subscribers: r.subscribers,
  };
}

export default function OutlierFeedClient({ videos }: { videos: OutlierVideo[] }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeChip, setActiveChip] = useState(quickFilters[0]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<OutlierFilters>(defaultFilters());
  const [results, setResults] = useState<OutlierVideo[]>(videos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const filterParams = filtersToSearchParams(filters);
  const activeFilterCount = Array.from(filterParams.keys()).length;

  async function runSearch(e?: React.FormEvent, overrideFilters?: OutlierFilters) {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const params = filtersToSearchParams(overrideFilters ?? filters);
      params.set("q", query);
      const res = await fetch(`/api/outliers?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setResults((data.results as OutlierResult[]).map(toOutlierVideo));
      setIsLive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function handleApplyFilters(next: OutlierFilters) {
    setFilters(next);
    if (isLive) runSearch(undefined, next); // re-run against the live result set
  }

  return (
    <div>
      <form onSubmit={runSearch} className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Outliers (e.g. personal finance, minecraft)"
          className="min-w-[240px] flex-1 rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm placeholder:text-neutral-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "Searching…" : "Search"}
        </button>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="relative rounded-md border border-white/10 bg-neutral-900 px-4 py-2 text-sm hover:bg-white/5"
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-neutral-950">
              {activeFilterCount}
            </span>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}
      {!isLive && !error && (
        <div className="mt-3 text-xs text-neutral-500">
          Showing demo data — search above for live results from the YouTube Data API.
        </div>
      )}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {quickFilters.map((chip) => (
          <button
            key={chip}
            onClick={() => setActiveChip(chip)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
              activeChip === chip
                ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-300"
                : "border-white/10 bg-neutral-900 text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((video) => (
          <OutlierVideoCard key={video.id} video={video} />
        ))}
      </div>

      {filtersOpen && (
        <FiltersModal
          filters={filters}
          onApply={handleApplyFilters}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>
  );
}
