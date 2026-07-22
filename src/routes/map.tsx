import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SPOTS, CATEGORIES, type Category, type PriceRange, categoryOf } from "@/lib/mock-data";
import { LazyMapView } from "@/components/LazyMap";
import { Star } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Map · LocalEats" },
      { name: "description", content: "Explore Lomé food spots on an interactive map." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [cat, setCat] = useState<Category | "all">("all");
  const [price, setPrice] = useState<PriceRange | "all">("all");

  const spots = useMemo(
    () =>
      SPOTS.filter((s) => (cat === "all" || s.category === cat) && (price === "all" || s.price_range === price)),
    [cat, price],
  );

  return (
    <div className="relative h-[calc(100vh-5rem)]">
      <div className="absolute inset-x-0 top-0 z-20 space-y-2 bg-gradient-to-b from-background/95 via-background/80 to-transparent p-3 pb-6">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Pill active={cat === "all"} onClick={() => setCat("all")}>All</Pill>
          {CATEGORIES.map((c) => (
            <Pill key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.emoji} {c.label}
            </Pill>
          ))}
        </div>
        <div className="flex gap-2">
          {(["all", "$", "$$", "$$$"] as const).map((p) => (
            <Pill key={p} active={price === p} onClick={() => setPrice(p)}>
              {p === "all" ? "Any price" : p}
            </Pill>
          ))}
        </div>
      </div>

      <div className="h-full w-full">
        <LazyMapView spots={spots} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 px-3">
        <div className="pointer-events-auto -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {spots.map((s) => {
            const c = categoryOf(s.category);
            return (
              <Link
                key={s.id}
                to="/spot/$id"
                params={{ id: s.id }}
                className="flex w-64 shrink-0 gap-2 rounded-xl bg-card p-2 shadow-lg ring-1 ring-border"
              >
                <img src={s.photo} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{s.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {c.emoji} {s.neighborhood} · {s.price_range}
                  </div>
                  <div className="mt-0.5 flex items-center gap-0.5 text-xs">
                    <Star className="h-3 w-3 fill-[oklch(0.83_0.17_82)] text-[oklch(0.83_0.17_82)]" />
                    <span className="font-semibold">{s.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({s.review_count})</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium shadow-sm transition ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
      }`}
    >
      {children}
    </button>
  );
}