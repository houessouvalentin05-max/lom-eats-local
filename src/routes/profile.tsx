import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, MapPin, Star, Bookmark } from "lucide-react";
import { CURRENT_USER, SPOTS, REVIEWS, getSpot } from "@/lib/mock-data";
import { SpotCard } from "@/components/SpotCard";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile · LocalEats" },
      { name: "description", content: "Your added spots, reviews and saved favourites on LocalEats." },
    ],
  }),
  component: Profile,
});

type Tab = "spots" | "reviews" | "saved";

function Profile() {
  const [tab, setTab] = useState<Tab>("spots");
  const u = CURRENT_USER;
  const addedSpots = SPOTS.filter((s) => u.added_spot_ids.includes(s.id));
  const savedSpots = SPOTS.filter((s) => u.saved_spot_ids.includes(s.id));
  const myReviews = REVIEWS.filter((r) => u.reviewed_spot_ids.includes(r.spot_id) && r.user_name === "Kofi A.");

  return (
    <div>
      <div className="relative bg-gradient-to-br from-clay via-primary to-[oklch(0.75_0.15_65)] px-4 pb-16 pt-6 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-background/90 font-display text-2xl font-extrabold text-primary shadow-md">
              {u.avatar}
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold">{u.name}</h1>
              <p className="flex items-center gap-1 text-xs opacity-90">
                <MapPin className="h-3 w-3" /> {u.city}
              </p>
            </div>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-background/20" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-3 text-sm opacity-95">{u.bio}</p>
      </div>

      <div className="-mt-10 px-4">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-card p-3 shadow-md ring-1 ring-border">
          <Stat n={addedSpots.length} label="Spots" />
          <Stat n={myReviews.length} label="Reviews" />
          <Stat n={savedSpots.length} label="Saved" />
        </div>
      </div>

      <div className="mt-4 px-4">
        <div className="flex gap-1 rounded-full bg-secondary p-1 text-sm">
          <TabBtn active={tab === "spots"} onClick={() => setTab("spots")}>My spots</TabBtn>
          <TabBtn active={tab === "reviews"} onClick={() => setTab("reviews")}>Reviews</TabBtn>
          <TabBtn active={tab === "saved"} onClick={() => setTab("saved")}>Saved</TabBtn>
        </div>
      </div>

      <div className="mt-4 space-y-3 px-4">
        {tab === "spots" &&
          (addedSpots.length ? addedSpots.map((s) => <SpotCard key={s.id} spot={s} />) : <Empty text="You haven't added any spots yet." />)}
        {tab === "saved" &&
          (savedSpots.length ? (
            savedSpots.map((s) => <SpotCard key={s.id} spot={s} />)
          ) : (
            <Empty text="Tap the bookmark on any spot to save it." icon={<Bookmark className="h-5 w-5" />} />
          ))}
        {tab === "reviews" &&
          (myReviews.length ? (
            myReviews.map((r) => {
              const s = getSpot(r.spot_id);
              if (!s) return null;
              return (
                <div key={r.id} className="rounded-2xl bg-card p-3 ring-1 ring-border">
                  <div className="flex items-center gap-2">
                    <img src={s.photo} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{s.name}</div>
                      <div className="flex items-center gap-0.5 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < r.rating ? "fill-[oklch(0.83_0.17_82)] text-[oklch(0.83_0.17_82)]" : "text-muted-foreground/40"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-muted-foreground">{r.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{r.text}</p>
                </div>
              );
            })
          ) : (
            <Empty text="Your reviews will appear here." />
          ))}
      </div>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-2xl font-extrabold text-primary">{n}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-full py-1.5 text-sm font-medium transition ${
        active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Empty({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      {icon && <div className="mb-2 flex justify-center">{icon}</div>}
      {text}
    </div>
  );
}