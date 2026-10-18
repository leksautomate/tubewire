import { Category } from "@/lib/mock-data";
import { formatCompactNumber } from "@/lib/format";

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">Most Popular Categories</h2>
        <span className="text-xs text-neutral-500">
          Builds up as you search — starts empty on a fresh install
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {categories.map((c) => (
          <div
            key={c.name}
            className="rounded-lg border border-white/10 bg-neutral-900/60 p-4"
          >
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-neutral-500">
              {formatCompactNumber(c.channelCount)} channels
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
