import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { Star } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { reviewsGetPreviewByProductId } from "@/lib/api/generated/reviews/reviews";
import { useRouter } from "expo-router";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { CustomFlatList } from "@/components/common/CustomFaltList";
import { PreviewReviewItem } from "./PreviewReviewItem";

type Props = {
  productId: string;
};

export function ProductDetailReview({ productId }: Props) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["product-reviews-preview", productId],
    queryFn: () => reviewsGetPreviewByProductId(encodeURIComponent(productId)),
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <View className="mt-10 items-center justify-center py-8">
        <Spinner size="large" />
      </View>
    );
  }

  const reviewList = data?.items || [];

  if (reviewList.length === 0) {
    return (
      <VStack className="mt-10">
        <Text bold size="md" className="mb-2">
          Reviews
        </Text>
        <Text size="sm" className="text-gray-400">
          No reviews yet.
        </Text>
      </VStack>
    );
  }

  const totalCount = reviewList.length;
  const averageRating =
    totalCount > 0
      ? (reviewList.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(
          1
        )
      : "0";

  const handleViewAll = () => {
    router.push(`/products/${encodeURIComponent(productId)}/reviews`);
  };

  return (
    <VStack className="mt-10">
      {/* Header */}
      <HStack className="mb-3 items-center justify-between px-4">
        <Text bold size="md">
          Reviews ({totalCount})
        </Text>
        <Pressable onPress={handleViewAll}>
          <Text size="sm" className="text-gray-500">
            View All &gt;
          </Text>
        </Pressable>
      </HStack>

      {/* Rating Summary */}
      <HStack className="mb-4 items-center gap-x-2 px-4">
        <Star size={20} fill="#FCD34D" color="#FCD34D" />
        <Text size="lg" bold>
          {averageRating}
        </Text>
        <Text size="sm" className="text-gray-500">
          ({totalCount} reviews)
        </Text>
      </HStack>

      {/* Horizontal Review Slider */}
      <CustomFlatList
        data={reviewList}
        renderItem={({ item }) => <PreviewReviewItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </VStack>
  );
}
