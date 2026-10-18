// Placeholder data shaped like what the real YouTube Data API + our own
// accumulated index will eventually return. Swap this module out once
// src/lib/youtube.ts is wired to a real API key — the component props
// below are the actual contract, so nothing upstream needs to change.

export type OutlierChannel = {
  id: string;
  name: string;
  avatarUrl: string;
  subscribers: number;
  avgViews: number;
  videoCount: number;
  daysSinceStart: number;
  outlierScore: number; // avgViews / subscribers, roughly
};

export type TrendingKeyword = {
  term: string;
  percentIncrease: number;
};

export type Category = {
  name: string;
  channelCount: number;
};

export type ViralVideo = {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelSubscribers: number;
  views: number;
};

export const outlierChannels: OutlierChannel[] = [
  {
    id: "1",
    name: "Operation Archive",
    avatarUrl: "/avatars/placeholder-1.svg",
    subscribers: 1160,
    avgViews: 11_948_000,
    videoCount: 9,
    daysSinceStart: 88,
    outlierScore: 10.3,
  },
  {
    id: "2",
    name: "Tom Sosnoff",
    avatarUrl: "/avatars/placeholder-2.svg",
    subscribers: 72_900,
    avgViews: 590_490,
    videoCount: 41,
    daysSinceStart: 410,
    outlierScore: 8.1,
  },
  {
    id: "3",
    name: "Body Cam Context",
    avatarUrl: "/avatars/placeholder-3.svg",
    subscribers: 1400,
    avgViews: 10_500,
    videoCount: 22,
    daysSinceStart: 150,
    outlierScore: 7.5,
  },
  {
    id: "4",
    name: "Ink Explainer",
    avatarUrl: "/avatars/placeholder-4.svg",
    subscribers: 136_000,
    avgViews: 1_320_000,
    videoCount: 17,
    daysSinceStart: 173,
    outlierScore: 17.0,
  },
  {
    id: "5",
    name: "Fossil",
    avatarUrl: "/avatars/placeholder-5.svg",
    subscribers: 39_500,
    avgViews: 1_280_000,
    videoCount: 13,
    daysSinceStart: 200,
    outlierScore: 13.0,
  },
  {
    id: "6",
    name: "Epic AI Films",
    avatarUrl: "/avatars/placeholder-6.svg",
    subscribers: 227_000,
    avgViews: 868_820,
    videoCount: 77,
    daysSinceStart: 756,
    outlierScore: 77.0,
  },
];

export const trendingKeywords: TrendingKeyword[] = [
  { term: "Zack D Films", percentIncrease: 41 },
  { term: "Mrbeast", percentIncrease: 36 },
  { term: "Ancapsu", percentIncrease: 23 },
  { term: "Crown Watch", percentIncrease: 21 },
  { term: "Mr Beast", percentIncrease: 20 },
];

export const popularCategories: Category[] = [
  { name: "Video games", channelCount: 9719 },
  { name: "History", channelCount: 5299 },
  { name: "Animation", channelCount: 3539 },
  { name: "Anime", channelCount: 2543 },
  { name: "Movies", channelCount: 2339 },
];

export const viralVideos: ViralVideo[] = [
  {
    id: "v1",
    title: "Japan Flood Control",
    thumbnailUrl: "/thumbs/placeholder-1.svg",
    channelSubscribers: 8200,
    views: 2_100_000,
  },
  {
    id: "v2",
    title: "It's Over",
    thumbnailUrl: "/thumbs/placeholder-2.svg",
    channelSubscribers: 4100,
    views: 3_400_000,
  },
  {
    id: "v3",
    title: "Old Coin Find",
    thumbnailUrl: "/thumbs/placeholder-3.svg",
    channelSubscribers: 1900,
    views: 980_000,
  },
  {
    id: "v4",
    title: "Flood Control Explained",
    thumbnailUrl: "/thumbs/placeholder-4.svg",
    channelSubscribers: 6700,
    views: 1_650_000,
  },
];
