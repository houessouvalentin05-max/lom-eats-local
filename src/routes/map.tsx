import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SPOTS, CATEGORIES, type Category, type PriceRange, categoryOf } from "@/lib/mock-data";
import { LazyMapView } from "@/components/LazyMap";
import { Star } from "lucide-react";
import { ChalkTag } from "@/components/ChalkTag";
import { CategoryIcon } from "@/components/CategoryIcon";

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
      SPOTS.filter(
        (s) =>
          (cat === "all" || s.category === cat) && (price === "all" || s.price_range === price),
      ),
    [cat, price],
  );

  return (
    <div className="relative h-[calc(100dvh-5rem)] min-h-[34rem] lg:flex lg:h-[calc(100dvh-2rem)] lg:gap-4 lg:px-4">
      {/* DESKTOP (lg+): persistent sidebar — filters + vertical list, replaces the floating overlays */}
      <aside
        className="chalk-grain hidden lg:flex lg:w-[380px] lg:shrink-0 lg:flex-col lg:gap-3 lg:overflow-y-auto lg:rounded-2xl lg:border lg:p-4"
        style={{
          backgroundColor: "rgba(30, 27, 22, 0.72)",
          borderColor: "rgba(239, 230, 210, 0.12)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex flex-wrap gap-1.5">
          <GlassPill active={cat === "all"} onClick={() => setCat("all")} standalone>
            All
          </GlassPill>
          {CATEGORIES.map((c) => (
            <GlassPill key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} standalone>
              <CategoryIcon id={c.id} className="h-3.5 w-3.5" />
              {c.label}
            </GlassPill>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(["all", "$", "$$", "$$$"] as const).map((p) => (
            <GlassPill key={p} active={price === p} onClick={() => setPrice(p)} standalone>
              {p === "all" ? "Any price" : p}
            </GlassPill>
          ))}
        </div>

        <div className="mt-2 flex flex-col gap-2">
          {spots.map((s) => {
            const c = categoryOf(s.category);
            return (
              <Link
                key={s.id}
                to="/spot/$id"
                params={{ id: s.id }}
                className="flex gap-2 rounded-xl bg-card p-2 shadow-lg ring-1 ring-border"
              >
                <img
                  src={s.photo}
                  alt=""
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-display text-sm font-semibold">{s.name}</div>
                  <div className="mt-0.5 flex items-center gap-1">
                    <ChalkTag className="!text-[11px] !px-1.5 !py-1">
                      <CategoryIcon id={s.category} className="h-3 w-3" />
                      {c.label}
                    </ChalkTag>
                    <ChalkTag className="!text-[11px] !px-1.5 !py-1">{s.price_range}</ChalkTag>
                  </div>
                  <div className="mt-1 flex items-center gap-0.5 text-xs">
                    <Star className="h-3 w-3" strokeWidth={1.5} fill="#E0A63E" color="#E0A63E" />
                    <span className="font-semibold">{s.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">· {s.neighborhood}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Map fills remaining space. Below lg: original floating overlays, unchanged. */}
      <div className="relative h-full flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 space-y-2 p-3 lg:hidden">
          <div
            className="chalk-grain pointer-events-auto flex items-center gap-1 overflow-x-auto rounded-full border px-1.5 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              backgroundColor: "rgba(30, 27, 22, 0.72)",
              borderColor: "rgba(239, 230, 210, 0.12)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 10px 30px -12px rgba(0,0,0,0.45)",
            }}
          >
            <GlassPill active={cat === "all"} onClick={() => setCat("all")}>
              All
            </GlassPill>
            {CATEGORIES.map((c) => (
              <GlassPill key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                <CategoryIcon id={c.id} className="h-3.5 w-3.5" />
                {c.label}
              </GlassPill>
            ))}
          </div>
          <div className="pointer-events-auto flex gap-1.5">
            {(["all", "$", "$$", "$$$"] as const).map((p) => (
              <GlassPill key={p} active={price === p} onClick={() => setPrice(p)} standalone>
                {p === "all" ? "Any price" : p}
              </GlassPill>
            ))}
          </div>
        </div>

        <div className="h-full w-full">
          <LazyMapView spots={spots} />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20 px-3 lg:hidden">
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
                  <img
                    src={s.photo}
                    alt=""
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-sm font-semibold">{s.name}</div>
                    <div className="mt-0.5 flex items-center gap-1">
                      <ChalkTag className="!text-[11px] !px-1.5 !py-1">
                        <CategoryIcon id={s.category} className="h-3 w-3" />
                        {c.label}
                      </ChalkTag>
                      <ChalkTag className="!text-[11px] !px-1.5 !py-1">{s.price_range}</ChalkTag>
                    </div>
                    <div className="mt-1 flex items-center gap-0.5 text-xs">
                      <Star className="h-3 w-3" strokeWidth={1.5} fill="#E0A63E" color="#E0A63E" />
                      <span className="font-semibold">{s.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">· {s.neighborhood}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassPill({
  active,
  onClick,
  children,
  standalone,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  standalone?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition"
      style={
        standalone
          ? {
              color: "#EFE6D2",
              backgroundColor: "rgba(30, 27, 22, 0.72)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(239, 230, 210, 0.12)",
              opacity: active ? 1 : 0.75,
            }
          : { color: "#EFE6D2", opacity: active ? 1 : 0.72 }
      }
    >
      {children}
      {active && (
        <svg
          className="chalk-stroke pointer-events-none absolute -bottom-1 left-1/2 h-2 w-[80%] -translate-x-1/2"
          viewBox="0 0 100 10"
          fill="none"
          stroke="#EFE6D2"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M4 6 C 20 2, 45 9, 60 4 C 78 0, 88 7, 96 4" />
        </svg>
      )}
    </button>
  );
}