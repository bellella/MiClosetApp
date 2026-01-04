import { AppContainer } from "@/components/app/app-container";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsGetAllByUserId, reviewsRemove } from "@/lib/api/generated/reviews/reviews";
import { Image, ScrollView, Alert } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import { Star } from "lucide-react-native";
import { Pressable } from "@/components/ui/pressable";
import { ReviewProductInfo } from "@/components/reviews/ReviewProductInfo";
import { formatLocalDate } from "@/lib/utils/date.utils";

export default function ReviewDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: () => reviewsGetAllByUserId({ limit: 1000 }),
  });

  const review = reviews?.items.find((r) => r.id.toString() === id);

  const deleteMutation = useMutation({
    mutationFn: () => reviewsRemove(parseInt(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      Alert.alert("Success", "Review deleted successfully");
      router.back();
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to delete review");
    },
  });

  const handleDelete = () => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  if (isLoading || !review) {
    return (
      <AppContainer headerTitle="Review Detail" showBackButton>
        <Box className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </Box>
      </AppContainer>
    );
  }

  return (
    <AppContainer headerTitle="Review Detail" showBackButton>
      <ScrollView className="flex-1">
        {/* Product Info */}
        {review.productId && <ReviewProductInfo productId={review.productId} />}

        <VStack className="gap-y-6 p-4">
          {/* Rating */}
          <HStack className="gap-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                fill={i < review.rating ? "#FCD34D" : "none"}
                color={i < review.rating ? "#FCD34D" : "#D1D5DB"}
              />
            ))}
          </HStack>

          {/* Title */}
          {review.title && (
            <Text size="lg" bold>
              {review.title}
            </Text>
          )}

          {/* Body */}
          <Text size="sm" className="text-gray-700">
            {review.body}
          </Text>

          {/* Images */}
          {review.images && review.images.length > 0 && (
            <VStack className="gap-y-3">
              <Text size="sm" bold>
                Images
              </Text>
              <HStack className="flex-wrap gap-2">
                {review.images.map((img, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: img }}
                    className="h-24 w-24 rounded-lg"
                  />
                ))}
              </HStack>
            </VStack>
          )}

          {/* Date */}
          <Text size="xs" className="text-gray-400">
            {formatLocalDate(review.createdAt)}
          </Text>

          {/* Actions */}
          <HStack className="gap-x-3">
            <Pressable
              className="flex-1 items-center rounded-lg border border-gray-300 py-3"
              onPress={() =>
                router.push({
                  pathname: "/(stack)/(user)/reviews/edit",
                  params: { id: review.id },
                } as any)
              }
            >
              <Text size="sm">Edit</Text>
            </Pressable>
            <Pressable
              className="flex-1 items-center rounded-lg border border-red-500 py-3"
              onPress={handleDelete}
            >
              <Text size="sm" className="text-red-500">
                Delete
              </Text>
            </Pressable>
          </HStack>
        </VStack>
      </ScrollView>
    </AppContainer>
  );
}
