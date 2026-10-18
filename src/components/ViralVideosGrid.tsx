import { ViralVideo } from "@/lib/mock-data";
import { formatCompactNumber } from "@/lib/format";

export default function ViralVideosGrid({ videos }: { videos: ViralVideo[] }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">Viral Videos On Small Channels</h2>
        <span className="text-xs text-neutral-500">Last 30 days</span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {videos.map((v) => (
          <div
            key={v.id}
            className="overflow-hidden rounded-lg border border-white/10 bg-neutral-900/60"
          >
            <div className="flex aspect-video items-center justify-center bg-neutral-800 text-xs text-neutral-500">
              thumbnail
            </div>
            <div className="p-3">
              <div className="truncate text-sm font-medium">{v.title}</div>
              <div className="mt-1 flex justify-between text-xs text-neutral-500">
                <span>{formatCompactNumber(v.channelSubscribers)} subs</span>
                <span>{formatCompactNumber(v.views)} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
