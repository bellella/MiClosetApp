import { useQuery, useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { shopifySdk } from "@/lib/graphql/client";
import { useAuthStore } from "@/lib/stores/auth.store";

/** 로컬에 cartId가 저장되어 있으면 가져오기 */
async function getCartId() {
  return await AsyncStorage.getItem("cartId");
}

/** 새 cartId 저장 */
async function setCartId(id: string) {
  alert('set~~~'+id)
  await AsyncStorage.setItem("cartId", id);
}

export function useProductDetail(id: string) {
  const { user } = useAuthStore();
  /** 상품 상세 */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => shopifySdk.products.GetProductById({ id }),
    enabled: !!id,
  });

  /** 장바구니 담기 */
  const addToCart = useMutation({
    mutationFn: async ({
      variantId,
      quantity,
    }: {
      variantId: string;
      quantity: number;
    }) => {
      let cartId = await getCartId();
      if (!cartId) {
        // cart 없으면 새로 생성
        const { cartCreate } = await shopifySdk.cart.CreateCart({
          lines: [{ merchandiseId: variantId, quantity }],
          buyerIdentity: user ? { email: user.email } : undefined,
        });
        cartId = cartCreate?.cart?.id || null;
        if (cartId) await setCartId(cartId);
        return cartCreate?.cart;
      }

      // 기존 cart에 추가
      const res = await shopifySdk.cart.AddToCart({
        cartId,
        lines: [{ merchandiseId: variantId, quantity }],
      });
      return res.cartLinesAdd?.cart;
    },
  });

  /** 바로구매 */
  const buyNow = useMutation({
    mutationFn: async ({
      variantId,
      quantity,
    }: {
      variantId: string;
      quantity: number;
    }) => {
      const { cartCreate } = await shopifySdk.cart.CreateCart({
        lines: [{ merchandiseId: variantId, quantity }],
        buyerIdentity: user ? { email: user.email } : undefined,
      });
      const checkoutUrl = cartCreate?.cart?.checkoutUrl;
      return checkoutUrl;
    },
  });

  return {
    data: data?.product,
    isLoading,
    isError,
    addToCart,
    buyNow,
  };
}
