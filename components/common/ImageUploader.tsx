import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Image } from "react-native";
import { Camera, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

type ImageUploaderProps = {
  images: ImagePicker.ImagePickerAsset[];
  onImagesChange: (images: ImagePicker.ImagePickerAsset[]) => void;
  maxImages?: number;
};

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const updatedImages = [...images, ...result.assets].slice(0, maxImages);
      onImagesChange(updatedImages);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  return (
    <HStack className="flex-wrap gap-3">
      {images.map((img, idx) => (
        <Box key={idx} className="relative">
          <Image source={{ uri: img.uri }} className="h-24 w-24 rounded-lg" />
          <Pressable
            className="absolute -right-2 -top-2 rounded-full bg-black p-1"
            onPress={() => removeImage(idx)}
          >
            <X size={16} color="white" />
          </Pressable>
        </Box>
      ))}
      {images.length < maxImages && (
        <Pressable
          className="h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
          onPress={pickImage}
        >
          <Camera size={32} color="#9CA3AF" />
          <Text size="xs" className="text-gray-400">
            Add Photo
          </Text>
        </Pressable>
      )}
    </HStack>
  );
}
