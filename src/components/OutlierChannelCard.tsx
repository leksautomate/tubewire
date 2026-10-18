import { OutlierChannel } from "@/lib/mock-data";
import { formatCompactNumber } from "@/lib/format";

function scoreBarWidth(score: number): string {
  // Cosmetic only: cap the bar so very large outlier scores don't overflow.
  return `${Math.min(100, (score / 80) * 100)}%`;
}

export default function OutlierChannelCard({ channel }: { channel: OutlierChannel }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-neutral-900/60 p-4">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 rounded-md bg-gradient-to-br from-neutral-700 to-neutral-800" />
        <div>
          <div className="font-medium">{channel.name}</div>
          <div className="text-xs text-neutral-500">
            {formatCompactNumber(channel.subscribers)} subscribers
          </div>
          <div className="mt-2 flex gap-4 text-xs text-neutral-400">
            <span>
              Avg views{" "}
              <span className="font-medium text-neutral-200">
                {formatCompactNumber(channel.avgViews)}
              </span>
            </span>
            <span>
              Videos{" "}
              <span className="font-medium text-neutral-200">
                {channel.videoCount}
              </span>
            </span>
            <span>
              Days since start{" "}
              <span className="font-medium text-neutral-200">
                {channel.daysSinceStart}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-28 shrink-0 flex-col items-end gap-1.5">
        <span className="text-sm font-semibold text-emerald-400">
          {channel.outlierScore.toFixed(1)}×
        </span>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
            style={{ width: scoreBarWidth(channel.outlierScore) }}
          />
        </div>
        <span className="text-[10px] text-neutral-500">outlier score</span>
      </div>
    </div>
  );
}
