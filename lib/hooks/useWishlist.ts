import { useState } from "react";
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  wishlistAdd,
  wishlistRemove,
  wishlistGetMyWishList,
} from "@/lib/api/generated/wishlist/wishlist";
import { useToastMessage } from "@/lib/hooks/useToastMessage";

export type WishListMap = Record<string, boolean>;

type WishListData = {
  ids: string[];
  idsMap: WishListMap;
};

const QUERY_KEY = "wishlistIds";

export function useWishlistIds() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY],
    queryFn: async ({ pageParam }) => {
      const response = await wishlistGetMyWishList({
        cursor: pageParam,
      });

      return {
        items: response.items,
        nextCursor: response.nextCursor,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as number | undefined,
    select: (data) => {
      // Flatten all pages and create ids/idsMap
      const allItems = data.pages.flatMap((page) => page.items);
      return {
        ids: allItems.map((i) => i.productId),
        idsMap: allItems.reduce((acc, item) => {
          acc[item.productId] = true;
          return acc;
        }, {} as WishListMap),
        hasNextPage: data.pages[data.pages.length - 1]?.nextCursor != null,
      };
    },
  });
}

export function useWishlist(
  productId: string,
  initialIsLiked: boolean = false
) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastMessage();
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  // Add to wishlist with optimistic update
  const addToWishlist = useMutation({
    mutationFn: async () => {
      await wishlistAdd({ productId });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });
      const previousData = queryClient.getQueryData([QUERY_KEY]);

      // Update the first page with the new item
      queryClient.setQueryData([QUERY_KEY], (old: any) => {
        if (!old?.pages) {
          return {
            pages: [{ items: [{ productId }], nextCursor: null }],
            pageParams: [undefined],
          };
        }

        return {
          ...old,
          pages: old.pages.map((page: any, index: number) =>
            index === 0
              ? { ...page, items: [{ productId }, ...page.items] }
              : page
          ),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      showSuccess("Added to wishlist");
    },
    onError: (error, _variables, context) => {
      setIsLiked(false);
      if (context?.previousData) {
        queryClient.setQueryData([QUERY_KEY], context.previousData);
      }
      showError(error, "Failed to add to wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  // Remove from wishlist with optimistic update
  const removeFromWishlist = useMutation({
    mutationFn: async () => {
      await wishlistRemove({ productId });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });
      const previousData = queryClient.getQueryData([QUERY_KEY]);

      // Remove the item from all pages
      queryClient.setQueryData([QUERY_KEY], (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            items: page.items.filter((item: any) => item.productId !== productId),
          })),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      showSuccess("Removed from wishlist");
    },
    onError: (error, _variables, context) => {
      setIsLiked(true);
      if (context?.previousData) {
        queryClient.setQueryData([QUERY_KEY], context.previousData);
      }
      showError(error, "Failed to remove from wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
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
