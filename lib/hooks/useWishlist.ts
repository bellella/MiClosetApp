import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useWishlistIds() {
  return useQuery<WishListData>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { items } = await wishlistGetMyWishList();
      return {
        ids: items.map((i) => i.productId),
        idsMap: items.reduce((acc, item) => {
          acc[item.productId] = true;
          return acc;
        }, {} as WishListMap),
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
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previousWishlist = queryClient.getQueryData<WishListData>([
        "wishlist",
      ]);

      queryClient.setQueryData<WishListData>(["wishlist"], (old) => {
        if (!old) return { ids: [productId], idsMap: { [productId]: true } };
        return {
          ids: [...old.ids, productId],
          idsMap: { ...old.idsMap, [productId]: true },
        };
      });

      return { previousWishlist };
    },
    onSuccess: () => {
      showSuccess("Added to wishlist");
    },
    onError: (error, _variables, context) => {
      setIsLiked(false);
      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
      showError(error, "Failed to add to wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  // Remove from wishlist with optimistic update
  const removeFromWishlist = useMutation({
    mutationFn: async () => {
      await wishlistRemove({ productId });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previousWishlist = queryClient.getQueryData<WishListData>([
        "wishlist",
      ]);

      queryClient.setQueryData<WishListData>(["wishlist"], (old) => {
        if (!old) return { ids: [], idsMap: {} };
        const newIds = old.ids.filter((id) => id !== productId);
        const newIdsMap = { ...old.idsMap };
        delete newIdsMap[productId];
        return {
          ids: newIds,
          idsMap: newIdsMap,
        };
      });

      return { previousWishlist };
    },
    onSuccess: () => {
      showSuccess("Removed from wishlist");
    },
    onError: (error, _variables, context) => {
      setIsLiked(true);
      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
      showError(error, "Failed to remove from wishlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
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
