import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 180);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <header className="px-4 pb-4 pt-6">
        <p className="font-chalk text-base leading-none text-primary">Lomé · Togo</p>
        <h1 className="mt-1 font-display text-[2rem] font-extrabold leading-[1.05] text-foreground">
          Bonne bouffe,<br />
          <span className="text-primary">bonne compagnie.</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The spots your neighbors are actually eating at.
        </p>
        <div className="relative mt-4">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.5}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a dish, spot or neighborhood…"
            className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </header>

      <div className="sticky top-2 z-30 mx-3 mt-1">
        <CategoryChips value={cat} onChange={setCat} variant={scrolled ? "glass" : "chalk"} />
      </div>

      {cat === "all" && !q && (
        <section className="mt-5 px-4">
          <div className="mb-2 flex items-center gap-2">
            <Flame className="h-4 w-4 text-primary" strokeWidth={1.5} />
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
          <span className="font-chalk text-base text-muted-foreground">{filtered.length} spots</span>
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
