import { AppContainer } from "@/components/app/app-container";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { FloatingButton } from "@/components/common/FloatingButton";
import { router } from "expo-router";
import useCart from "./useCart";

export default function CartScreen() {
  const { data: cart, isLoading, isError, updateLine, removeLine, handleCheckout } = useCart();

  if (isLoading) {
    return (
      <AppContainer headerTitle="장바구니" showBackButton>
        <VStack className="py-20 items-center">
          <Text>불러오는 중...</Text>
        </VStack>
      </AppContainer>
    );
  }

  if (isError || !cart) {
    return (
      <AppContainer headerTitle="장바구니" showBackButton>
        <VStack className="py-20 items-center">
          <Text>장바구니가 비어있습니다.</Text>
        </VStack>
      </AppContainer>
    );
  }

  const lines = cart.lines?.edges || [];
  const totalPrice = parseFloat(cart.estimatedCost?.totalAmount?.amount ?? "0");

  return (
    <>
      <AppContainer headerTitle="장바구니" showBackButton>
        <VStack className="space-y-4 px-4 pb-20">
          {/* 전체 선택 / 삭제 */}
          <HStack className="justify-between items-center">
            <HStack className="items-center space-x-2">
              <FontAwesome name="check-square" size={20} />
              <Text>
                전체선택 ({lines.length}/{lines.length})
              </Text>
            </HStack>
            <Text className="text-sm text-gray-400">상품삭제</Text>
          </HStack>

          {/* 장바구니 리스트 */}
          {lines.map(({ node }) => {
            const variant = node.merchandise;
            const product = variant.product;
            const price = parseFloat(variant.price.amount);
            return (
              <Box
                key={node.id}
                className="border border-gray-200 rounded-xl p-4 space-y-2"
              >
                <FontAwesome name="check-square" size={20} />
                <HStack className="space-x-4">
                  <Image
                    source={{ uri: product.featuredImage?.url }}
                    className="w-24 h-32 rounded"
                    resizeMode="cover"
                  />
                  <VStack className="flex-1 space-y-1">
                    <HStack className="justify-between">
                      <Text bold>{product.vendor}</Text>
                      <Pressable onPress={() => removeLine.mutate(node.id)}>
                        <FontAwesome name="times" size={16} color="#999" />
                      </Pressable>
                    </HStack>
                    <Text size="sm" className="text-gray-600" numberOfLines={2}>
                      {product.title}
                    </Text>
                    <Text size="sm" className="text-gray-500">
                      {variant.title}
                    </Text>

                    {/* 가격 */}
                    <HStack className="space-x-2 items-center">
                      <Text bold>{price.toLocaleString()}원</Text>
                    </HStack>

                    {/* 수량 변경 */}
                    <HStack className="space-x-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2 h-8"
                        onPress={() =>
                          updateLine.mutate({
                            lineId: node.id,
                            quantity: Math.max(node.quantity - 1, 1),
                          })
                        }
                      >
                        <FontAwesome name="minus" size={14} />
                      </Button>

                      <Text className="mx-2">{node.quantity}</Text>

                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2 h-8"
                        onPress={() =>
                          updateLine.mutate({
                            lineId: node.id,
                            quantity: node.quantity + 1,
                          })
                        }
                      >
                        <FontAwesome name="plus" size={14} />
                      </Button>
                    </HStack>

                    <Text className="text-sm text-gray-400 mt-2">
                      상품 {price.toLocaleString()}원 × {node.quantity}개 ={" "}
                      {(price * node.quantity).toLocaleString()}원
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            );
          })}

          {/* 결제 예상 금액 */}
          <Box className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
            <Text bold>결제 예상 금액</Text>
            <HStack className="justify-between">
              <Text>상품금액</Text>
              <Text>{totalPrice.toLocaleString()}원</Text>
            </HStack>
            <HStack className="justify-between">
              <Text>배송비</Text>
              <Text>0원</Text>
            </HStack>
            <Box className="border-t border-gray-200 pt-3">
              <HStack className="justify-between">
                <Text bold>총 결제 금액</Text>
                <Text bold className="text-pink-500">
                  {totalPrice.toLocaleString()}원
                </Text>
              </HStack>
            </Box>
          </Box>
        </VStack>
      </AppContainer>

      <FloatingButton onPress={() => handleCheckout()}>
        <Text className="text-white font-bold text-base">
          {totalPrice.toLocaleString()}원 구매하기
        </Text>
      </FloatingButton>
    </>
  );
}
