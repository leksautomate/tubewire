import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import OutlierChannelCard from "@/components/OutlierChannelCard";
import TrendingKeywords from "@/components/TrendingKeywords";
import CategoryGrid from "@/components/CategoryGrid";
import ViralVideosGrid from "@/components/ViralVideosGrid";
import {
  outlierChannels,
  trendingKeywords,
  popularCategories,
  viralVideos,
} from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-50">
      <Sidebar />
      <div className="flex-1">
        <TopBar />
        <main className="flex flex-col gap-10 p-6">
          <section>
            <h2 className="mb-3 font-semibold">Outlier Channels</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {outlierChannels.map((channel) => (
                <OutlierChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
          </section>

          <TrendingKeywords keywords={trendingKeywords} />
          <CategoryGrid categories={popularCategories} />
          <ViralVideosGrid videos={viralVideos} />
        </main>
      </div>
    </div>
  );
}
