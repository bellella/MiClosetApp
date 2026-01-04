import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { Spinner } from "@/components/ui/spinner";
import { Star } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { reviewsGetAllByProductId } from "@/lib/api/generated/reviews/reviews";
import { useRouter } from "expo-router";
import { formatLocalDate } from "@/lib/utils/date.utils";

type Props = {
  productId: string;
};

export function ProductDetailReview({ productId }: Props) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () =>
      reviewsGetAllByProductId(encodeURIComponent(productId), { limit: 10 }),
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
  const imageReviews = reviewList.filter(
    (r) => r.images && r.images.length > 0
  );
  const textReviews = reviewList.filter(
    (r) => !r.images || r.images.length === 0
  );

  if (reviewList.length === 0) {
    return (
      <View className="mt-10">
        <Text bold size="md" className="mb-2">
          상품 리뷰
        </Text>
        <Text size="sm" className="text-gray-400">
          아직 등록된 리뷰가 없습니다.
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-10 space-y-8">
      <Text bold size="md">
        상품 리뷰 ({reviewList.length})
      </Text>

      {/* 📸 이미지 리뷰 카드 */}
      {imageReviews.length > 0 && (
        <View className="flex-row flex-wrap gap-3">
          {imageReviews.map((r) => (
            <View
              key={r.id}
              className="w-[46%] overflow-hidden rounded-md bg-gray-50"
            >
              <Image
                source={{ uri: r.images[0] }}
                className="h-40 w-full"
                resizeMode="cover"
              />
              <View className="p-2">
                <Text size="xs" bold className="mb-1">
                  {r.user.firstName || "익명"}
                </Text>
                <View className="mb-1 flex-row items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < r.rating ? "#FCD34D" : "none"}
                      color={i < r.rating ? "#FCD34D" : "#D1D5DB"}
                    />
                  ))}
                </View>
                <Text size="xs" numberOfLines={2} className="text-gray-600">
                  {r.body}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 📝 텍스트 리뷰 리스트 */}
      <View className="space-y-6">
        {textReviews.map((review) => (
          <View key={review.id} className="border-b border-gray-200 pb-4">
            <View className="mb-1 flex-row items-center justify-between">
              <Text size="sm" bold>
                {review.user.firstName || "익명"}
              </Text>
              <View className="flex-row items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < review.rating ? "#FCD34D" : "none"}
                    color={i < review.rating ? "#FCD34D" : "#D1D5DB"}
                  />
                ))}
                <Text size="xs" className="ml-1 text-gray-500">
                  {review.rating}.0
                </Text>
              </View>
            </View>

            {review.title && (
              <Text size="sm" bold className="mb-1">
                {review.title}
              </Text>
            )}

            <Text size="sm" className="leading-relaxed text-gray-800">
              {review.body}
            </Text>

            <Text size="xs" className="mt-1 text-gray-400">
              {formatLocalDate(review.createdAt)}
            </Text>
          </View>
        ))}
      </View>

      {/* 🔘 전체 보기 버튼 */}
      {reviewList.length > 5 && (
        <Pressable
          className="mt-4 items-center rounded-lg border border-gray-300 py-3"
          onPress={() => {
            // Navigate to all reviews screen
          }}
        >
          <Text size="sm" bold>
            리뷰 전체 보기
          </Text>
        </Pressable>
      )}
    </View>
  );
}
