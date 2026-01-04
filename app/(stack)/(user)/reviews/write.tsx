import { AppContainer } from "@/components/app/app-container";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, TextInput, Alert } from "react-native";
import { Star } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewProductInfo } from "@/components/reviews/ReviewProductInfo";
import { ImageUploader } from "@/components/common/ImageUploader";
import * as ImagePicker from "expo-image-picker";
import { customInstance } from "@/lib/api/axios-client";

type ReviewFormData = {
  rating: number;
  title: string;
  body: string;
  images: ImagePicker.ImagePickerAsset[];
};

export default function WriteReviewScreen() {
  const { productId, lineItemId } = useLocalSearchParams<{
    productId: string;
    lineItemId: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 5,
      title: "",
      body: "",
      images: [],
    },
  });

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

  const handleImagesChange = (newImages: ImagePicker.ImagePickerAsset[]) => {
    setImages(newImages);
    setValue("images", newImages);
  };

  const onSubmit = async (data: ReviewFormData) => {
    console.log("📝 Form data:", data);

    // FormData 생성
    const formData = new FormData();

    // 이미지 추가 (폼 제출할 때만!)
    for (const asset of data.images) {
      console.log("🖼️ Processing asset:", asset);

      if (asset.file) {
        // Web: File 객체가 있으면 사용
        console.log("✅ Using asset.file (Web)");
        formData.append("images", asset.file);
      } else if (asset.uri) {
        // Native: URI 사용
        console.log("📱 Using URI (Native)");
        const filename = asset.uri.split("/").pop() || "image.jpg";
        formData.append("images", {
          uri: asset.uri,
          name: filename,
          type: asset.mimeType || "image/jpeg",
        } as any);
      }
    }

    // 나머지 데이터 추가
    formData.append("rating", data.rating.toString());
    formData.append("title", data.title);
    formData.append("body", data.body);
    formData.append("productId", productId!);
    formData.append("lineItemId", lineItemId!);

    console.log("📤 Submitting FormData");
    createMutation.mutate(formData);
  };

  return (
    <AppContainer headerTitle="Write Review" showBackButton>
      {/* Product Info */}
      {productId && <ReviewProductInfo productId={productId} />}

      <VStack className="gap-y-6">
        {/* Rating */}
        <VStack className="gap-y-3">
          <Text size="sm" bold>
            Rating
          </Text>
          <Controller
            control={control}
            name="rating"
            rules={{ required: "Rating is required" }}
            render={({ field: { onChange, value } }) => (
              <HStack className="gap-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable key={star} onPress={() => onChange(star)}>
                    <Star
                      size={32}
                      fill={star <= value ? "#FCD34D" : "none"}
                      color={star <= value ? "#FCD34D" : "#D1D5DB"}
                    />
                  </Pressable>
                ))}
              </HStack>
            )}
          />
        </VStack>

        {/* Title */}
        <VStack className="gap-y-3">
          <Text size="sm" bold>
            Title (Optional)
          </Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="rounded-lg border border-gray-300 p-3"
                placeholder="Enter review title"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </VStack>

        {/* Body */}
        <VStack className="gap-y-3">
          <Text size="sm" bold>
            Review *
          </Text>
          <Controller
            control={control}
            name="body"
            rules={{ required: "Review text is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="h-32 rounded-lg border border-gray-300 p-3"
                placeholder="Write your review here..."
                value={value}
                onChangeText={onChange}
                multiline
                textAlignVertical="top"
              />
            )}
          />
          {errors.body && (
            <Text size="xs" className="text-red-500">
              {errors.body.message}
            </Text>
          )}
        </VStack>

        {/* Images */}
        <VStack className="gap-y-3">
          <Text size="sm" bold>
            Photos
          </Text>
          <ImageUploader images={images} onImagesChange={handleImagesChange} />
        </VStack>

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
