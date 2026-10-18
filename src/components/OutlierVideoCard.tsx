import { OutlierVideo } from "@/lib/mock-videos";
import { formatCompactNumber } from "@/lib/format";

function multiplierColor(m: number): string {
  if (m >= 10) return "bg-purple-500/20 text-purple-300";
  if (m >= 3) return "bg-amber-500/20 text-amber-300";
  return "bg-neutral-700 text-neutral-300";
}

export default function OutlierVideoCard({ video }: { video: OutlierVideo }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-neutral-900/60">
      <div className="relative flex aspect-video items-center justify-center bg-neutral-800 text-xs text-neutral-500">
        thumbnail
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium">
          {video.durationLabel}
        </span>
      </div>
      <div className="p-3">
        <div className="flex gap-2">
          <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium leading-snug">{video.title}</div>
            <div className="text-xs text-neutral-500">{video.channelName}</div>
            <div className="text-xs text-neutral-500">
              {formatCompactNumber(video.views)} views · {video.publishedAgo}
            </div>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="rounded bg-neutral-800 px-1.5 py-0.5 font-medium text-neutral-300">
            {video.vph} VPH
          </span>
          <span className={`rounded px-1.5 py-0.5 font-medium ${multiplierColor(video.outlierMultiplier)}`}>
            {video.outlierMultiplier}x
          </span>
          <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-neutral-400">
            {formatCompactNumber(video.subscribers)} subscribers
          </span>
        </div>
      </div>
    </div>
  );
}
