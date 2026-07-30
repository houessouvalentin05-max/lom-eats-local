import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Flame } from "lucide-react";
import { SPOTS, type Category } from "@/lib/mock-data";
import { SpotCard } from "@/components/SpotCard";
import { CategoryChips } from "@/components/CategoryChips";
import { BrandMark } from "@/components/AppLaunchSplash";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LocalEats — Discover Lomé's best food spots" },
      {
        name: "description",
        content: "Community-curated street food, maquis, restaurants and cafés across Lomé.",
      },
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
      if (
        q &&
        !`${s.name} ${s.neighborhood} ${s.description}`.toLowerCase().includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [cat, q]);

  const trending = SPOTS.filter((s) => s.trending);

  return (
    <div>
      <header className="feed-hero overflow-hidden px-4 pb-5 pt-5 text-chalk sm:px-6 lg:px-10 lg:pb-8 lg:pt-7 xl:px-14">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandMark className="h-10 w-10 drop-shadow-[0_5px_10px_rgba(0,0,0,0.25)]" />
            <div>
              <div className="font-display text-lg font-extrabold leading-none tracking-tight">
                Local<span className="text-corn">Eats</span>
              </div>
              <p className="mt-1 font-chalk text-sm leading-none text-chalk/70">Lomé · Togo</p>
            </div>
          </div>
          <span className="hero-live-dot">Fresh spots</span>
        </div>
        <h1 className="relative z-10 mt-5 font-display text-[2rem] font-extrabold leading-[1.05] sm:text-4xl lg:mt-8 lg:text-5xl">
          Bonne bouffe,
          <br />
          <span className="text-corn">bonne compagnie.</span>
        </h1>
        <p className="relative z-10 mt-2 text-sm text-chalk/75">
          The spots your neighbors are actually eating at.
        </p>
        <div className="relative z-10 mt-4 lg:max-w-xl">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-clay"
            strokeWidth={1.5}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a dish, spot or neighborhood…"
            className="w-full rounded-full border border-chalk/20 bg-chalk py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground shadow-[0_8px_22px_rgba(0,0,0,0.18)] focus:border-primary focus:outline-none"
          />
        </div>
      </header>

      <div className="sticky top-2 z-30 mx-3 mt-1 sm:mx-6 lg:mx-10 xl:mx-14">
        <CategoryChips value={cat} onChange={setCat} variant={scrolled ? "glass" : "chalk"} />
      </div>

      {cat === "all" && !q && (
        <section className="mt-5 px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="mb-2 flex items-center gap-2">
            <Flame className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <h2 className="font-display text-lg font-bold">Trending nearby</h2>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 xl:grid-cols-4">
            {trending.map((s) => (
              <div key={s.id} className="w-64 shrink-0 lg:w-auto">
                <SpotCard spot={s} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-5 space-y-3 px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Recently added</h2>
          <span className="font-chalk text-base text-muted-foreground">
            {filtered.length} spots
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
