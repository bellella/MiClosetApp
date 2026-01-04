import React, { useCallback } from "react";
import { FlatList, RefreshControl } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/text";
import { AppContainer } from "@/components/app/app-container";
import { OrderItemCard } from "@/components/orders/OrderItemCard";
import { View } from "@/components/Themed";
import { OrderListSkeleton } from "@/components/skeletons/OrderListSkeleton";
import { ListLoading } from "@/components/common/loading/ListLoading";
import { shopifyGetCustomerOrders } from "@/lib/api/generated/shopify/shopify";

export default function OrdersScreen() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["orders"],
    queryFn: async ({ pageParam }) => {
      const response = await shopifyGetCustomerOrders({
        cursorString: pageParam,
      });

      return {
        items: response.items,
        nextCursor: response.nextCursor,
      };
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialPageParam: "",
    select: (data) => data.pages.flatMap((page) => page.items) ?? [],
  });

  const renderItem = useCallback(({ item }: any) => {
    return <OrderItemCard key={item.id} order={item} />;
  }, []);

  if (isLoading) {
    return (
      <AppContainer headerTitle="Orders & Delivery" showBackButton>
        <OrderListSkeleton />
      </AppContainer>
    );
  }

  return (
    <AppContainer headerTitle="Orders & Delivery" showBackButton disableScroll>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View className="mt-20 items-center justify-center">
            <Text className="text-gray-400">No orders yet</Text>
          </View>
        }
        ListFooterComponent={
          <ListLoading isLoading={isFetchingNextPage} />
        }
      />
    </AppContainer>
  );
}
