const NAV_SECTIONS: { label: string; items: string[] }[] = [
  { label: "", items: ["Overview", "AI Recommendations"] },
  {
    label: "Channels",
    items: [
      "Long Form Channels",
      "Short Form Channels",
      "Real Time Channels",
      "Terminated Channels",
    ],
  },
  {
    label: "",
    items: ["Thumbnail Search", "Keywords", "Channel Tracker", "Faceless Outliers"],
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-neutral-950 p-4 md:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="h-7 w-7 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600" />
        <span className="text-lg font-semibold tracking-tight">tubewire</span>
      </div>

      <div className="mb-4 px-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
        Niche Finder
      </div>

      <nav className="flex flex-1 flex-col gap-1 text-sm">
        {NAV_SECTIONS.map((section, i) => (
          <div key={i} className="mb-2">
            {section.label && (
              <div className="mb-1 mt-3 px-2 text-xs font-medium uppercase tracking-wide text-neutral-600">
                {section.label}
              </div>
            )}
            {section.items.map((item) => (
              <a
                key={item}
                href="#"
                className="block rounded-md px-2 py-1.5 text-neutral-300 hover:bg-white/5 hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-neutral-400">
        Built on the official YouTube Data API — no scraping, no third-party
        key required.
      </div>
    </aside>
  );
}
