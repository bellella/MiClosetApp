import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { ShopifyOrder } from "@/lib/api/model";
import { Order } from "@/lib/graphql/shopify.schema";
import { useRouter } from "expo-router";
import { Pressable } from "@/components/ui/pressable";

export const OrderItemCard = ({ order }: { order: Order | ShopifyOrder }) => {
  const router = useRouter();
  const price = parseFloat(order.totalPrice?.amount || "0").toLocaleString();
  const allItems = (order.lineItems as any)?.edges || [];
  const hasReviewableItems = 'hasReviewableItems' in order ? order.hasReviewableItems : false;

  return (
    <Box className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <HStack className="mb-2 justify-between">
        <Text bold>{order.processedAt}</Text>
        <OrderStatusBadge status={order.fulfillmentStatus} />
      </HStack>

      {/* Render all items */}
      {allItems.map((edge: any, index: number) => {
        const item = edge.node;
        return (
          <HStack key={item.id || index} className="space-x-3 mb-3">
            <Image
              source={{ uri: item?.variant?.image?.url }}
              className="h-24 w-20 rounded-md bg-gray-100"
            />
            <VStack className="flex-1">
              <Text numberOfLines={2} bold>
                {item?.title}
              </Text>
              <Text size="sm" className="mt-1 text-gray-500">
                {item?.variant?.title} | {item?.quantity}개
              </Text>
              <Text bold className="mt-2">
                {parseFloat(item?.originalTotalPrice?.amount || "0").toLocaleString()}원
              </Text>
            </VStack>
          </HStack>
        );
      })}

      <Text bold className="mt-2 text-right">
        총 {price}원
      </Text>

      <HStack className="mt-3 gap-x-2">
        <Pressable
          className="flex-1 items-center rounded-lg border border-gray-300 py-2"
          onPress={() => {}}
        >
          <Text size="sm">배송조회</Text>
        </Pressable>
        <Pressable
          className="flex-1 items-center rounded-lg border border-gray-300 py-2"
          onPress={() => router.push(`/(stack)/(user)/orders/${encodeURIComponent(order.id)}`)}
        >
          <Text size="sm">주문상세</Text>
        </Pressable>
        {hasReviewableItems && (
          <Pressable
            className="flex-1 items-center rounded-lg bg-pink-500 py-2"
            onPress={() => router.push("/(stack)/(user)/reviews")}
          >
            <Text size="sm" className="text-white">리뷰 쓰기</Text>
          </Pressable>
        )}
      </HStack>
    </Box>
  );
};
