import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { TextInput } from "react-native";
import { Star } from "lucide-react-native";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { ImageUploader } from "@/components/common/ImageUploader";
import * as ImagePicker from "expo-image-picker";

export type ReviewFormData = {
  rating: number;
  title: string;
  body: string;
  images: ImagePicker.ImagePickerAsset[];
};

type ReviewFormProps = {
  control: Control<ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
};

export function ReviewForm({ control, errors }: ReviewFormProps) {
  return (
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
        <Controller
          control={control}
          name="images"
          render={({ field: { onChange, value } }) => (
            <ImageUploader images={value} onImagesChange={onChange} />
          )}
        />
      </VStack>
    </VStack>
  );
}
