import { Link } from "@tanstack/react-router";
import { Star, MapPin } from "lucide-react";
import { categoryOf, type Spot } from "@/lib/mock-data";
import { ChalkTag } from "./ChalkTag";
import { CategoryIcon } from "./CategoryIcon";

export function SpotCard({ spot }: { spot: Spot }) {
  const cat = categoryOf(spot.category);
  return (
    <Link
      to="/spot/$id"
      params={{ id: spot.id }}
      className="group block overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition active:scale-[0.99]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={spot.photo}
          alt={spot.name}
          loading="lazy"
          width={800}
          height={500}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-2 top-2 flex gap-1">
          <ChalkTag>
            <CategoryIcon id={spot.category} className="h-3.5 w-3.5" />
            {cat.label}
          </ChalkTag>
          {spot.trending && <ChalkTag>Trending</ChalkTag>}
        </div>
        <div className="absolute right-2 top-2">
          <ChalkTag>{spot.price_range}</ChalkTag>
        </div>
      </div>
      <div className="space-y-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate font-display text-lg font-semibold leading-tight">
            {spot.name}
          </h3>
          <div className="flex shrink-0 items-center gap-0.5 text-sm">
            <Star className="h-4 w-4" strokeWidth={1.5} fill="#E0A63E" color="#E0A63E" />
            <span className="font-semibold">{spot.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({spot.review_count})</span>
          </div>
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" strokeWidth={1.5} /> {spot.neighborhood} ·{" "}
          {spot.address_description}
        </p>
      </div>
    </Link>
  );
}
