import { Flame, Beer, Utensils, Croissant, Coffee, type LucideIcon } from "lucide-react";
import type { Category } from "@/lib/mock-data";

const MAP: Record<Category, LucideIcon> = {
  street: Flame,
  maquis: Beer,
  restaurant: Utensils,
  patisserie: Croissant,
  cafe: Coffee,
};

export function CategoryIcon({
  id,
  className = "h-4 w-4",
  strokeWidth = 1.5,
}: {
  id: Category;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = MAP[id];
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
