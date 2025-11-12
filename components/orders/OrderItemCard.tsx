import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./OrderStatusBadge";

export const OrderItemCard = ({ order }: { order: any }) => {
  const item = order.lineItems.edges[0]?.node;
  const price = parseFloat(order.totalPrice.amount).toLocaleString();

  return (
    <Box className="bg-white rounded-xl p-4 mb-4 border border-gray-100 shadow-sm">
      <HStack className="justify-between mb-2">
        <Text bold>order.processedA</Text>
        <OrderStatusBadge status={order.fulfillmentStatus} />
      </HStack>

      <HStack className="space-x-3">
        <Image
          source={{ uri: item?.variant?.image?.url }}
          className="w-20 h-24 rounded-md bg-gray-100"
        />
        <VStack className="flex-1">
          <Text numberOfLines={2} bold>{item?.title}</Text>
          <Text size="sm" className="text-gray-500 mt-1">
            {item?.variant?.title} | {item?.quantity}개
          </Text>
          <Text bold className="mt-2">{price}원</Text>
        </VStack>
      </HStack>

      <HStack className="mt-3 justify-between">
        <Button variant="outline" size="sm">배송조회</Button>
        <Button size="sm">주문상세</Button>
      </HStack>
    </Box>
  );
};
