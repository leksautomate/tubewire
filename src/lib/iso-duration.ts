// Parses a YouTube "contentDetails.duration" value (ISO 8601, e.g. "PT4M13S")
// into total seconds and an "mm:ss" (or "h:mm:ss") label.

export function parseIsoDuration(iso: string): { seconds: number; label: string } {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  const hours = Number(match?.[1] ?? 0);
  const minutes = Number(match?.[2] ?? 0);
  const seconds = Number(match?.[3] ?? 0);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  const pad = (n: number) => String(n).padStart(2, "0");
  const label = hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;

  return { seconds: totalSeconds, label };
}
