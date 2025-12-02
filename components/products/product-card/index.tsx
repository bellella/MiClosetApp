import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DimensionValue } from "react-native";
import { Image } from "@/components/ui/image";
import { CollectionProduct, ProductItem } from "@/types";

export type ProductCardBaseProps = {
  product: ProductItem;
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
  return (
    <Pressable style={{ width }} onPress={onPress} className={className}>
      <VStack className="gap-y-1">
        {/* ---------- 썸네일 ---------- */}
        <Box
          className="relative w-full overflow-hidden"
          style={{ aspectRatio }}
        >
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              className="h-full w-full"
              alt={product.imageAlt}
            />
          ) : (
            <Box className="h-full w-full bg-gray-100" />
          )}

          {showHeart && (
            <Box className="absolute right-2 top-2">
              <FontAwesome name="heart-o" size={18} color="#9CA3AF" />
            </Box>
          )}
        </Box>

        {/* ---------- 정보 영역 ---------- */}
        <VStack className="px-1">
          <Text size={fontSize} className="text-gray-700" numberOfLines={2}>
            {product.title}
          </Text>

          <HStack className="items-center space-x-1">
            <Text size={fontSize} bold>
              {product.price?.toLocaleString()} {product.currency}
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
