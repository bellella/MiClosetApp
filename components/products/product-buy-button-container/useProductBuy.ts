import { useState, useEffect } from "react";
import { ProductOption } from "@/lib/graphql/shopify.schema";
import { ProductVariantItem } from "@/lib/graphql/types/product.type";
import { ProductVariantFragment } from "@/lib/graphql/products/products.graphql";
import { useMutation } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/lib/stores/auth.store";

/**
 * ProductBuyButtonWrapper 전용 훅
 * - 옵션 선택 관리
 * - 선택된 variants 관리
 * - 장바구니 추가 / 바로구매 처리
 */
export function useProductBuy(
  options: Pick<ProductOption, "name" | "values">[],
  variants: ProductVariantFragment[]
) {
  const {user} = useAuthStore();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariants, setSelectedVariants] = useState<ProductVariantItem[]>([]);

  /** 옵션 선택 */
  const handleOptionSelect = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  };

  /** 모든 옵션 선택 완료 시 variant 매칭 */
  useEffect(() => {
    const allSelected = options.every((opt) => selectedOptions[opt.name]);
    if (!allSelected) return;

    const matched = variants.find((v) =>
      v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
    );

    if (matched) {
      const exists = selectedVariants.some((item) => item.id === matched.id);
      if (!exists) {
        setSelectedVariants((prev) => [...prev, { ...matched, quantity: 1 }]);
      }
      setSelectedOptions({}); // 선택 초기화
    }
  }, [selectedOptions]);

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
  const CART_KEY = "shopify-cart-id";
  const getCartId = async () => await AsyncStorage.getItem(CART_KEY);
  const setCartId = async (id: string) => await AsyncStorage.setItem(CART_KEY, id);

  /** 장바구니 담기 */
  const addToCart = useMutation({
    mutationFn: async () => {
      const lines = selectedVariants.map((v) => ({
        merchandiseId: v.id,
        quantity: v.quantity,
      }));

      let cartId = await getCartId();

      if (!cartId) {
        const res = await shopifySdk.cart.CreateCart({ lines, buyerIdentity: {email: user?.email} });
        cartId = res.cartCreate?.cart?.id || null;
        if (cartId) await setCartId(cartId);
        return res.cartCreate?.cart;
      }

      const res = await shopifySdk.cart.AddToCart({
        cartId,
        lines,
      });

      return res.cartLinesAdd?.cart;
    },
  });

  /** 바로구매 */
  const buyNow = useMutation({
    mutationFn: async () => {
      const lines = selectedVariants.map((v) => ({
        merchandiseId: v.id,
        quantity: v.quantity,
      }));
      const res = await shopifySdk.cart.BuyNow({ lines });
      return res.cartCreate?.cart?.checkoutUrl;
    },
  });

  return {
    selectedOptions,
    selectedVariants,
    totalPrice,
    handleOptionSelect,
    updateQuantity,
    removeVariant,
    addToCart,
    buyNow,
  };
}
