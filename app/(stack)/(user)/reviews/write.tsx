import { AppContainer } from "@/components/app/app-container";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, TextInput, Image, Alert } from "react-native";
import { Star, Camera, X } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsCreate } from "@/lib/api/generated/reviews/reviews";
import * as ImagePicker from "expo-image-picker";
import { ReviewProductInfo } from "@/components/reviews/ReviewProductInfo";

type ReviewFormData = {
  rating: number;
  title: string;
  body: string;
  images: string[];
};

export default function WriteReviewScreen() {
  const { productId, lineItemId } = useLocalSearchParams<{
    productId: string;
    lineItemId: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<string[]>([]);

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

  const rating = watch("rating");

  const createMutation = useMutation({
    mutationFn: (data: ReviewFormData) =>
      reviewsCreate({
        productId: productId!,
        lineItemId: lineItemId!,
        rating: data.rating,
        title: data.title,
        body: data.body,
        images: data.images,
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      setValue("images", updatedImages);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue("images", updatedImages);
  };

  const onSubmit = (data: ReviewFormData) => {
    createMutation.mutate(data);
  };

  return (
    <AppContainer headerTitle="Write Review" showBackButton>
      <ScrollView className="flex-1">
        {/* Product Info */}
        {productId && <ReviewProductInfo productId={productId} />}

        <VStack className="gap-y-6 p-4">
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
            <HStack className="flex-wrap gap-3">
              {images.map((img, idx) => (
                <Box key={idx} className="relative">
                  <Image source={{ uri: img }} className="h-24 w-24 rounded-lg" />
                  <Pressable
                    className="absolute -right-2 -top-2 rounded-full bg-black p-1"
                    onPress={() => removeImage(idx)}
                  >
                    <X size={16} color="white" />
                  </Pressable>
                </Box>
              ))}
              <Pressable
                className="h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
                onPress={pickImage}
              >
                <Camera size={32} color="#9CA3AF" />
                <Text size="xs" className="text-gray-400">
                  Add Photo
                </Text>
              </Pressable>
            </HStack>
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
      </ScrollView>
    </AppContainer>
  );
}
