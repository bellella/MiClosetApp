import { AppContainer } from "@/components/app/app-container";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Box } from "@/components/ui/box";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReviewProductInfo } from "@/components/reviews/ReviewProductInfo";
import { customInstance } from "@/lib/api/axios-client";
import {  useReviewForm } from "@/lib/hooks/useReviewForm";
import { ReviewForm, ReviewFormData } from "@/components/reviews/ReviewForm";
import { reviewsGetOne } from "@/lib/api/generated/reviews/reviews";
import { Spinner } from "@/components/ui/spinner";
import { ReviewWithoutUser } from "@/lib/api/model/reviewWithoutUser";
import { useEffect } from "react";

export default function EditReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 기존 리뷰 데이터 가져오기
  const { data: review, isLoading } = useQuery({
    queryKey: ["review", id],
    queryFn: () => reviewsGetOne(parseInt(id)),
  });

  const reviewData = review as ReviewWithoutUser;

  // 리뷰 폼 초기화
  const {
    control,
    handleSubmit,
    formState: { errors },
    buildFormData,
    reset,
  } = useReviewForm();

  // 리뷰 데이터 로드 완료 시 폼 초기화
  useEffect(() => {
    if (reviewData && !isLoading) {
      reset({
        rating: reviewData.rating,
        title: reviewData.title || "",
        body: reviewData.body,
        images: reviewData.images.map((image) => ({
          uri: image,
        })),
      });
    }
  }, [reviewData, isLoading, reset]);

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) =>
      customInstance({
        url: `/api/reviews/${id}`,
        method: "PATCH",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review", id] });
      Alert.alert("Success", "Review updated successfully");
      router.back();
    },
    onError: () => {
      Alert.alert("Error", "Failed to update review");
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    const formData = buildFormData(data, {
      productId: reviewData.productId!,
      lineItemId: reviewData.lineItemId!,
    });

    updateMutation.mutate(formData);
  };

  if (isLoading || !reviewData) {
    return (
      <AppContainer headerTitle="Edit Review" showBackButton>
        <Box className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </Box>
      </AppContainer>
    );
  }

  return (
    <AppContainer headerTitle="Edit Review" showBackButton>
      {/* Product Info */}
      {reviewData.productId && (
        <ReviewProductInfo productId={reviewData.productId} />
      )}

      <VStack className="gap-y-6">
        {/* Review Form */}
        <ReviewForm control={control} errors={errors} />

        {/* Submit Button */}
        <Pressable
          className="mt-4 items-center rounded-lg bg-pink-500 py-4"
          onPress={handleSubmit(onSubmit)}
          disabled={updateMutation.isPending}
        >
          <Text size="md" bold className="text-white">
            {updateMutation.isPending ? "Updating..." : "Update Review"}
          </Text>
        </Pressable>
      </VStack>
    </AppContainer>
  );
}
