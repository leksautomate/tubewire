import Sidebar from "@/components/Sidebar";
import OutlierFeedClient from "@/components/OutlierFeedClient";
import { outlierVideos } from "@/lib/mock-videos";

export default function OutliersPage() {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-50">
      <Sidebar />
      <div className="flex-1">
        <header className="border-b border-white/10 px-6 py-4">
          <h1 className="text-lg font-semibold">Niche Finder · Faceless Outliers</h1>
          <p className="text-sm text-neutral-500">
            Videos ranked by views-per-hour and outlier multiplier against their channel&apos;s subscriber count.
          </p>
        </header>
        <main className="p-6">
          <OutlierFeedClient videos={outlierVideos} />
        </main>
      </div>
    </div>
  );
}
