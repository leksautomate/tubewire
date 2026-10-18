import { searchVideos, getVideos, getChannels, YtVideo, YtChannel } from "@/lib/youtube";
import { parseIsoDuration } from "@/lib/iso-duration";

export type OutlierResult = {
  id: string;
  title: string;
  thumbnailUrl: string;
  durationLabel: string;
  durationSeconds: number;
  channelName: string;
  views: number;
  publishedAt: string;
  vph: number;
  outlierMultiplier: number;
  subscribers: number;
  channelAvgViews: number;
  channelVideoCount: number;
};

export type OutlierRange = { min?: number; max?: number };
export type OutlierFilterParams = {
  subs?: OutlierRange;
  views?: OutlierRange;
  outlier?: OutlierRange;
  durationSec?: OutlierRange;
  avgViews?: OutlierRange;
  videoCount?: OutlierRange;
};

function withinRange(value: number, range?: OutlierRange): boolean {
  if (!range) return true;
  if (range.min !== undefined && value < range.min) return false;
  if (range.max !== undefined && value > range.max) return false;
  return true;
}

/** One search call (100 quota units) + cheap batch lookups, filtered and
 *  sorted by outlier multiplier descending. Shared by /api/outliers and
 *  /api/recommendations so both see the same numbers for the same query. */
export async function fetchOutliers(
  query: string,
  filters: OutlierFilterParams = {},
  maxResults = 25
): Promise<OutlierResult[]> {
  const videoIds = await searchVideos({ query, maxResults, order: "viewCount" });
  const videos = await getVideos(videoIds);

  const channelIds = videos.map((v) => v.snippet.channelId);
  const channels = await getChannels(channelIds);
  const channelById = new Map<string, YtChannel>(channels.map((c) => [c.id, c]));

  return videos
    .map((video: YtVideo) => {
      const channel = channelById.get(video.snippet.channelId);
      if (!channel) return null;

      const views = Number(video.statistics.viewCount ?? 0);
      const subscribers = Number(channel.statistics.subscriberCount ?? 0);
      const channelViews = Number(channel.statistics.viewCount ?? 0);
      const channelVideoCount = Number(channel.statistics.videoCount ?? 1);
      const channelAvgViews = channelViews / Math.max(channelVideoCount, 1);

      const hoursSincePublished = Math.max(
        (Date.now() - new Date(video.snippet.publishedAt).getTime()) / (1000 * 60 * 60),
        1
      );
      const { seconds: durationSeconds, label: durationLabel } = parseIsoDuration(
        video.contentDetails.duration
      );

      return {
        id: video.id,
        title: video.snippet.title,
        thumbnailUrl:
          video.snippet.thumbnails.high?.url ?? video.snippet.thumbnails.medium?.url ?? "",
        durationLabel,
        durationSeconds,
        channelName: video.snippet.channelTitle,
        views,
        publishedAt: video.snippet.publishedAt,
        vph: Math.round(views / hoursSincePublished),
        outlierMultiplier: channelAvgViews > 0
          ? Math.round((views / channelAvgViews) * 100) / 100
          : 0,
        subscribers,
        channelAvgViews: Math.round(channelAvgViews),
        channelVideoCount,
      };
    })
    .filter((r): r is OutlierResult => r !== null)
    .filter(
      (r) =>
        withinRange(r.subscribers, filters.subs) &&
        withinRange(r.views, filters.views) &&
        withinRange(r.outlierMultiplier, filters.outlier) &&
        withinRange(r.durationSeconds, filters.durationSec) &&
        withinRange(r.channelAvgViews, filters.avgViews) &&
        withinRange(r.channelVideoCount, filters.videoCount)
    )
    .sort((a, b) => b.outlierMultiplier - a.outlierMultiplier);
}

/** Reads `min<Name>`/`max<Name>` query params as an optional numeric range. */
export function rangeParam(params: URLSearchParams, name: string): OutlierRange {
  const min = params.get(`min${name}`);
  const max = params.get(`max${name}`);
  return {
    min: min !== null ? Number(min) : undefined,
    max: max !== null ? Number(max) : undefined,
  };
}
