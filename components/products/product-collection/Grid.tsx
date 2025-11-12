import { ProductCardSmall } from "@/components/products/product-card/Small";
import { View } from "@/components/Themed";
import { CollectionProduct } from "@/types";
import { useRouter } from "expo-router";
import { ProductListBase } from "./Base";

type ProductGridProps = {
  products: CollectionProduct[];
  title?: string;
  onPressMore?: () => void;
};

export function ProductCollectionGrid({
  products,
  title,
  onPressMore,
}: ProductGridProps) {
  const router = useRouter();

  return (
    <ProductListBase title={title} onPressMore={onPressMore}>
      <View className="flex-row flex-wrap -mx-1">
        {products.map((product) => (
          <ProductCardSmall
            key={product.id}
            product={product}
            onPress={() => router.push(`/products/${encodeURIComponent(product.id)}`)}
            className="px-1 mb-4"
          />
        ))}
      </View>
    </ProductListBase>
  );
}
