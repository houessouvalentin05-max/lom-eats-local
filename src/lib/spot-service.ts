import { getSupabaseClient } from "./supabase";
import { type Category, type PriceRange, type Spot, type Review } from "./mock-data";

type SpotRecord = {
  id: string;
  name: string;
  category: Category;
  price_range: PriceRange;
  address_description: string;
  neighborhood: string;
  lat: number;
  lng: number;
  photo: string;
  description: string;
  opening_hours: string;
  rating: number;
  review_count: number;
  trending?: boolean;
  added_by?: string | null;
  owner_id?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

type ReviewRecord = {
  id: string;
  spot_id: string;
  user_name: string;
  avatar?: string | null;
  rating: number;
  text: string;
  visited_tag: boolean;
  date: string;
  user_id?: string | null;
  created_at?: string;
};

export type SpotInput = {
  name: string;
  category: Category;
  priceRange: PriceRange;
  description: string;
  hours: string;
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  photo?: string;
  ownerId?: string;
};

export type SpotCreateResult = {
  ok: boolean;
  data: Spot | null;
  error: Error | null;
};

export type ReviewCreateResult = {
  ok: boolean;
  data: Review | null;
  error: Error | null;
};

export type ReviewInput = {
  spotId: string;
  userName: string;
  rating: number;
  text: string;
  visitedTag: boolean;
  userId?: string;
};

const VALID_CATEGORIES: Category[] = ["street", "maquis", "restaurant", "patisserie", "cafe"];
const VALID_PRICE_RANGES: PriceRange[] = ["$", "$$", "$$$"];

export function validateSpotInput(input: SpotInput): string[] {
  const errors: string[] = [];

  if (!input.name?.trim()) errors.push("A spot name is required.");
  if (input.name && input.name.trim().length > 120)
    errors.push("Name must be 120 characters or less.");

  if (!VALID_CATEGORIES.includes(input.category)) errors.push("Category is invalid.");
  if (!VALID_PRICE_RANGES.includes(input.priceRange)) errors.push("Price range is invalid.");

  if (!input.description?.trim()) errors.push("Description is required.");
  if (input.description && input.description.trim().length > 2200) {
    errors.push("Description must be 2200 characters or less.");
  }

  if (!input.address?.trim()) errors.push("Address description is required.");
  if (!input.neighborhood?.trim()) errors.push("Neighborhood is required.");

  if (typeof input.lat !== "number" || typeof input.lng !== "number") {
    errors.push("A valid pin location is required.");
  } else {
    if (input.lat < -90 || input.lat > 90) errors.push("Latitude must be between -90 and 90.");
    if (input.lng < -180 || input.lng > 180) errors.push("Longitude must be between -180 and 180.");
  }

  return errors;
}

function mapSpot(record: SpotRecord): Spot {
  return {
    id: record.id,
    name: record.name,
    category: record.category,
    price_range: record.price_range,
    address_description: record.address_description,
    neighborhood: record.neighborhood,
    lat: record.lat,
    lng: record.lng,
    photo: record.photo,
    description: record.description,
    opening_hours: record.opening_hours,
    rating: record.rating ?? 0,
    review_count: record.review_count ?? 0,
    trending: record.trending ?? false,
    added_by: record.added_by ?? record.owner_id ?? "community",
  };
}

function mapReview(record: ReviewRecord): Review {
  return {
    id: record.id,
    spot_id: record.spot_id,
    user_name: record.user_name,
    avatar: record.avatar ?? undefined,
    rating: record.rating,
    text: record.text,
    visited_tag: record.visited_tag,
    date: record.date,
  };
}

export async function listSpots(): Promise<Spot[]> {
  const client = getSupabaseClient();
  if (!client) return []; // Return empty array if Supabase client is not available

  const { data, error } = await client
    .from("spots")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch spots", error);
    return []; // Return empty array on error
  }

  return (data ?? []).map(mapSpot);
}

export async function getSpotById(id: string): Promise<Spot | null> {
  const client = getSupabaseClient();
  if (!client) {
    return null; // Return null if Supabase client is not available
  }

  const { data, error } = await client
    .from("spots")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch spot", error);
    return null; // Return null on error
  }

  return data ? mapSpot(data as SpotRecord) : null;
}

export async function listReviewsForSpot(spotId: string): Promise<Review[]> {
  const client = getSupabaseClient();
  if (!client) {
    return []; // Return empty array if Supabase client is not available
  }

  const { data, error } = await client
    .from("reviews")
    .select("*")
    .eq("spot_id", spotId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch reviews", error);
    return []; // Return empty array on error
  }

  return (data ?? []).map(mapReview);
}

export async function listAllReviews(): Promise<Review[]> {
  const client = getSupabaseClient();
  if (!client) {
    return []; // Return empty array if Supabase client is not available
  }

  const { data, error } = await client
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch all reviews", error);
    return []; // Return empty array on error
  }

  return (data ?? []).map(mapReview);
}

export async function getSpotWithReviews(spotId: string) {
  const [spot, reviews] = await Promise.all([getSpotById(spotId), listReviewsForSpot(spotId)]);
  return { spot, reviews };
}

export async function createSpot(input: SpotInput): Promise<SpotCreateResult> {
  const errors = validateSpotInput(input);
  if (errors.length > 0) {
    return {
      ok: false,
      data: null,
      error: new Error(errors[0]),
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      data: null,
      error: new Error("Supabase is not configured in this environment."),
    };
  }

  const normalizedPhoto = input.photo?.trim() || "/mock/spot-placeholder.jpg";

  const payload = {
    name: input.name.trim(),
    category: input.category,
    price_range: input.priceRange,
    address_description: input.address.trim(),
    neighborhood: input.neighborhood.trim(),
    lat: input.lat,
    lng: input.lng,
    photo: normalizedPhoto,
    description: input.description.trim(),
    opening_hours: input.hours.trim(),
    rating: 0,
    review_count: 0,
    trending: false,
    status: "published",
    added_by: input.ownerId ? "member" : "community",
    owner_id: input.ownerId ?? null,
  };

  const { data, error } = await client.from("spots").insert(payload).select().single();

  if (error) {
    console.error("Failed to create spot", error);
    return {
      ok: false,
      data: null,
      error: new Error(error.message || "The spot could not be published."),
    };
  }

  return {
    ok: true,
    data: mapSpot(data as SpotRecord),
    error: null,
  };
}

export async function createReview(input: ReviewInput): Promise<ReviewCreateResult> {
  if (!input.text.trim()) {
    return {
      ok: false,
      data: null,
      error: new Error("A review message is required."),
    };
  }

  if (input.rating < 1 || input.rating > 5) {
    return {
      ok: false,
      data: null,
      error: new Error("Rating must be between 1 and 5."),
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      data: null,
      error: new Error("Supabase is not configured in this environment."),
    };
  }

  const payload = {
    spot_id: input.spotId,
    user_name: input.userName.trim() || "You",
    rating: input.rating,
    text: input.text.trim(),
    visited_tag: input.visitedTag,
    user_id: input.userId ?? null,
    date: new Date().toISOString(),
  };

  const { data, error } = await client.from("reviews").insert(payload).select().single();

  if (error) {
    console.error("Failed to create review", error);
    return {
      ok: false,
      data: null,
      error: new Error(error.message || "The review could not be posted."),
    };
  }

  return {
    ok: true,
    data: mapReview(data as ReviewRecord),
    error: null,
  };
}
