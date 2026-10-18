export default function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold">Niche Finder · Overview</h1>
        <p className="text-sm text-neutral-500">
          Outlier channels and trends, computed live from public YouTube data.
        </p>
      </div>
      <div className="flex items-center gap-3 text-sm text-neutral-400">
        <span className="rounded-full border border-white/10 px-3 py-1">
          Demo data
        </span>
      </div>
    </header>
  );
}
