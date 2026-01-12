import { AppContainer } from "@/components/app/app-container";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewProductInfo } from "@/components/reviews/ReviewProductInfo";
import { customInstance } from "@/lib/api/axios-client";
import { useReviewForm } from "@/lib/hooks/useReviewForm";
import { ReviewForm } from "@/components/reviews/ReviewForm";

export default function WriteReviewScreen() {
  const { productId, lineItemId } = useLocalSearchParams<{
    productId: string;
    lineItemId: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    buildFormData,
  } = useReviewForm();

  const createMutation = useMutation({
    mutationFn: (formData: FormData) =>
      customInstance({
        url: "/api/reviews",
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      Alert.alert("Success", "Review submitted successfully");
      router.back();
    },
    onError: () => {
      Alert.alert("Error", "Failed to submit review");
    },
  });

  const onSubmit = async (data: any) => {
    const formData = buildFormData(data, {
      productId: productId!,
      lineItemId: lineItemId!,
    });

    createMutation.mutate(formData);
  };

  return (
    <AppContainer headerTitle="Write Review" showBackButton>
      {/* Product Info */}
      {productId && <ReviewProductInfo productId={productId} />}

      <VStack className="gap-y-6">
        {/* Review Form */}
        <ReviewForm control={control} errors={errors} />

        {/* Submit Button */}
        <Pressable
          className="mt-4 items-center rounded-lg bg-pink-500 py-4"
          onPress={handleSubmit(onSubmit)}
          disabled={createMutation.isPending}
        >
          <Text size="md" bold className="text-white">
            {createMutation.isPending ? "Submitting..." : "Submit Review"}
          </Text>
        </Pressable>
      </VStack>
    </AppContainer>
  );
}
