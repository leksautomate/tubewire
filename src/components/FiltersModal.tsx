"use client";

import { useState } from "react";
import DualRangeSlider from "@/components/DualRangeSlider";
import { FILTER_BOUNDS, OutlierFilters, defaultFilters } from "@/lib/outlier-filters";

type Props = {
  filters: OutlierFilters;
  onApply: (filters: OutlierFilters) => void;
  onClose: () => void;
};

const minutesFmt = (seconds: number) => `${Math.round(seconds / 60)} min`;
const countFmt = (v: number) => v.toLocaleString();

export default function FiltersModal({ filters, onApply, onClose }: Props) {
  // Draft state so Reset/close-without-applying don't affect the live query
  // until "Apply Filters" is clicked.
  const [draft, setDraft] = useState<OutlierFilters>(filters);

  const set = (key: keyof OutlierFilters) => (value: [number, number]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-6">
      <div className="w-full max-w-3xl rounded-xl border border-white/10 bg-neutral-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="mb-4 text-sm font-medium text-neutral-300">Main Metrics</div>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <DualRangeSlider
            label="Average Views (channel)"
            {...FILTER_BOUNDS.avgViews}
            value={draft.avgViews}
            onChange={set("avgViews")}
            formatValue={countFmt}
          />
          <DualRangeSlider
            label="Video Duration"
            {...FILTER_BOUNDS.durationSec}
            value={draft.durationSec}
            onChange={set("durationSec")}
            formatValue={minutesFmt}
          />
          <DualRangeSlider
            label="Outlier Score"
            {...FILTER_BOUNDS.outlier}
            value={draft.outlier}
            onChange={set("outlier")}
            formatValue={(v) => `${v}x`}
          />
          <DualRangeSlider
            label="Subscribers"
            {...FILTER_BOUNDS.subs}
            value={draft.subs}
            onChange={set("subs")}
            formatValue={countFmt}
          />
          <DualRangeSlider
            label="Video Views"
            {...FILTER_BOUNDS.views}
            value={draft.views}
            onChange={set("views")}
            formatValue={countFmt}
          />
          <DualRangeSlider
            label="Channel Video Count"
            {...FILTER_BOUNDS.videoCount}
            value={draft.videoCount}
            onChange={set("videoCount")}
            formatValue={countFmt}
          />
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          Category, Language, Country and Sort aren&apos;t wired to a real data source
          yet — the numeric filters above run against live YouTube results.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setDraft(defaultFilters())}
            className="rounded-md border border-white/10 px-4 py-2 text-sm text-neutral-300 hover:bg-white/5"
          >
            Reset Filters
          </button>
          <button
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-cyan-400"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
