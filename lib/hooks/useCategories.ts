import { useQuery } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";
import { Menu, MenuItem, SubMenuItem } from "@/types";

/**
 * Hook to fetch top-level categories
 */
export function useCategories() {
  const { data = [], isLoading, isError } = useQuery<MenuItem[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await shopifySdk.categories.GetCategories();
      const items = res.menu?.items ?? [];
      
      return items as MenuItem[];
    },
  });

  return {
    categories: data,
    isLoading,
    isError,
  };
}

/**
 * Hook to fetch sub-categories for a given category ID
 */
export function useSubCategories(categoryId?: string | null) {
  const { data = [], isLoading, isError } = useQuery<SubMenuItem[], Error>({
    queryKey: ["subCategories", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const res = await shopifySdk.categories.GetSubCategories({
        id: categoryId,
      });
      const items = res?.collection?.metafield?.references?.nodes ?? [];
      return items as unknown as SubMenuItem[];
    },
    enabled: !!categoryId,
  });

  return {
    subCategories: data,
    isLoading,
    isError,
  };
}
