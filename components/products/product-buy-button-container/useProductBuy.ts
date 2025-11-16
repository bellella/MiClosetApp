import { useState, useEffect } from "react";
import { ProductOption } from "@/lib/graphql/shopify.schema";
import { ProductVariantItem } from "@/lib/graphql/types/product.type";
import { ProductVariantFragment } from "@/lib/graphql/products/products.graphql";
import { useMutation } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/lib/stores/auth.store";
import { ProductOptionItem } from "@/types/product.type";
import { useToastMessage } from "@/lib/hooks/useToastMessage";
import { CART_KEY } from "@/constants/common";

/**
 * ProductBuyButtonWrapper 전용 훅
 * - 옵션 선택 관리
 * - 선택된 variants 관리
 * - 장바구니 추가 / 바로구매 처리
 */

type SelectedOptions = Record<string, string>;

export function useProductBuy(
  options: ProductOptionItem[],
  variants: ProductVariantFragment[]
) {
  const {user} = useAuthStore();
  const {showError, showSuccess} = useToastMessage();
  const [selectedVariants, setSelectedVariants] = useState<ProductVariantItem[]>([]);

  const handleOptionSelect = (selectedOptions: SelectedOptions) => {
      const matched = variants.find((v) =>
      v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
    );

    if (matched) {
      const sameVariant = selectedVariants.find((item) => item.id === matched.id);
      if (sameVariant) {
        // if already selected, increase quantity
        setSelectedVariants((prev) =>
          prev.map((item) =>
            item.id === matched.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          )
        );
      } else {
        setSelectedVariants((prev) => [...prev, { ...matched, quantity: 1 }]);
      }
    }
  };

  /** 수량 변경 */
  const updateQuantity = (id: string, newQty: number) => {
    setSelectedVariants((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(newQty, 1) } : item
      )
    );
  };

  /** variant 제거 */
  const removeVariant = (id: string) => {
    setSelectedVariants((prev) => prev.filter((item) => item.id !== id));
  };

  /** 총 금액 */
  const totalPrice = selectedVariants.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0
  );

  /** cartId 관리 */
  const getCartId = async () => await AsyncStorage.getItem(CART_KEY);
  const setCartId = async (id: string) => await AsyncStorage.setItem(CART_KEY, id);

  /** 장바구니 담기 */
  const cartLinesAdd = useMutation({
    mutationFn: async () => {
      const lines = selectedVariants.map((v) => ({
        merchandiseId: v.id,
        quantity: v.quantity,
      }));

      let cartId = await getCartId();

      if (!cartId) {
        const res = await shopifySdk.cart.cartCreate({ lines, buyerIdentity: {email: user?.email} });
        cartId = res.cartCreate?.cart?.id || null;
        if (cartId) await setCartId(cartId);
      }

      if(cartId) {
        const res = await shopifySdk.cart.cartLinesAdd({
        cartId,
        lines,
        });
        const resCardId = res.cartLinesAdd?.cart?.id;
        if(resCardId && cartId !== resCardId) {
          setCartId(resCardId);
        }
        return res;
      }

      throw new Error();
    },
  });

  /** 바로구매 */
  const buyNow = useMutation({
    mutationFn: async () => {
      const lines = selectedVariants.map((v) => ({
        merchandiseId: v.id,
        quantity: v.quantity,
      }));
      const res = await shopifySdk.cart.cartCreate({ lines });
      return res.cartCreate?.cart?.checkoutUrl;
    },
  });

  return {
    selectedVariants,
    totalPrice,
    handleOptionSelect,
    updateQuantity,
    removeVariant,
    cartLinesAdd,
    buyNow,
  };
}
