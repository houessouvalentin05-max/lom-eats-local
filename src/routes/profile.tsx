import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Settings, MapPin, Star, Bookmark, LogOut, UserRound } from "lucide-react";
import { SpotCard } from "@/components/SpotCard";
import { useReveal } from "@/hooks/use-reveal";
import { getCurrentUser, signOut } from "@/lib/supabase-auth";
import { getProfileForUser, type UserProfile } from "@/lib/profile-service";
import { useBookmarkSpots, useReviewsByUser, useSpots, useSpotsByOwner } from "@/lib/queries";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const revealRef = useReveal();
  const navigate = useNavigate();

  const { data: allSpots = [] } = useSpots();
  const { data: addedSpots = [], isPending: addedPending } = useSpotsByOwner(userId ?? "");
  const { data: myReviews = [] } = useReviewsByUser(userId ?? "");
  const { data: savedSpots = [] } = useBookmarkSpots(userId ?? "");

  useEffect(() => {
    void (async () => {
      const user = await getCurrentUser();
      if (user?.id) {
        setUserId(user.id);
        setEmail(user.email ?? null);
        const nextProfile = await getProfileForUser(user.id);
        setProfile(nextProfile);
      }
      setAuthReady(true);
    })();
  }, []);

  async function handleSignOut() {
    await signOut();
    setUserId(null);
    setProfile(null);
    navigate({ to: "/auth" });
  }

  const displayName = profile?.full_name || profile?.username || email?.split("@")[0] || "Foodie";
  const displayCity = profile?.city || "Lomé";
  const avatarChar = displayName.trim().charAt(0).toUpperCase() || "F";

  if (!authReady) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">
        <p className="rounded-full bg-card px-4 py-2 ring-1 ring-border">Loading profile…</p>
      </div>
    );
  }

  return (
    <div ref={revealRef}>
      <div
        className="chalk-grain relative overflow-hidden px-4 pb-16 pt-6 sm:px-6 lg:px-10 xl:px-14"
        style={{
          background:
            "radial-gradient(circle at 12% 18%, rgba(18, 128, 125, 0.45), transparent 42%), radial-gradient(circle at 88% 12%, rgba(198, 67, 42, 0.4), transparent 40%), linear-gradient(135deg, #0f5f5d 0%, #12807d 30%, #1a6b68 55%, #a83a24 85%, #c6432a 100%)",
          color: "#EFE6D2",
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="grid h-16 w-16 place-items-center overflow-hidden rounded-full font-display text-2xl font-extrabold shadow-md"
              style={{ backgroundColor: "#12807D", color: "#EFE6D2" }}
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                avatarChar
              )}
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold">{displayName}</h1>
              <p className="flex items-center gap-1 font-chalk text-base opacity-90">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} /> {displayCity}
              </p>
              {userId && (
                <p className="mt-1 text-xs text-[#f7ebd2]/80">
                  Signed in as {email ?? displayName}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="grid h-9 w-9 place-items-center rounded-full"
              style={{ backgroundColor: "rgba(239, 230, 210, 0.12)" }}
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" strokeWidth={1.5} />
            </button>
            {userId && (
              <button
                onClick={handleSignOut}
                className="grid h-9 w-9 place-items-center rounded-full"
                style={{ backgroundColor: "rgba(239, 230, 210, 0.12)" }}
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
        {profile?.bio && <p className="mt-3 text-sm opacity-95">{profile.bio}</p>}
      </div>

      {!userId ? (
        <div className="mt-4 px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <UserRound className="h-6 w-6" />
            </div>
            <h2 className="font-display text-lg font-bold">Sign in to see your activity</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Your added spots, reviews and saved favourites will show up here once you're signed
              in.
            </p>
            <Link
              to="/auth"
              className="mt-4 inline-block rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md"
              style={{ backgroundColor: "#C6432A", color: "#EFE6D2" }}
            >
              Sign in
            </Link>
          </div>
        </div>
      ) : (
        <>
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
            {addedPending ? (
              <p className="text-sm text-muted-foreground">Loading your profile…</p>
            ) : (
              <>
                {tab === "spots" &&
                  (addedSpots.length ? (
                    addedSpots.map((s, i) => (
                      <div
                        key={s.id}
                        className={`reveal ${i % 3 === 0 ? "reveal-delay-1" : i % 3 === 1 ? "reveal-delay-2" : "reveal-delay-3"}`}
                      >
                        <SpotCard spot={s} />
                      </div>
                    ))
                  ) : (
                    <Empty text="You haven't added any spots yet." />
                  ))}
                {tab === "saved" &&
                  (savedSpots.length ? (
                    savedSpots.map((s, i) => (
                      <div
                        key={s.id}
                        className={`reveal ${i % 3 === 0 ? "reveal-delay-1" : i % 3 === 1 ? "reveal-delay-2" : "reveal-delay-3"}`}
                      >
                        <SpotCard spot={s} />
                      </div>
                    ))
                  ) : (
                    <Empty
                      text="Tap the bookmark on any spot to save it."
                      icon={<Bookmark className="h-5 w-5" />}
                    />
                  ))}
                {tab === "reviews" &&
                  (myReviews.length ? (
                    myReviews.map((r) => {
                      const s = allSpots.find((spot) => spot.id === r.spot_id);
                      if (!s) return null;
                      return (
                        <div key={r.id} className="rounded-2xl bg-card p-3 ring-1 ring-border">
                          <Link
                            to="/spot/$id"
                            params={{ id: s.id }}
                            className="flex items-center gap-2"
                          >
                            <img
                              src={s.photo}
                              alt=""
                              className="h-12 w-12 rounded-lg object-cover"
                            />
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
                          </Link>
                          <p className="mt-2 text-sm">{r.text}</p>
                        </div>
                      );
                    })
                  ) : (
                    <Empty text="Your reviews will appear here." />
                  ))}
              </>
            )}
          </div>
        </>
      )}
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
