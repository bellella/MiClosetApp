import React from "react";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ProductCardSmall } from "../product-card/Small";
import { CollectionProduct } from "@/lib/graphql/types/product.type";
import { ProductListBase } from "./Base";
import { CustomFlatList } from "@/components/common/CustomFaltList";

type ProductSliderProps = {
  products: CollectionProduct[];
  title?: string;
  onPressMore?: () => void;
};

export function ProductListSlider({
  products,
  title,
  onPressMore,
}: ProductSliderProps) {
  const router = useRouter();

  const renderItem = ({ item }: { item: CollectionProduct }) => (
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
        keyExtractor={(item: CollectionProduct) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}
      />
    </ProductListBase>
  );
}
