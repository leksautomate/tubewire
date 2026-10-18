import Sidebar from "@/components/Sidebar";
import RecommendationsClient from "@/components/RecommendationsClient";

export default function RecommendationsPage() {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-50">
      <Sidebar />
      <div className="flex-1">
        <header className="border-b border-white/10 px-6 py-4">
          <h1 className="text-lg font-semibold">Niche Finder · AI Recommendations</h1>
          <p className="text-sm text-neutral-500">
            Claude reads the current outlier videos in a niche and suggests concrete angles,
            grounded in what&apos;s actually working right now.
          </p>
        </header>
        <main className="p-6">
          <RecommendationsClient />
        </main>
      </div>
    </div>
  );
}
