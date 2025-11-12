import { useQuery, useMutation } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

export default function useCart() {
  const CART_KEY = "shopify-cart-id";

  /** 로컬 저장된 cartId 가져오기 */
  const getCartId = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(CART_KEY);
  };

  /** 새 cartId 저장 */
  const setCartId = async (id: string) => {
    await AsyncStorage.setItem(CART_KEY, id);
  };

  /** 장바구니 조회 */
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const id = await getCartId();
      if (!id) return null;
      const { cart } = await shopifySdk.cart.GetCartById({ id });
      return cart;
    },
  });

  /** 수량 변경 */
  const updateLine = useMutation({
    mutationFn: async ({
      lineId,
      quantity,
    }: {
      lineId: string;
      quantity: number;
    }) => {
      const id = await getCartId();
      if (!id) throw new Error("No cart found");
      return shopifySdk.cart.UpdateCartLine({
        cartId: id,
        lines: [{ id: lineId, quantity }],
      });
    },
    onSuccess: () => refetch(),
  });

  /** 항목 삭제 */
  const removeLine = useMutation({
    mutationFn: async (lineId: string) => {
      const id = await getCartId();
      if (!id) throw new Error("No cart found");
      return shopifySdk.cart.RemoveCartLine({ cartId: id, lineIds: [lineId] });
    },
    onSuccess: () => refetch(),
  });

  /** 구매 버튼 눌렀을 때 분기 */
  const handleCheckout = async () => {
    const checkoutUrl = data?.checkoutUrl;
    if (!checkoutUrl) return;

    const result = await WebBrowser.openAuthSessionAsync(checkoutUrl);
    console.log('result', result);
    alert(123);https://miicloset.myshopify.com/checkouts/cn/hWN53bas56EcKxfDSfV6W9LA/en-ca/thank-you
    if (result.type === "success" && result.url.includes("checkout/complete")) {
      router.push("/orders");
    }
    // if (Platform.OS === "web") {
    //   window.location.href = checkoutUrl;
    // } else {
    //   router.push(`/checkout/${encodeURIComponent(checkoutUrl)}`);
    // }
  };

  return {
    data,
    isLoading,
    isError,
    refetch,
    updateLine,
    removeLine,
    handleCheckout,
  };
}
