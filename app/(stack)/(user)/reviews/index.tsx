import { AppContainer } from "@/components/app/app-container";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import {
  reviewsGetAllByUserId,
  reviewsGetReviewableItems,
} from "@/lib/api/generated/reviews/reviews";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Star } from "lucide-react-native";
import { useState } from "react";
import { ReviewableLineItem } from "@/lib/api/model";

export default function ReviewsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reviewable" | "written">(
    "reviewable"
  );

  // Fetch reviewable items
  const { data: reviewableData, isLoading: isLoadingReviewable } = useQuery({
    queryKey: ["reviewable-items"],
    queryFn: () => reviewsGetReviewableItems({ orderId: "" }),
  });

  const reviewableItems = [
    ...(reviewableData?.targetOrderItems || []),
    ...(reviewableData?.otherItems || []),
  ].filter((item) => !item.hasReviewed);

  // Fetch written reviews
  const {
    data: writtenReviews,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
    isLoading: isLoadingWritten,
  } = useInfiniteQuery({
    queryKey: ["my-reviews"],
    queryFn: ({ pageParam }) =>
      reviewsGetAllByUserId({ cursor: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as number | undefined,
  });

  const writtenItems = writtenReviews?.pages.flatMap((p) => p.items) ?? [];

  const renderReviewableItem = ({ item }: { item: ReviewableLineItem }) => {
    const variant = item.variant as any;
    return (
      <Pressable
        className="border-b border-gray-200 p-4"
        onPress={() =>
          router.push(
            `/(stack)/(user)/reviews/write?productId=${item.productId}&lineItemId=${item.lineItemId}`
          )
        }
      >
        <HStack className="gap-x-3">
          {variant?.image?.url && (
            <Image
              source={{ uri: variant.image.url }}
              className="h-20 w-20 rounded-lg"
            />
          )}
          <VStack className="flex-1 gap-y-2">
            <Text size="sm" numberOfLines={2} bold>
              {item.title}
            </Text>
            <Text size="xs" className="text-gray-500">
              {variant?.title || ""} | {item.quantity}개
            </Text>
            <Text size="xs" className="text-gray-400">
              {new Date(item.processedAt).toLocaleDateString()}
            </Text>
          </VStack>
          <Box className="items-center justify-center rounded-lg bg-pink-500 px-4 py-2">
            <Text size="xs" className="text-white" bold>
              리뷰 쓰기
            </Text>
          </Box>
        </HStack>
      </Pressable>
    );
  };

  const renderWrittenItem = ({ item }: { item: any }) => (
    <Pressable
      className="border-b border-gray-200 p-4"
      onPress={() => router.push(`/(stack)/(user)/reviews/${item.id}`)}
    >
      <HStack className="gap-x-3">
        {item.images?.[0] && (
          <Image
            source={{ uri: item.images[0] }}
            className="h-20 w-20 rounded-lg"
          />
        )}
        <VStack className="flex-1 gap-y-2">
          <HStack className="gap-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < item.rating ? "#FCD34D" : "none"}
                color={i < item.rating ? "#FCD34D" : "#D1D5DB"}
              />
            ))}
          </HStack>
          <Text size="sm" numberOfLines={2} bold>
            {item.title || "No title"}
          </Text>
          <Text size="xs" className="text-gray-600" numberOfLines={2}>
            {item.body}
          </Text>
          <Text size="xs" className="text-gray-400">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );

  const isLoading =
    activeTab === "reviewable" ? isLoadingReviewable : isLoadingWritten;

  return (
    <AppContainer headerTitle="리뷰 관리" showBackButton>
      <VStack className="flex-1">
        {/* Tab Header */}
        <HStack className="border-b border-gray-200">
          <Pressable
            className={`flex-1 items-center border-b-2 py-4 ${
              activeTab === "reviewable"
                ? "border-pink-500"
                : "border-transparent"
            }`}
            onPress={() => setActiveTab("reviewable")}
          >
            <Text
              size="sm"
              bold={activeTab === "reviewable"}
              className={
                activeTab === "reviewable" ? "text-pink-500" : "text-gray-500"
              }
            >
              리뷰 작성 ({reviewableItems.length})
            </Text>
          </Pressable>
          <Pressable
            className={`flex-1 items-center border-b-2 py-4 ${
              activeTab === "written" ? "border-pink-500" : "border-transparent"
            }`}
            onPress={() => setActiveTab("written")}
          >
            <Text
              size="sm"
              bold={activeTab === "written"}
              className={
                activeTab === "written" ? "text-pink-500" : "text-gray-500"
              }
            >
              작성한 리뷰 ({writtenItems.length})
            </Text>
          </Pressable>
        </HStack>

        {/* Content */}
        {isLoading ? (
          <Box className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
          </Box>
        ) : activeTab === "reviewable" ? (
          <FlatList
            data={reviewableItems}
            renderItem={renderReviewableItem}
            keyExtractor={(item) => item.lineItemId}
            ListEmptyComponent={
              <Box className="items-center justify-center py-20">
                <Text className="text-gray-400">작성 가능한 리뷰가 없습니다</Text>
              </Box>
            }
          />
        ) : (
          <FlatList
            data={writtenItems}
            renderItem={renderWrittenItem}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.2}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            ListEmptyComponent={
              <Box className="items-center justify-center py-20">
                <Text className="text-gray-400">작성한 리뷰가 없습니다</Text>
              </Box>
            }
            ListFooterComponent={
              isFetchingNextPage ? (
                <Box className="items-center justify-center py-4">
                  <ActivityIndicator size="large" />
                </Box>
              ) : null
            }
          />
        )}
      </VStack>
    </AppContainer>
  );
}
