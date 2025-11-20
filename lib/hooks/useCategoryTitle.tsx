import { useQuery } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";
import { CollectionBasicFragment } from "../graphql/categories/categories.graphql";
import { MenuItem } from "@/types";

export function useCategoryTitle(
  categoryId?: string | null,
  subCategoryId?: string | null
) {
  const { data: topData } = useQuery({
    queryKey: ["categories"],
    enabled: !subCategoryId,
    queryFn: async () => {
      const res = await shopifySdk.categories.GetCategories();
      return res.menu?.items ?? [];
    },
  });

  const { data: subData } = useQuery({
    queryKey: ["subCategories", categoryId],
    enabled: !categoryId && !!subCategoryId,
    queryFn: async () => {
      if (!categoryId) return [];
      const res = await shopifySdk.categories.GetSubCategories({
        id: categoryId,
      });
      return res?.collection?.metafield?.references?.nodes ?? [];
    },
  });

  if (!categoryId && !subCategoryId) return "All";

  if (subCategoryId && subData) {
    const list = subData as CollectionBasicFragment[];
    const found = list.find((c) => c.id === subCategoryId);
    return found?.title;
  }
  if (categoryId && topData) {
    const list = topData as MenuItem[];
    const found = list.find((c) => c.resource?.id === categoryId);
    return found?.title;
  }

  return;
}
