import { AppContainer } from "@/components/app/app-container";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { reviewsGetAllByProductId } from "@/lib/api/generated/reviews/reviews";
import { useInfiniteQuery } from "@tanstack/react-query";
import { RefreshControl } from "react-native";
import { ListLoading } from "@/components/common/loading/ListLoading";
import { useLocalSearchParams } from "expo-router";
import { Star } from "lucide-react-native";
import { PageLoading } from "@/components/common/loading/PageLoading";
import { View } from "@/components/Themed";
import { CustomFlatList } from "@/components/common/CustomFaltList";
import { ReviewItem } from "@/components/reviews/ReviewItem";

export default function ProductReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["product-reviews", id],
    queryFn: ({ pageParam }) =>
      reviewsGetAllByProductId(encodeURIComponent(id), { cursor: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as number | undefined,
    enabled: !!id,
  });

  const reviews = data?.pages.flatMap((p) => p.items) ?? [];
  const totalCount = reviews.length;
  const averageRating =
    totalCount > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
      : "0";

  if (isLoading) {
    return (
      <AppContainer headerTitle="Reviews" showBackButton disableScroll>
        <PageLoading />
      </AppContainer>
    );
  }

  return (
    <AppContainer headerTitle="Reviews" showBackButton disableScroll>
      <VStack className="flex-1">
        {/* Summary Header */}
        <VStack className="border-b border-gray-200 px-4 py-4">
          <Text size="lg" bold>
            Reviews ({totalCount})
          </Text>
          <HStack className="mt-2 items-center gap-x-2">
            <Star size={20} fill="#FCD34D" color="#FCD34D" />
            <Text size="lg" bold>
              {averageRating}
            </Text>
            <Text size="sm" className="text-gray-500">
              ({totalCount} reviews)
            </Text>
          </HStack>
        </VStack>

        {/* Reviews List */}
        <CustomFlatList
          data={reviews}
          renderItem={({ item }) => <ReviewItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.2}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-gray-400">No reviews yet</Text>
            </View>
          }
          ListFooterComponent={<ListLoading isLoading={isFetchingNextPage} />}
        />
      </VStack>
    </AppContainer>
  );
}
