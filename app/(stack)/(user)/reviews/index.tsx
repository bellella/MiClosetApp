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
import { FlatList, Image, RefreshControl } from "react-native";
import { ListLoading } from "@/components/common/loading/ListLoading";
import { useRouter } from "expo-router";
import { Star } from "lucide-react-native";
import { useState } from "react";
import { ReviewableLineItem, ReviewWithoutUser } from "@/lib/api/model";
import { formatLocalDate } from "@/lib/utils/date.utils";
import { PageLoading } from "@/components/common/loading/PageLoading";
import { Button, ButtonText } from "@/components/ui/button";
import { View } from "@/components/Themed";

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
  console.log("reviewableItems", reviewableItems);

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
            `/reviews/write?productId=${item.productId}&lineItemId=${item.lineItemId}`
          )
        }
      >
        <HStack className="items-center gap-x-3">
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
              {variant?.title || ""} | {item.quantity} pcs
            </Text>
            <Text size="xs" className="text-gray-400">
              {formatLocalDate(item.processedAt)}
            </Text>
          </VStack>
          <Button>
            <ButtonText>Write Review</ButtonText>
          </Button>
        </HStack>
      </Pressable>
    );
  };

  const renderWrittenItem = ({ item }: { item: ReviewWithoutUser }) => (
    <Pressable
      className="border-b border-gray-200 p-4"
      onPress={() => {
        router.push(`/reviews/edit?id=${item.id}`);
      }}
    >
      <Box className="gap-x-3">
        <Image
          source={{ uri: item.productImageUrl }}
          className="h-20 w-20 rounded-lg"
        />
        <Text size="sm" className="mb-2" numberOfLines={2} bold>
          {item.title || "No title"}
        </Text>

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
          <Text size="xs" className="text-gray-600" numberOfLines={2}>
            {item.body}
          </Text>
          <Text size="xs" className="text-gray-400">
            {formatLocalDate(item.createdAt)}
          </Text>
        </VStack>
      </Box>
    </Pressable>
  );

  const isLoading =
    activeTab === "reviewable" ? isLoadingReviewable : isLoadingWritten;

  const tabs = [
    {
      key: "reviewable" as const,
      label: "To Write",
      count: reviewableItems.length,
    },
    {
      key: "written" as const,
      label: "Written",
      count: writtenItems.length,
    },
  ];

  return (
    <AppContainer headerTitle="My Reviews" showBackButton disableScroll>
      <VStack className="flex-1">
        {/* Tab Header */}
        <HStack className="border-b border-gray-200">
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              className={`flex-1 items-center border-b-2 py-4 ${
                activeTab === tab.key
                  ? "border-primary-500"
                  : "border-transparent"
              }`}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                size="sm"
                bold={activeTab === tab.key}
                className={
                  activeTab === tab.key ? "text-primary-500" : "text-gray-500"
                }
              >
                {tab.label} ({tab.count})
              </Text>
            </Pressable>
          ))}
        </HStack>

        {/* Content */}
        {isLoading ? (
          <PageLoading />
        ) : activeTab === "reviewable" ? (
          <FlatList
            data={reviewableItems}
            renderItem={renderReviewableItem}
            keyExtractor={(item) => item.lineItemId}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="items-center justify-center py-20">
                <Text className="text-gray-400">
                  No reviews available to write
                </Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={writtenItems}
            renderItem={renderWrittenItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.2}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            ListEmptyComponent={
              <View className="items-center justify-center py-20">
                <Text className="text-gray-400">No reviews written yet</Text>
              </View>
            }
            ListFooterComponent={<ListLoading isLoading={isFetchingNextPage} />}
          />
        )}
      </VStack>
    </AppContainer>
  );
}
