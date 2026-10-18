// Thin server-side client over the official YouTube Data API v3.
// Never import this from a client component — it reads YOUTUBE_API_KEY
// from the environment and must only run on the server (API routes,
// server components, server actions).

import { getSetting } from "@/lib/settings";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

async function apiKey(): Promise<string> {
  const key = await getSetting("YOUTUBE_API_KEY");
  if (!key) {
    throw new Error(
      "YOUTUBE_API_KEY is not set. Add it in /admin, or in .env.local for local dev."
    );
  }
  return key;
}

async function youtubeFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}/${path}`);
  url.searchParams.set("key", await apiKey());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API ${path} failed: ${res.status} ${body}`);
  }
  return res.json() as Promise<T>;
}

export type YtSearchItem = {
  id: { videoId?: string; channelId?: string };
};

export type YtVideo = {
  id: string;
  snippet: {
    title: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: { medium?: { url: string }; high?: { url: string } };
  };
  statistics: { viewCount?: string; likeCount?: string; commentCount?: string };
  contentDetails: { duration: string };
};

export type YtChannel = {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: { medium?: { url: string }; high?: { url: string } };
  };
  statistics: {
    subscriberCount?: string;
    viewCount?: string;
    videoCount?: string;
    hiddenSubscriberCount?: boolean;
  };
};

/** Costs 100 quota units per call — the expensive one. Keep calls few. */
export async function searchVideos(opts: {
  query: string;
  maxResults?: number;
  order?: "relevance" | "viewCount" | "date" | "rating";
  publishedAfter?: string; // RFC3339
}): Promise<string[]> {
  const data = await youtubeFetch<{ items: YtSearchItem[] }>("search", {
    part: "id",
    type: "video",
    q: opts.query,
    maxResults: String(opts.maxResults ?? 25),
    order: opts.order ?? "viewCount",
    ...(opts.publishedAfter ? { publishedAfter: opts.publishedAfter } : {}),
  });
  return data.items.map((i) => i.id.videoId).filter((id): id is string => Boolean(id));
}

/** 1 unit regardless of how many ids (up to 50) are batched in. */
export async function getVideos(ids: string[]): Promise<YtVideo[]> {
  if (ids.length === 0) return [];
  const data = await youtubeFetch<{ items: YtVideo[] }>("videos", {
    part: "snippet,statistics,contentDetails",
    id: ids.slice(0, 50).join(","),
  });
  return data.items;
}

/** 1 unit regardless of how many ids (up to 50) are batched in. */
export async function getChannels(ids: string[]): Promise<YtChannel[]> {
  if (ids.length === 0) return [];
  const data = await youtubeFetch<{ items: YtChannel[] }>("channels", {
    part: "snippet,statistics",
    id: [...new Set(ids)].slice(0, 50).join(","),
  });
  return data.items;
}
