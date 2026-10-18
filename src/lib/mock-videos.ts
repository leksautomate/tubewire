// Shaped like the eventual YouTube Data API-backed response: a video's own
// stats plus its channel's stats, with vph/outlierMultiplier computed from
// them (views-per-hour since upload, and avg-views ÷ subscribers).

export type OutlierVideo = {
  id: string;
  title: string;
  thumbnailUrl?: string; // absent on mock entries, which render a placeholder
  durationLabel: string;
  channelName: string;
  views: number;
  publishedAgo: string;
  vph: number;
  outlierMultiplier: number;
  subscribers: number;
};

export const quickFilters: string[] = [
  "All Videos",
  "Recently Published",
  "Viral videos on small channels",
  "AI-Made Outliers",
  "Fresh Channel Breakouts",
  "Viral on medium channels",
  "Above 1M Video Views",
  "High outlier score",
];

export const outlierVideos: OutlierVideo[] = [
  {
    id: "ov1",
    title: "Achraf Hakimi | First & Last Goal For Every Team",
    durationLabel: "02:01",
    channelName: "AP Football",
    views: 167_940,
    publishedAgo: "5 months ago",
    vph: 44,
    outlierMultiplier: 2.3,
    subscribers: 13_900,
  },
  {
    id: "ov2",
    title: "Adama Traoré | First & Last Goal For Every Team",
    durationLabel: "02:01",
    channelName: "AP Football",
    views: 181_540,
    publishedAgo: "6 months ago",
    vph: 39,
    outlierMultiplier: 2.48,
    subscribers: 13_900,
  },
  {
    id: "ov3",
    title: "How chinese takeaway REALLY make salt and chilli chips",
    durationLabel: "02:01",
    channelName: "Chinese Takeaway POV",
    views: 234_150,
    publishedAgo: "12 days ago",
    vph: 801,
    outlierMultiplier: 29.64,
    subscribers: 4_630,
  },
  {
    id: "ov4",
    title: "FIFA World Cup Trophy Evolution 1930-2026",
    durationLabel: "02:02",
    channelName: "Quick Data Comparison",
    views: 498_440,
    publishedAgo: "4 months ago",
    vph: 160,
    outlierMultiplier: 30.69,
    subscribers: 5_050,
  },
  {
    id: "ov5",
    title: "Every Animated Movie Released in 2026 (and upcoming)",
    durationLabel: "02:02",
    channelName: "World Motion",
    views: 178_090,
    publishedAgo: "2 months ago",
    vph: 25,
    outlierMultiplier: 3.47,
    subscribers: 2_900,
  },
];
