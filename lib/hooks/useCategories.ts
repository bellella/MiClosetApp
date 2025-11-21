import { useQuery } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";

/**
 * Hook to fetch top-level categories
 */
export function useCategories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await shopifySdk.categories.GetCategories();
      return res.menu?.items ?? [];
    },
  });

  return {
    categories: data ?? [],
    isLoading,
    isError,
  };
}

/**
 * Hook to fetch sub-categories for a given category ID
 */
export function useSubCategories(categoryId?: string | null) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["subCategories", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const res = await shopifySdk.categories.GetSubCategories({
        id: categoryId,
      });
      return res?.collection?.metafield?.references?.nodes ?? [];
    },
    enabled: !!categoryId,
  });

  return {
    subCategories: data ?? [],
    isLoading,
    isError,
  };
}
