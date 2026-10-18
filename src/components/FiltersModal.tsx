"use client";

import DualRangeSlider from "@/components/DualRangeSlider";

export default function FiltersModal({ onClose }: { onClose: () => void }) {
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
            label="Average Views"
            min={1000}
            max={1_000_000}
            step={1000}
            formatValue={(v) => v.toLocaleString()}
          />
          <DualRangeSlider
            label="Video Duration"
            min={2}
            max={45}
            formatValue={(v) => `${v} min`}
          />
          <DualRangeSlider label="Outlier Score" min={0} max={100} formatValue={(v) => `${v}x`} />
          <DualRangeSlider
            label="Subscribers"
            min={1000}
            max={1_000_000}
            step={1000}
            formatValue={(v) => v.toLocaleString()}
          />
          <DualRangeSlider
            label="Video Views"
            min={1000}
            max={10_000_000}
            step={1000}
            formatValue={(v) => v.toLocaleString()}
          />
          <DualRangeSlider label="Channel Video Count" min={1} max={1000} />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm text-neutral-300">Video Upload Date</label>
          <input
            type="date"
            className="w-full rounded-md border border-white/10 bg-neutral-800 px-3 py-2 text-sm"
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {["Category", "Language", "Country"].map((label) => (
            <div key={label}>
              <label className="mb-2 block text-sm text-neutral-300">{label}</label>
              <select className="w-full rounded-md border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-neutral-400">
                <option>{label}</option>
              </select>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {["Sort By", "Sort Order"].map((label) => (
            <div key={label}>
              <label className="mb-2 block text-sm text-neutral-300">{label}</label>
              <select className="w-full rounded-md border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-neutral-400">
                <option>{label}</option>
              </select>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button className="rounded-md border border-white/10 px-4 py-2 text-sm text-neutral-300 hover:bg-white/5">
            Reset Filters
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-cyan-400"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
