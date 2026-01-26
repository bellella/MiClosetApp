import { AppContainer } from "@/components/app/app-container";
import { CategoryHeader } from "@/components/categories/CategoryHeader";
import { ProductListGrid } from "@/components/products/product-list/Grid";
import { shopifySdk } from "@/lib/graphql/client";
import { useCategoryTitle } from "@/lib/hooks/useCategoryTitle";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import { useProductConverter } from "@/lib/hooks/useProductConverter";

export default function Categories() {
  const {shopifyToProductCards} = useProductConverter();
  const { categoryId, subCategoryId } = useLocalSearchParams<{
    categoryId?: string;
    subCategoryId?: string;
  }>();

  const collectionId = subCategoryId || categoryId;

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["collectionProducts", collectionId],
    enabled: Boolean(collectionId),
    queryFn: async () => {
      if (!collectionId) return [];

      const res = await shopifySdk.products.GetCollectionProductsById({
        id: collectionId,
        first: 20,
      });

      return res?.collection?.products?.nodes ?? [];
    },
  });

  const title = useCategoryTitle(categoryId, subCategoryId);

  return (
    <AppContainer headerTitle={title} disableScroll showBackButton showHeaderCart>
      <CategoryHeader />
      {isLoading && (
        <View style={{ paddingTop: 40, alignItems: "center" }}>
          <Spinner size="large" color="#000" />
        </View>
      )}

      {isError && (
        <View className="mt-10 items-center">
          <Text>Error loading products.</Text>
        </View>
      )}

      {!isLoading && !isError && (
        <ProductListGrid
          products={shopifyToProductCards(products)}
        />
      )}
    </AppContainer>
  );
}
