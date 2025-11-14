"use client";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "@/components/ui/actionsheet";
import { FloatingButton } from "@/components/common/FloatingButton";
import { OptionsSelector } from "./OptionsSelector";
import { SelectedVariants } from "./SelectedVariants";
import { View } from "@/components/Themed";
import { ProductOption } from "@/lib/graphql/shopify.schema";
import { ProductVariantFragment } from "@/lib/graphql/products/products.graphql";
import { useProductBuy } from "./useProductBuy"; // ✅ 훅 import
import { Button } from "@/components/common/Button";

type Props = {
  options: Pick<ProductOption, "name" | "values">[];
  variants: ProductVariantFragment[];
};

export function ProductBuyButtonContainer({ options, variants }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    selectedVariants,
    totalPrice,
    handleOptionSelect,
    updateQuantity,
    removeVariant,
    addToCart,
    buyNow,
  } = useProductBuy(options, variants);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleAddToCart = async () => {
    await addToCart.mutateAsync();
    setIsOpen(false);
  };

  const handleBuyNow = async () => {
    const checkoutUrl = await buyNow.mutateAsync();
    if (checkoutUrl) {
      console.log("Go to checkout:", checkoutUrl);
    }
  };

  return (
    <>
      {/* Floating 구매 버튼 */}
      <FloatingButton onPress={handleOpen}>
        <Text className="text-white font-bold text-base">구매하기</Text>
      </FloatingButton>
      {/* Actionsheet */}
      <Actionsheet isOpen={isOpen} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="max-w-app w-full self-center">
          <ScrollView className="w-full h-[70vh] p-4">
            <OptionsSelector options={options} onSelect={handleOptionSelect} />

            {selectedVariants.length > 0 && (
              <SelectedVariants
                variants={selectedVariants}
                onQuantityChange={updateQuantity}
                onRemove={removeVariant}
              />
            )}
          </ScrollView>

          {/* 하단 결제 영역 */}
          <View className="w-full border-t border-gray-200 p-4 bg-white">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="flex-1 font-medium text-lg">총 금액</Text>
              <Text className="font-bold text-lg">
                {totalPrice.toLocaleString()} KRW
              </Text>
            </View>

            <View className="flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onPress={handleBuyNow}
                disabled={buyNow.isPending}
                loading={buyNow.isPending}
              >
                바로구매
              </Button>

              <Button
                variant="solid"
                className="flex-1"
                onPress={handleAddToCart}
                disabled={addToCart.isPending}
                loading={addToCart.isPending}
              >
                장바구니 담기
              </Button>
            </View>
          </View>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}
