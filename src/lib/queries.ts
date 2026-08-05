import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createReview as createReviewInDb,
  createSpot as createSpotInDb,
  getSpotById,
  listAllReviews,
  listBookmarkSpots,
  listReviewsByUser,
  listReviewsForSpot,
  listSpots,
  listSpotsByOwner,
  type ReviewInput,
  type SpotInput,
} from "./spot-service";
import { type Review, type Spot } from "./mock-data";
import { getCurrentUser } from "./supabase-auth";

/**
 * React Query data layer, backed by the Supabase service layer.
 *
 * Every hook delegates to `spot-service` for real persistence. Identity for the
 * mutations is resolved from the active Supabase session here (rather than via
 * the component call sites), so `owner_id` / `user_id` are attached server-verified
 * and the UI never guesses who the user is. Query keys and component usage remain
 * stable; the services degrade gracefully ([]) when Supabase is not configured.
 */

export const queryKeys = {
  spots: ["spots"] as const,
  spot: (id: string) => ["spots", id] as const,
  reviews: ["reviews"] as const,
  reviewsForSpot: (spotId: string) => ["reviews", spotId] as const,
  profile: ["profile"] as const,
};

/* ------------------------------- Reads -------------------------------- */

export function useSpots() {
  return useQuery<Spot[]>({
    queryKey: queryKeys.spots,
    queryFn: listSpots,
    staleTime: 60_000,
  });
}

export function useSpot(id: string) {
  return useQuery<Spot | null>({
    queryKey: queryKeys.spot(id),
    queryFn: () => getSpotById(id),
    enabled: Boolean(id),
  });
}

export function useReviewsForSpot(spotId: string) {
  return useQuery<Review[]>({
    queryKey: queryKeys.reviewsForSpot(spotId),
    queryFn: () => listReviewsForSpot(spotId),
    enabled: Boolean(spotId),
    staleTime: 30_000,
  });
}

export function useAllReviews() {
  return useQuery<Review[]>({
    queryKey: queryKeys.reviews,
    queryFn: listAllReviews,
    staleTime: 60_000,
  });
}

export function useSpotsByOwner(userId: string) {
  return useQuery<Spot[]>({
    queryKey: ["spots", "owner", userId] as const,
    queryFn: () => listSpotsByOwner(userId),
    enabled: Boolean(userId),
  });
}

export function useReviewsByUser(userId: string) {
  return useQuery<Review[]>({
    queryKey: ["reviews", "user", userId] as const,
    queryFn: () => listReviewsByUser(userId),
    enabled: Boolean(userId),
  });
}

export function useBookmarkSpots(userId: string) {
  return useQuery<Spot[]>({
    queryKey: ["bookmarks", userId] as const,
    queryFn: () => listBookmarkSpots(userId),
    enabled: Boolean(userId),
  });
}

/* ------------------------------ Mutations ----------------------------- */

export type CreateSpotInput = SpotInput;
export type CreateReviewInput = ReviewInput;

async function currentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

export function useCreateSpot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateSpotInput): Promise<Spot> => {
      const ownerId = await currentUserId();
      const result = await createSpotInDb({
        ...input,
        ownerId: ownerId ?? undefined,
      });
      if (!result.ok || !result.data) {
        throw result.error ?? new Error("Impossible de publier le spot.");
      }
      return result.data;
    },
    onSuccess: (spot) => {
      toast.success(`« ${spot.name} » vient d'être publié ! 🎉`);
      void queryClient.invalidateQueries({ queryKey: queryKeys.spots });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Impossible de publier le spot.");
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateReviewInput): Promise<Review> => {
      const userId = await currentUserId();
      const result = await createReviewInDb({
        ...input,
        userId: userId ?? undefined,
      });
      if (!result.ok || !result.data) {
        throw result.error ?? new Error("Impossible de poster l'avis.");
      }
      return result.data;
    },
    onSuccess: (_review, input) => {
      toast.success("Merci pour votre avis ! 🙌");
      void queryClient.invalidateQueries({ queryKey: queryKeys.reviewsForSpot(input.spotId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.spots });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Impossible de poster l'avis.");
    },
  });
}
