import { ProductCardSmall } from "@/components/products/product-card/Small";
import { CollectionProduct, ProductItem } from "@/types";
import { useRouter } from "expo-router";
import { ProductListBase } from "./Base";
import { FlatList, ListRenderItem, RefreshControlProps } from "react-native";
import { CustomFlatList } from "@/components/common/CustomFaltList";
import { ListLoading } from "@/components/common/loading/ListLoading";

type ProductGridProps = {
  products: ProductItem[];
  title?: string;
  isLoadingMore?: boolean;
  onPressMore?: () => void;
  onEndReached?: () => void;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
};

export function ProductListGrid({
  products,
  title,
  onPressMore,
  onEndReached,
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
      <CustomFlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ marginHorizontal: -4 }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<ListLoading isLoading={isLoadingMore} />}
        refreshControl={refreshControl}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{ paddingBottom: 20 }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
    </ProductListBase>
  );
}
