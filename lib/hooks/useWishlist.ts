import { useState, useMemo, useEffect } from "react";
import {
  useMutation,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import {
  wishlistAdd,
  wishlistRemove,
  wishlistGetMyWishList,
} from "@/lib/api/generated/wishlist/wishlist";
import { useToastMessage } from "@/lib/hooks/useToastMessage";
import { shopifySdk } from "@/lib/graphql/client";
import { Product } from "@/lib/graphql/shopify.schema";
import { useAuthStore } from "@/lib/stores/auth.store";

export type WishListMap = Record<string, boolean>;

export const QUERY_KEY_IDS = "wishlist-ids-all";
export const QUERY_KEY_PRODUCTS = "wishlist-products";

/**
 * Prefetch wishlist data for login flow
 * Call this after successful login to preload wishlist data
 */
export async function prefetchWishlistData(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_IDS],
    queryFn: async () => {
      let allIds: string[] = [];
      let cursor: number | undefined = undefined;

      while (true) {
        const { items, nextCursor } = await wishlistGetMyWishList({ cursor });
        allIds.push(...items.map((i) => i.productId));
        if (!nextCursor) break;
        cursor = nextCursor;
      }

      return allIds;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// 1. 전체 wishlist ID를 한 번에 가져오기 (페이지네이션 없이)
export function useWishlistIdsAll() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: [QUERY_KEY_IDS],
    queryFn: async () => {
      const { items } = await wishlistGetMyWishList();
      return items.map((i) => i.productId);
    },
    staleTime: 5 * 60 * 1000,
    enabled: isLoggedIn,
  });
}

// 2. IdsMap만 필요한 곳에서 사용 (HomeCollections 등)
export function useWishlistIdsMap() {
  const { data: allIds } = useWishlistIdsAll();
  // return useMemo(() => {
  //   if (!allIds) return {};
  //   return allIds.reduce((acc, id) => {
  //     acc[id] = true;
  //     return acc;
  //   }, {} as WishListMap);
  // }, [allIds]);
  if (!allIds) return {};
  return allIds.reduce((acc, id) => {
    acc[id] = true;
    return acc;
  }, {} as WishListMap);
}

// 3. Wishlist 화면에서 사용 - Product 페이지네이션
export function useWishlistProducts() {
  const queryClient = useQueryClient();
  const { data: allIds } = useWishlistIdsAll();

  return useInfiniteQuery({
    queryKey: [QUERY_KEY_PRODUCTS],
    queryFn: async ({ pageParam = 0 }) => {
      // 최신 ID 배열 가져오기
      const currentIds =
        queryClient.getQueryData<string[]>([QUERY_KEY_IDS]) ?? [];

      const start = pageParam;
      const end = start + 20;
      const pageIds = currentIds.slice(start, end);

      if (pageIds.length === 0) {
        return { products: [], nextCursor: undefined };
      }

      const { nodes } = await shopifySdk.products.getProductsByIds({
        ids: pageIds,
      });

      return {
        products: nodes as Product[],
        nextCursor: end < currentIds.length ? end : undefined,
      };
    },
    enabled: !!allIds && allIds.length > 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });
}

export function useWishlist(
  productId: string,
  initialIsLiked: boolean = false
) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastMessage();
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);
  
  // Add to wishlist with optimistic update
  const addToWishlist = useMutation({
    mutationFn: async () => {
      await wishlistAdd({ productId });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY_IDS] });
      const previousIds = queryClient.getQueryData<string[]>([QUERY_KEY_IDS]);

      // Optimistic update: add new ID to the beginning
      queryClient.setQueryData<string[]>([QUERY_KEY_IDS], (old) => [
        productId,
        ...(old ?? []),
      ]);

      return { previousIds };
    },
    onSuccess: () => {
      showSuccess("Added to wishlist");
      // 전체 products query 무효화 (페이지 다시 로드)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_PRODUCTS] });
    },
    onError: (error, _variables, context) => {
      setIsLiked(false);
      if (context?.previousIds) {
        queryClient.setQueryData([QUERY_KEY_IDS], context.previousIds);
      }
      showError(error, "Failed to add to wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_IDS] });
    },
  });

  // Remove from wishlist with optimistic update
  const removeFromWishlist = useMutation({
    mutationFn: async () => {
      await wishlistRemove({ productId });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY_IDS] });
      const previousIds = queryClient.getQueryData<string[]>([QUERY_KEY_IDS]);

      // Optimistic update: remove ID
      queryClient.setQueryData<string[]>([QUERY_KEY_IDS], (old) =>
        (old ?? []).filter((id) => id !== productId)
      );

      return { previousIds };
    },
    onSuccess: () => {
      showSuccess("Removed from wishlist");
      // 전체 products query 무효화 (페이지 다시 로드)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_PRODUCTS] });
    },
    onError: (error, _variables, context) => {
      setIsLiked(true);
      if (context?.previousIds) {
        queryClient.setQueryData([QUERY_KEY_IDS], context.previousIds);
      }
      showError(error, "Failed to remove from wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_IDS] });
    },
  });

  const toggleWishlist = () => {
    setIsLiked(!isLiked);

    if (isLiked) {
      removeFromWishlist.mutate();
    } else {
      addToWishlist.mutate();
    }
  };

  return {
    isLiked,
    toggleWishlist,
    isLoading: addToWishlist.isPending || removeFromWishlist.isPending,
  };
}
