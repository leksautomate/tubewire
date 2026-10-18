export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatTimeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) return "less than an hour ago";
  if (diffHours < 24) return `${Math.floor(diffHours)} hours ago`;
  const diffDays = diffHours / 24;
  if (diffDays < 30) return `${Math.floor(diffDays)} days ago`;
  const diffMonths = diffDays / 30.44;
  if (diffMonths < 12) return `${Math.floor(diffMonths)} months ago`;
  return `${Math.floor(diffMonths / 12)} years ago`;
}
