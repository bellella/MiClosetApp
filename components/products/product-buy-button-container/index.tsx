"use client";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { AppActionSheet } from "@/components/app/AppActionSheet";
import { FloatingButton } from "@/components/common/FloatingButton";
import { OptionsSelector } from "./OptionsSelector";
import { SelectedVariants } from "./SelectedVariants";
import { ProductOption } from "@/lib/graphql/shopify.schema";
import { ProductVariantFragment } from "@/lib/graphql/products/products.graphql";
import { useProductBuy } from "./useProductBuy"; // ✅ 훅 import
import { Button } from "@/components/common/Button";
import { useCheckout } from "@/lib/hooks/useCheckout";
import { useToast } from "@/components/ui/toast";
import { useToastMessage } from "@/lib/hooks/useToastMessage";
import { ButtonText } from "@/components/ui/button";
import { CustomScrollView } from "@/components/common/CustomScrollView";

type Props = {
  options: Pick<ProductOption, "name" | "values">[];
  variants: ProductVariantFragment[];
};

export function ProductBuyButtonContainer({ options, variants }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { showSuccess } = useToastMessage();
  const {
    selectedVariants,
    totalPrice,
    handleOptionSelect,
    updateQuantity,
    removeVariant,
    cartLinesAdd,
    buyNow,
  } = useProductBuy(options, variants);
  const toast = useToast();
  const { handleCheckout } = useCheckout();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const isVariantsEmpty = selectedVariants.length === 0;

  const handleAddToCart = async () => {
    await cartLinesAdd
      .mutateAsync()
      .then(() => showSuccess("Your item is added to cart"))
      .catch(() => showSuccess("Failed to add items to cart"));
    setIsOpen(false);
  };

  const handleBuyNow = async () => {
    const checkoutUrl = await buyNow.mutateAsync();
    if (checkoutUrl) {
      handleCheckout(checkoutUrl);
    }
  };

  return (
    <>
      {/* Floating 구매 버튼 */}
      <FloatingButton onPress={handleOpen}>
        <ButtonText>Buy</ButtonText>
      </FloatingButton>
      {/* Actionsheet */}
      <AppActionSheet isOpen={isOpen} onClose={handleClose}>
        <CustomScrollView className="h-[50vh] w-full p-4">
            <OptionsSelector options={options} onSelect={handleOptionSelect} />

            {selectedVariants.length > 0 && (
              <SelectedVariants
                variants={selectedVariants}
                onQuantityChange={updateQuantity}
                onRemove={removeVariant}
              />
            )}
          </CustomScrollView>

          {/* 하단 결제 영역 */}
          <View className="w-full border-t border-gray-200 p-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="flex-1 text-lg font-medium">Total Price</Text>
              <Text className="text-lg font-bold">
                {totalPrice.toLocaleString()} KRW
              </Text>
            </View>

            <View className="flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onPress={handleBuyNow}
                disabled={isVariantsEmpty || buyNow.isPending}
                loading={buyNow.isPending}
              >
                Buy
              </Button>

              <Button
                variant="solid"
                className="flex-1"
                onPress={handleAddToCart}
                disabled={isVariantsEmpty || cartLinesAdd.isPending}
                loading={cartLinesAdd.isPending}
              >
                Add To Cart
              </Button>
            </View>
          </View>
      </AppActionSheet>
    </>
  );
}
