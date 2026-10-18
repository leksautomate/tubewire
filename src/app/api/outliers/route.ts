import { NextRequest, NextResponse } from "next/server";
import { fetchOutliers, rangeParam, OutlierResult } from "@/lib/outliers";

export type { OutlierResult };

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const query = params.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Missing required query param: q" }, { status: 400 });
  }

  const filters = {
    subs: rangeParam(params, "Subs"),
    views: rangeParam(params, "Views"),
    outlier: rangeParam(params, "Outlier"),
    durationSec: rangeParam(params, "DurationSec"),
    avgViews: rangeParam(params, "AvgViews"),
    videoCount: rangeParam(params, "VideoCount"),
  };

  try {
    const results = await fetchOutliers(query, filters);
    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
