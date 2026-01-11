import React from "react";
import { useRouter } from "expo-router";
import { ProductCardSmall } from "../product-card/Small";
import { ProductListBase } from "./Base";
import { CustomFlatList } from "@/components/common/CustomFaltList";
import { ProductItem } from "@/types";

type ProductSliderProps = {
  products: ProductItem[];
  title?: string;
  onPressMore?: () => void;
};

export function ProductListSlider({
  products,
  title,
  onPressMore,
}: ProductSliderProps) {
  const router = useRouter();

  const renderItem = ({ item }: { item: ProductItem }) => (
    <ProductCardSmall
      product={item}
      width={160}
      onPress={() => router.push(`/products/${encodeURIComponent(item.id)}`)}
    />
  );

  return (
    <ProductListBase title={title} onPressMore={onPressMore}>
      <CustomFlatList
        data={products}
        horizontal
        keyExtractor={(item: ProductItem) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}
      />
    </ProductListBase>
  );
}
