import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCheckout } from "@/lib/hooks/useCheckout";
import { CART_KEY } from "@/constants/common";
import { useState } from "react";

export default function useCart() {
  const queryClient = useQueryClient();
  const { handleCheckout } = useCheckout();
  const [isCheckoutInProgress, setIsCheckoutInProgress] = useState(false);

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

  /** 수량 변경 (Optimistic Update) */
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
      return shopifySdk.cart.cartLinesUpdate({
        cartId: id,
        lines: [{ id: lineId, quantity }],
      });
    },
    onMutate: async ({ lineId, quantity }) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // 이전 값 저장 (롤백용)
      const previousCart = queryClient.getQueryData(["cart"]);

      // Optimistic 업데이트
      queryClient.setQueryData(["cart"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          lines: {
            ...old.lines,
            edges: old.lines.edges.map((edge: any) => {
              if (edge.node.id === lineId) {
                return {
                  ...edge,
                  node: {
                    ...edge.node,
                    quantity,
                  },
                };
              }
              return edge;
            }),
          },
        };
      });

      // 롤백을 위해 이전 값 반환
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      // 성공/실패 여부와 관계없이 서버 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  /** 항목 삭제 */
  const removeLine = useMutation({
    mutationFn: async (lineId: string) => {
      const id = await getCartId();
      if (!id) throw new Error("No cart found");
      return shopifySdk.cart.cartLinesRemove({ cartId: id, lineIds: [lineId] });
    },
    onSuccess: () => refetch(),
  });

  return {
    data,
    isLoading,
    isError,
    updateLineQuantity: updateLine,
    removeLine,
    handleCheckout,
    isCheckoutInProgress,
  };
}
