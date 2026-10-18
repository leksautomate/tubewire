// Shared between FiltersModal (which edits these) and OutlierFeedClient
// (which sends them to /api/outliers, whose rangeParam() expects exactly
// these `min<Name>`/`max<Name>` query param names).

export const FILTER_BOUNDS = {
  avgViews: { min: 1_000, max: 1_000_000, step: 1_000 },
  durationSec: { min: 60, max: 2700, step: 10 }, // 1–45 min, matches the reference UI
  outlier: { min: 0, max: 100, step: 1 },
  subs: { min: 1_000, max: 1_000_000, step: 1_000 },
  views: { min: 1_000, max: 10_000_000, step: 1_000 },
  videoCount: { min: 1, max: 1_000, step: 1 },
} as const;

export type OutlierFilters = {
  [K in keyof typeof FILTER_BOUNDS]: [number, number];
};

export function defaultFilters(): OutlierFilters {
  return Object.fromEntries(
    Object.entries(FILTER_BOUNDS).map(([key, b]) => [key, [b.min, b.max]])
  ) as OutlierFilters;
}

const PARAM_NAMES: Record<keyof OutlierFilters, string> = {
  avgViews: "AvgViews",
  durationSec: "DurationSec",
  outlier: "Outlier",
  subs: "Subs",
  views: "Views",
  videoCount: "VideoCount",
};

/** Only emits a bound when it differs from the slider's full range, so an
 *  untouched filter doesn't needlessly constrain the query. */
export function filtersToSearchParams(filters: OutlierFilters): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of Object.keys(FILTER_BOUNDS) as (keyof OutlierFilters)[]) {
    const [lo, hi] = filters[key];
    const bounds = FILTER_BOUNDS[key];
    const name = PARAM_NAMES[key];
    if (lo > bounds.min) params.set(`min${name}`, String(lo));
    if (hi < bounds.max) params.set(`max${name}`, String(hi));
  }
  return params;
}
