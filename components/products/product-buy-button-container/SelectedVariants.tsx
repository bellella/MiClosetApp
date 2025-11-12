import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Feather } from "@expo/vector-icons";
import { ProductVariantItem } from "@/lib/graphql/types/product.type";
import { QuantitySelector } from "@/components/common/QuantitySelector";

type Props = {
  variants: ProductVariantItem[];
  onQuantityChange?: (id: string, newQty: number) => void;
  onRemove?: (id: string) => void;
};

export function SelectedVariants({
  variants,
  onQuantityChange,
  onRemove,
}: Props) {
  if (variants.length === 0) return null;

  return (
    <View className="mt-6 space-y-3">
      <Text className="font-medium mb-2">선택된 상품</Text>

      {variants.map((variant) => (
        <Box
          key={variant.id}
          className={`relative border rounded-lg p-3 bg-white ${
            variant.availableForSale
              ? "border-gray-300"
              : "border-gray-200 opacity-50"
          }`}
        >
          {/* X 버튼 */}
          {onRemove && (
            <Pressable
              onPress={() => onRemove(variant.id)}
              className="absolute top-2 right-2 p-1"
            >
              <Feather name="x" size={18} color="#999" />
            </Pressable>
          )}

          {/* 상품명 + 가격 */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-medium flex-shrink">
              {variant.title.replace("/", " / ")}
            </Text>
            <Text className="text-right">
              {parseFloat(variant.price.amount).toLocaleString()}{" "}
              {variant.price.currencyCode}
            </Text>
          </View>

          {/* 재고 상태 */}
          <Text
            className={`text-sm mb-2 ${
              variant.availableForSale ? "text-green-600" : "text-gray-400"
            }`}
          >
            {variant.availableForSale ? "재고 있음" : "품절"}
          </Text>

          {/* 수량 조절 */}
          {variant.availableForSale && onQuantityChange && (
            <QuantitySelector
              quantity={variant.quantity || 1}
              onChange={(newQty) => onQuantityChange(variant.id, newQty)}
            />
          )}
        </Box>
      ))}
    </View>
  );
}
