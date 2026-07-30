import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, MapPin, Star, Bookmark } from "lucide-react";
import { CURRENT_USER, SPOTS, REVIEWS, getSpot } from "@/lib/mock-data";
import { SpotCard } from "@/components/SpotCard";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile · LocalEats" },
      {
        name: "description",
        content: "Your added spots, reviews and saved favourites on LocalEats.",
      },
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
  const myReviews = REVIEWS.filter(
    (r) => u.reviewed_spot_ids.includes(r.spot_id) && r.user_name === "Kofi A.",
  );

  return (
    <div>
      <div
        className="chalk-grain relative px-4 pb-16 pt-6 sm:px-6 lg:px-10 xl:px-14"
        style={{ backgroundColor: "#1E1B16", color: "#EFE6D2" }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="grid h-16 w-16 place-items-center rounded-full font-display text-2xl font-extrabold shadow-md"
              style={{ backgroundColor: "#12807D", color: "#EFE6D2" }}
            >
              {u.avatar}
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold">{u.name}</h1>
              <p className="flex items-center gap-1 font-chalk text-base opacity-90">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} /> {u.city}
              </p>
            </div>
          </div>
          <button
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ backgroundColor: "rgba(239, 230, 210, 0.12)" }}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <p className="mt-3 text-sm opacity-95">{u.bio}</p>
      </div>

      <div className="-mt-10 px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-card p-3 shadow-md ring-1 ring-border">
          <Stat n={addedSpots.length} label="Spots" />
          <Stat n={myReviews.length} label="Reviews" />
          <Stat n={savedSpots.length} label="Saved" />
        </div>
      </div>

      <div className="mt-4 px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="flex items-center justify-around border-b border-border">
          <TabBtn active={tab === "spots"} onClick={() => setTab("spots")}>
            My spots
          </TabBtn>
          <TabBtn active={tab === "reviews"} onClick={() => setTab("reviews")}>
            Reviews
          </TabBtn>
          <TabBtn active={tab === "saved"} onClick={() => setTab("saved")}>
            Saved
          </TabBtn>
        </div>
      </div>

      <div className="mt-4 grid gap-3 px-4 sm:px-6 md:grid-cols-2 lg:px-10 xl:grid-cols-3 xl:px-14">
        {tab === "spots" &&
          (addedSpots.length ? (
            addedSpots.map((s) => <SpotCard key={s.id} spot={s} />)
          ) : (
            <Empty text="You haven't added any spots yet." />
          ))}
        {tab === "saved" &&
          (savedSpots.length ? (
            savedSpots.map((s) => <SpotCard key={s.id} spot={s} />)
          ) : (
            <Empty
              text="Tap the bookmark on any spot to save it."
              icon={<Bookmark className="h-5 w-5" />}
            />
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
                            className="h-3 w-3"
                            strokeWidth={1.5}
                            fill={i < r.rating ? "#E0A63E" : "transparent"}
                            color={i < r.rating ? "#E0A63E" : "rgba(139, 90, 60, 0.5)"}
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

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex-1 py-2 text-sm font-medium transition"
      style={{ color: active ? "#1E1B16" : "#8B5A3C" }}
    >
      {children}
      {active && (
        <svg
          className="chalk-stroke pointer-events-none absolute -bottom-[1px] left-1/2 h-2 w-[70%] -translate-x-1/2"
          viewBox="0 0 100 10"
          fill="none"
          stroke="#1E1B16"
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

function Empty({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      {icon && <div className="mb-2 flex justify-center">{icon}</div>}
      {text}
    </div>
  );
}
