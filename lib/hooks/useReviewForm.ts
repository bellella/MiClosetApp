import { useState } from "react";
import { useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { ReviewFormData } from "@/components/reviews/ReviewForm";

type UseReviewFormProps = {
  defaultValues?: Partial<ReviewFormData>;
};

export function useReviewForm({
  defaultValues = {},
}: UseReviewFormProps = {}) {
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>(
    defaultValues.images || []
  );

  const form = useForm<ReviewFormData>({
    defaultValues: {
      rating: 5,
      title: "",
      body: "",
      images: [],
      ...defaultValues,
    },
  });

  const handleImagesChange = (newImages: ImagePicker.ImagePickerAsset[]) => {
    setImages(newImages);
    form.setValue("images", newImages);
  };

  const buildFormData = (
    data: ReviewFormData,
    additionalFields: Record<string, string>
  ) => {
    const formData = new FormData();

    // 이미지 추가
    for (const asset of data.images) {
      if (asset.file) {
        // Web: File 객체가 있으면 사용
        formData.append("images", asset.file);
      } else if (asset.uri) {
        // Native: URI 사용
        const filename = asset.uri.split("/").pop() || "image.jpg";
        formData.append("images", {
          uri: asset.uri,
          name: filename,
          type: asset.mimeType || "image/jpeg",
        } as any);
      }
    }

    // 기본 필드 추가
    formData.append("rating", data.rating.toString());
    formData.append("title", data.title);
    formData.append("body", data.body);

    // 추가 필드
    Object.entries(additionalFields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return formData;
  };

  return {
    ...form,
    images,
    handleImagesChange,
    buildFormData,
  };
}
