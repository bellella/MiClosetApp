import { useLocalSearchParams } from "expo-router";
import { View } from "@/components/Themed";
import { Text } from "@/components/ui/text";
import { ProductDetailReview } from "@/components/reviews/ProductDetailReview";
import { AppContainer } from "@/components/app/app-container";
import { ProductImageCarousel } from "@/components/products/ProductImageCarousel";
import { useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";
import { shopifySdk } from "@/lib/graphql/client";
import { useQuery } from "@tanstack/react-query";
import { ProductBuyButtonContainer } from "@/components/products/product-buy-button-container";
import { PageLoading } from "@/components/common/PageLoading";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => shopifySdk.products.GetProductById({ id: id as string }),
  });
  const product = data?.product;

  if (isLoading || !product) {
    return (
      <AppContainer showBackButton headerTitle="Product Detail">
        <PageLoading />
      </AppContainer>
    );
  }

  if (isError) {
    return (
      <AppContainer showBackButton headerTitle="Product Detail">
        <View className="items-center justify-center py-20">
          <Text>Error loading product detail.</Text>
        </View>
      </AppContainer>
    );
  }

  return (
    <>
      <AppContainer headerTitle="Product Detail" showBackButton showHeaderCart>
        <ProductImageCarousel imageUrls={product.images.nodes} />
        <View className="w-full max-w-[600px] space-y-6 self-center px-4 py-6">
          <View>
            <Text size="sm" className="text-gray-500">
              {product.vendor}
            </Text>
            <Text size="xl" bold className="mt-1">
              {product.title}
            </Text>
            <Text size="lg" bold className="mt-2">
              {product.priceRange.minVariantPrice.currencyCode}{" "}
              {product.priceRange.minVariantPrice.amount}
            </Text>
          </View>

          <View>
            <Text bold size="sm" className="mb-2">
              Description
            </Text>
            <RenderHtml
              contentWidth={width}
              source={{ html: product.descriptionHtml }}
              baseStyle={{ fontSize: 14, color: "#4B5563", lineHeight: 22 }}
            />
          </View>

          <ProductDetailReview productId={id as string} />
          {/* <ProductListSlider title="Recommended" products={dummyProducts} /> */}
        </View>
      </AppContainer>

      <ProductBuyButtonContainer
        options={product.options}
        variants={product.variants.nodes}
      />
    </>
  );
}
