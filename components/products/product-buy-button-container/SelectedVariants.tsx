import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Feather } from "@expo/vector-icons";
import { ProductVariantItem } from "@/lib/graphql/types/product.type";
import { QuantitySelector } from "@/components/common/QuantitySelector";
import { HStack } from "@/components/ui/hstack";
import { cn } from "@/lib/utils/classnames";

type Props = {
  variants: ProductVariantItem[];
  onQuantityChange: (id: string, newQty: number) => void;
  onRemove: (id: string) => void;
};

export function SelectedVariants({
  variants,
  onQuantityChange,
  onRemove,
}: Props) {
  if (variants.length === 0) return null;

  return (
    <View className="mt-6 space-y-3">
      <Text className="mb-2 font-medium">선택된 상품</Text>

      {variants.map((variant) => (
        <Box
          key={variant.id}
          className={cn(
            "relative space-y-1 rounded-lg border bg-white p-3",
            variant.availableForSale ? "" : "opacity-50"
          )}
        >
          <HStack className="justify-between">
            <Text className="flex-shrink font-medium">
              {variant.title.replace("/", " / ")}
            </Text>{" "}
            <Pressable onPress={() => onRemove(variant.id)} className="">
              <Feather name="x" size={18} color="#999" />
            </Pressable>
          </HStack>

          <HStack className="items-center justify-between">
            {/* 수량 조절 */}
            {variant.availableForSale ? (
              <QuantitySelector
                quantity={variant.quantity || 1}
                onChange={(newQty) => onQuantityChange(variant.id, newQty)}
              />
            ) : (
              <Text className="text-sm">
                {variant.availableForSale || "sold out"}
              </Text>
            )}

            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-right">
                {parseFloat(variant.price.amount).toLocaleString()}{" "}
                {variant.price.currencyCode}
              </Text>
            </View>
          </HStack>
        </Box>
      ))}
    </View>
  );
}
