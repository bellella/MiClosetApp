import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DimensionValue } from "react-native";
import { Image } from "@/components/ui/image";
import { CollectionProduct } from "@/types";

export type ProductCardBaseProps = {
  product: CollectionProduct;
  fontSize: "sm" | "md";
  width?: DimensionValue;
  aspectRatio?: number;
  showReview?: boolean;
  showHeart?: boolean;
  onPress?: () => void;
  className?: string;
};

const DEFAULT_ASPECT_RATIO = 5 / 6;

export function ProductCard({
  product,
  fontSize,
  width = "33.3%",
  aspectRatio = DEFAULT_ASPECT_RATIO,
  showReview = false,
  showHeart = true,
  onPress,
  className,
}: ProductCardBaseProps) {
  const imageUrl = product.featuredImage?.url;
  const imageAlt = product.featuredImage?.altText ?? product.title;

  const price =
    Number(product.priceRange.minVariantPrice.amount) || 0;
  const currency = product.priceRange.minVariantPrice.currencyCode;

  return (
    <Pressable style={{ width }} onPress={onPress} className={className}>
      <VStack className="gap-y-1">
        {/* ---------- 썸네일 ---------- */}
        <Box className="relative overflow-hidden w-full" style={{ aspectRatio }}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full"
              alt={imageAlt}
            />
          ) : (
            <Box className="w-full h-full bg-gray-100" />
          )}

          {showHeart && (
            <Box className="absolute top-2 right-2">
              <FontAwesome name="heart-o" size={18} color="#9CA3AF" />
            </Box>
          )}
        </Box>

        {/* ---------- 정보 영역 ---------- */}
        <VStack className="px-1">

          <Text size={fontSize} className="text-gray-700" numberOfLines={2}>
            {product.title}
          </Text>

          <HStack className="space-x-1 items-center">
            <Text size={fontSize} bold>
              {price.toLocaleString()} {currency}
            </Text>
          </HStack>

          {showReview && (
            <Text size="xs" className="text-gray-500">
              ⭐ {Math.floor(Math.random() * 1000)} reviews
            </Text>
          )}
        </VStack>
      </VStack>
    </Pressable>
  );
}
