import React, { useCallback } from "react";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { AppContainer } from "@/components/app/app-container";
import { OrderItemCard } from "@/components/orders/OrderItemCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "@/components/Themed";
import { OrderListSkeleton } from "@/components/skeletons/OrderListSkeleton";

export default function OrdersScreen() {
const fetchOrders = async ({ pageParam }: { pageParam?: string }) => {
  const token = await AsyncStorage.getItem("customerAccessToken"); // 로그인 시 저장된 토큰
  if (!token) throw new Error("로그인이 필요합니다.");

  const { customer } = await shopifySdk.orders.GetCustomerOrders({
    customerAccessToken: token,
    first: 10,
    after: pageParam ?? null,
  });

    return customer?.orders;
};


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
    queryFn: fetchOrders,
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage?.pageInfo?.endCursor : undefined,
    initialPageParam: undefined,
  });

  const orders = data?.pages.flatMap((p) => p?.edges || []) ?? [];

  const renderItem = useCallback(({ item }: any) => {
    const order = item.node;
    return <OrderItemCard key={order.id} order={order} />;
  }, []);

  if (isLoading) {
    return (
      <AppContainer headerTitle="주문·배송" showBackButton>
        <OrderListSkeleton />
      </AppContainer>
    );
  }

  return (
    <AppContainer headerTitle="주문·배송" showBackButton>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.node.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Text className="text-gray-400">No orders yet</Text>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <Box className="py-4 items-center justify-center">
              <ActivityIndicator size="large" />
            </Box>
          ) : null
        }
      />
    </AppContainer>
  );
}
