import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Flame } from "lucide-react";
import { SPOTS, type Category } from "@/lib/mock-data";
import { SpotCard } from "@/components/SpotCard";
import { CategoryChips } from "@/components/CategoryChips";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LocalEats — Discover Lomé's best food spots" },
      { name: "description", content: "Community-curated street food, maquis, restaurants and cafés across Lomé." },
    ],
  }),
  component: Feed,
});

function Feed() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return SPOTS.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (q && !(`${s.name} ${s.neighborhood} ${s.description}`.toLowerCase().includes(q.toLowerCase())))
        return false;
      return true;
    });
  }, [cat, q]);

  const trending = SPOTS.filter((s) => s.trending);

  return (
    <div>
      <header className="bg-gradient-to-br from-primary via-[oklch(0.68_0.18_45)] to-[oklch(0.75_0.15_65)] px-4 pb-6 pt-6 text-primary-foreground">
        <p className="text-xs font-medium uppercase tracking-wider opacity-90">Lomé · Togo</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight">
          Bonne bouffe,<br />bonne compagnie.
        </h1>
        <p className="mt-1 text-sm opacity-90">Discover the spots your neighbors are eating at.</p>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a dish, spot or neighborhood…"
            className="w-full rounded-full bg-background/95 py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.83_0.17_82)]"
          />
        </div>
      </header>

      <div className="px-4 pt-4">
        <CategoryChips value={cat} onChange={setCat} />
      </div>

      {cat === "all" && !q && (
        <section className="mt-5 px-4">
          <div className="mb-2 flex items-center gap-2">
            <Flame className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-bold">Trending nearby</h2>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {trending.map((s) => (
              <div key={s.id} className="w-64 shrink-0">
                <SpotCard spot={s} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-5 space-y-3 px-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Recently added</h2>
          <span className="text-xs text-muted-foreground">{filtered.length} spots</span>
        </div>
        <div className="space-y-3">
          {filtered.map((s) => (
            <SpotCard key={s.id} spot={s} />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No spots match this filter yet. Be the first to add one!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
