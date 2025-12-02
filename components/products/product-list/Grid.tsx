import { ProductCardSmall } from "@/components/products/product-card/Small";
import { View } from "@/components/Themed";
import { CollectionProduct, ProductItem } from "@/types";
import { useRouter } from "expo-router";
import { ProductListBase } from "./Base";

type ProductGridProps = {
  products: ProductItem[];
  title?: string;
  onPressMore?: () => void;
};

export function ProductListGrid({
  products,
  title,
  onPressMore,
}: ProductGridProps) {
  const router = useRouter();

  return (
    <ProductListBase title={title} onPressMore={onPressMore}>
      <View className="-mx-1 flex-row flex-wrap">
        {products.map((product) => (
          <ProductCardSmall
            key={product.id}
            product={product}
            onPress={() =>
              router.push(`/products/${encodeURIComponent(product.id)}`)
            }
            className="mb-4 px-1"
          />
        ))}
      </View>
    </ProductListBase>
  );
}
