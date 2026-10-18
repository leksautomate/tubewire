"use client";

import { useState } from "react";
import FiltersModal from "@/components/FiltersModal";
import OutlierVideoCard from "@/components/OutlierVideoCard";
import { OutlierVideo, quickFilters } from "@/lib/mock-videos";

export default function OutlierFeedClient({ videos }: { videos: OutlierVideo[] }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeChip, setActiveChip] = useState(quickFilters[0]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search Outliers"
          className="min-w-[240px] flex-1 rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm placeholder:text-neutral-500"
        />
        <button
          onClick={() => setFiltersOpen(true)}
          className="rounded-md border border-white/10 bg-neutral-900 px-4 py-2 text-sm hover:bg-white/5"
        >
          Filters
        </button>
      </div>

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
        {videos.map((video) => (
          <OutlierVideoCard key={video.id} video={video} />
        ))}
      </div>

      {filtersOpen && <FiltersModal onClose={() => setFiltersOpen(false)} />}
    </div>
  );
}
