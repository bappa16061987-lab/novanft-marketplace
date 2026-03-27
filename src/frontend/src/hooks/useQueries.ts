import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Nft, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useAllNfts() {
  const { actor, isFetching } = useActor();
  return useQuery<Nft[]>({
    queryKey: ["nfts", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNfts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUnsoldNfts() {
  const { actor, isFetching } = useActor();
  return useQuery<Nft[]>({
    queryKey: ["nfts", "unsold"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUnsoldNfts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFeaturedNfts() {
  const { actor, isFetching } = useActor();
  return useQuery<Nft[]>({
    queryKey: ["nfts", "featured"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedNfts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlatformStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPlatformStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllUserProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBuyNft() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.buyNft(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["nfts"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useCreateNft() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (nft: Nft) => {
      if (!actor) throw new Error("Not connected");
      return actor.createNft(nft);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["nfts"] }),
  });
}

export function useToggleFeatureNft() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleFeatureNft(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["nfts"] }),
  });
}
