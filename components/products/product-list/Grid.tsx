import { ProductCardSmall } from "@/components/products/product-card/Small";
import { CollectionProduct, ProductItem } from "@/types";
import { useRouter } from "expo-router";
import { ProductListBase } from "./Base";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControlProps,
} from "react-native";

type ProductGridProps = {
  products: ProductItem[];
  title?: string;
  isLoadingMore?: boolean;
  onPressMore?: () => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
};

export function ProductListGrid({
  products,
  title,
  onPressMore,
  onEndReached,
  onEndReachedThreshold = 0.4,
  isLoadingMore,
  refreshControl,
  ListEmptyComponent,
}: ProductGridProps) {
  const router = useRouter();

  const renderItem: ListRenderItem<ProductItem> = ({ item: product }) => (
    <ProductCardSmall
      key={product.id}
      product={product}
      onPress={() => router.push(`/products/${encodeURIComponent(product.id)}`)}
      className="mb-4 px-1"
    />
  );

  return (
    <ProductListBase title={title} onPressMore={onPressMore}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ marginHorizontal: -4 }}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        ListFooterComponent={
          isLoadingMore ? <ActivityIndicator style={{ margin: 20 }} /> : null
        }
        refreshControl={refreshControl}
        ListEmptyComponent={ListEmptyComponent}
      />
    </ProductListBase>
  );
}
