import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bookmark, Clock, MapPin, Share2, Star, CheckCircle2, Camera } from "lucide-react";
import { getSpot, reviewsForSpot, categoryOf, type Review } from "@/lib/mock-data";

export const Route = createFileRoute("/spot/$id")({
  head: ({ params }) => {
    const s = getSpot(params.id);
    return {
      meta: s
        ? [
            { title: `${s.name} · LocalEats` },
            { name: "description", content: s.description },
            { property: "og:title", content: `${s.name} — ${categoryOf(s.category).label} in Lomé` },
            { property: "og:description", content: s.description },
          ]
        : [{ title: "Spot not found" }, { name: "robots", content: "noindex" }],
    };
  },
  loader: ({ params }) => {
    const s = getSpot(params.id);
    if (!s) throw notFound();
    return { spot: s, reviews: reviewsForSpot(params.id) };
  },
  component: SpotPage,
  notFoundComponent: () => (
    <div className="p-8 text-center text-muted-foreground">Spot not found.</div>
  ),
});

function SpotPage() {
  const { spot, reviews: initialReviews } = Route.useLoaderData();
  const cat = categoryOf(spot.category);
  const [saved, setSaved] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showReview, setShowReview] = useState(false);

  return (
    <div>
      <div className="relative">
        <img src={spot.photo} alt={spot.name} width={800} height={500} className="aspect-[4/3] w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Link
            to="/"
            className="grid h-10 w-10 place-items-center rounded-full bg-background/90 text-foreground shadow"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setSaved((s) => !s)}
              className="grid h-10 w-10 place-items-center rounded-full bg-background/90 text-foreground shadow"
              aria-label="Save"
            >
              <Bookmark className={`h-5 w-5 ${saved ? "fill-primary text-primary" : ""}`} />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-background/90 text-foreground shadow" aria-label="Share">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {cat.emoji} {cat.label}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">{spot.price_range}</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-extrabold leading-tight">{spot.name}</h1>
          <div className="mt-1 flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-[oklch(0.83_0.17_82)] text-[oklch(0.83_0.17_82)]" />
            <span className="font-semibold">{spot.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">· {spot.review_count} reviews</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-foreground">{spot.description}</p>

        <div className="space-y-2 rounded-2xl bg-card p-3 ring-1 ring-border">
          <InfoRow icon={<MapPin className="h-4 w-4 text-primary" />} label="Where to find it">
            <div className="font-medium">{spot.neighborhood}</div>
            <div className="text-muted-foreground">{spot.address_description}</div>
          </InfoRow>
          <div className="h-px bg-border" />
          <InfoRow icon={<Clock className="h-4 w-4 text-primary" />} label="Hours">
            <div className="text-muted-foreground">{spot.opening_hours}</div>
          </InfoRow>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Reviews</h2>
          <button
            onClick={() => setShowReview((v) => !v)}
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm"
          >
            {showReview ? "Cancel" : "+ Add review"}
          </button>
        </div>

        {showReview && (
          <ReviewForm
            onSubmit={(r) => {
              setReviews((prev) => [{ ...r, id: `n-${Date.now()}`, spot_id: spot.id, date: "just now" }, ...prev]);
              setShowReview(false);
            }}
          />
        )}

        <div className="space-y-3">
          {reviews.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Be the first to leave a review.
            </p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl bg-card p-3 ring-1 ring-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-[oklch(0.92_0.06_90)] font-display font-bold text-clay">
                    {r.user_name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold leading-tight">{r.user_name}</div>
                    <div className="text-xs text-muted-foreground">{r.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < r.rating ? "fill-[oklch(0.83_0.17_82)] text-[oklch(0.83_0.17_82)]" : "text-muted-foreground/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-foreground">{r.text}</p>
              {r.visited_tag && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[oklch(0.94_0.07_150)] px-2 py-0.5 text-[11px] font-medium text-[oklch(0.4_0.13_150)]">
                  <CheckCircle2 className="h-3 w-3" /> I've been here
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 text-sm">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

function ReviewForm({ onSubmit }: { onSubmit: (r: Omit<Review, "id" | "spot_id" | "date">) => void }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [visited, setVisited] = useState(true);
  const [photos, setPhotos] = useState(0);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit({ user_name: "You", rating, text, visited_tag: visited });
      }}
      className="space-y-3 rounded-2xl bg-card p-3 ring-1 ring-border"
    >
      <div>
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Your rating</div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)}>
              <Star
                className={`h-7 w-7 ${
                  n <= rating ? "fill-[oklch(0.83_0.17_82)] text-[oklch(0.83_0.17_82)]" : "text-muted-foreground/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What did you eat? How was it?"
        rows={3}
        className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPhotos((p) => p + 1)}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium"
        >
          <Camera className="h-4 w-4" /> Add photo{photos > 0 ? ` (${photos})` : ""}
        </button>
        <label className="inline-flex items-center gap-2 text-xs">
          <input type="checkbox" checked={visited} onChange={(e) => setVisited(e.target.checked)} />
          I've actually been here
        </label>
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm active:scale-[0.99]"
      >
        Post review
      </button>
    </form>
  );
}