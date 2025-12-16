import { AppContainer } from "@/components/app/app-container";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { shopifyGetOrderById } from "@/lib/api/generated/shopify/shopify";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView } from "react-native";
import { Image } from "@/components/ui/image";
import { Order } from "@/lib/graphql/shopify.schema";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: orderData, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => shopifyGetOrderById(encodeURIComponent(id)!),
    enabled: !!id,
  });

  const order = orderData as unknown as Order;

  if (isLoading || !order) {
    return (
      <AppContainer headerTitle="주문상세" showBackButton>
        <Box className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </Box>
      </AppContainer>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear().toString().slice(2)}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <AppContainer headerTitle="주문상세" showBackButton>
      <ScrollView className="flex-1">
        <VStack className="gap-y-6 p-4">
          {/* Order Header */}
          <VStack className="gap-y-2">
            <Text size="2xl" bold>
              {formatDate(order.processedAt)} 결제
            </Text>
            <Text size="sm" className="text-gray-500">
              (주문번호 {order.name})
            </Text>
          </VStack>

          {/* Order Status */}
          <VStack className="gap-y-2 rounded-lg bg-gray-50 p-4">
            <HStack className="justify-between">
              <Text size="sm" className="text-gray-600">
                배송비
              </Text>
              <Text size="sm" bold>
                무료
              </Text>
            </HStack>
          </VStack>

          {/* Order Items */}
          {order?.lineItems?.edges?.map((edge: any) => {
            const item = edge.node;
            return (
              <VStack
                key={item.id}
                className="gap-y-4 border-b border-gray-200 pb-4"
              >
                <Text size="md" bold className="text-green-600">
                  구매확정
                </Text>

                <HStack className="gap-x-3">
                  {item.variant?.image && (
                    <Image
                      source={{ uri: item.variant.image.url }}
                      className="h-20 w-20 rounded-lg"
                      alt={item.title}
                    />
                  )}
                  <VStack className="flex-1 gap-y-1">
                    <Text size="sm" numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text size="xs" className="text-gray-500">
                      {item.variant?.title} / {item.quantity}개
                    </Text>
                    <Text size="sm" bold>
                      {parseInt(
                        item.originalTotalPrice.amount
                      ).toLocaleString()}
                      원
                    </Text>
                  </VStack>
                </HStack>

                <HStack className="gap-x-2">
                  <Box className="flex-1 items-center rounded-lg border border-gray-300 py-3">
                    <Text size="sm">배송현황</Text>
                  </Box>
                  <Box className="flex-1 items-center rounded-lg border border-gray-300 py-3">
                    <Text size="sm">문의하기</Text>
                  </Box>
                </HStack>
              </VStack>
            );
          })}

          {/* Shipping Info */}
          <VStack className="gap-y-4">
            <Text size="lg" bold>
              배송 정보
            </Text>

            <VStack className="gap-y-3">
              <HStack className="justify-between">
                <Text size="sm" className="text-gray-600">
                  수령인
                </Text>
                <Text size="sm">최*나</Text>
              </HStack>

              <HStack className="justify-between">
                <Text size="sm" className="text-gray-600">
                  휴대폰
                </Text>
                <Text size="sm">010-****-9976</Text>
              </HStack>

              <HStack className="items-start justify-between">
                <Text size="sm" className="text-gray-600">
                  주소
                </Text>
                <Text size="sm" className="flex-1 text-right">
                  [13368] 경기 성남시 중원구 제일로 55 (성남동, 대동다숲아파트)
                  대동다숲아파트 1003호
                </Text>
              </HStack>
            </VStack>
          </VStack>

          {/* Payment Info */}
          <VStack className="gap-y-4">
            <Text size="lg" bold>
              결제 내역
            </Text>

            <VStack className="gap-y-3">
              <HStack className="justify-between">
                <Text size="sm" className="text-gray-600">
                  상품 금액
                </Text>
                <Text size="sm">
                  {parseFloat(
                    order?.totalPrice?.amount || "0"
                  ).toLocaleString()}
                  원
                </Text>
              </HStack>

              <HStack className="justify-between">
                <Text size="sm" className="text-gray-600">
                  쿠폰 할인
                </Text>
                <Text size="sm">-2,000원</Text>
              </HStack>

              <HStack className="items-start justify-between">
                <Text size="xs" className="ml-4 text-gray-500">
                  ㄴ 미니뽕 신규고객 쿠폰 (직진배송 상품 포함)
                </Text>
                <Text size="xs" className="text-gray-500">
                  2,000원
                </Text>
              </HStack>

              <Box className="my-2 h-px bg-gray-200" />

              <HStack className="justify-between">
                <Text size="lg" bold>
                  총 결제 금액
                </Text>
                <Text size="lg" bold className="text-pink-500">
                  {(
                    parseFloat(order?.totalPrice?.amount || "0") - 2000
                  ).toLocaleString()}
                  원
                </Text>
              </HStack>

              <Text size="xs" className="text-right text-gray-500">
                카카오페이
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </AppContainer>
  );
}
