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
import { Button, ButtonText } from "../ui/button";
import { Card } from "../ui/card";
import { formatDate, formatLocalDate } from "@/lib/utils/date.utils";

export const OrderItemCard = ({ order }: { order: Order | ShopifyOrder }) => {
  const router = useRouter();
  const price = parseFloat(order.totalPrice?.amount || "0").toLocaleString();
  const allItems = (order.lineItems as any)?.edges || [];
  const hasReviewableItems =
    "hasReviewableItems" in order ? order.hasReviewableItems : false;

  return (
    <Card>
      <HStack className="mb-2 justify-between">
        <Text bold>{formatLocalDate(order.processedAt)}</Text>
        <OrderStatusBadge status={order.fulfillmentStatus} />
      </HStack>
      {allItems.map((edge: any, index: number) => {
        const item = edge.node;
        return (
          <HStack key={item.id || index} className="mb-3 space-x-3">
            <Image
              source={{ uri: item?.image?.url }}
              className="h-24 w-20 rounded-md bg-gray-100"
            />
            <VStack className="flex-1">
              <Text numberOfLines={2} bold>
                {item?.title}
              </Text>
              <Text size="sm" className="mt-1 text-gray-500">
                {item?.variant?.title} | {item?.quantity} pcs
              </Text>
              <Text bold className="mt-2">
                ₩
                {parseFloat(
                  item?.originalTotalPrice?.amount || "0"
                ).toLocaleString()}
              </Text>
            </VStack>
          </HStack>
        );
      })}

      <Text bold className="mt-2 text-right">
        Total ₩{price}
      </Text>

      <HStack className="mt-3 gap-x-2">
        {/* <Pressable
          className="flex-1 items-center rounded-lg border border-gray-300 py-2"
          onPress={() => {}}
        >
          <Text size="sm">Track Delivery</Text>
        </Pressable>
        <Pressable
          className="flex-1 items-center rounded-lg border border-gray-300 py-2"
          onPress={() =>
            router.push(
              `/(stack)/(user)/orders/${encodeURIComponent(order.id)}`
            )
          }
        >
          <Text size="sm">Order Details</Text>
        </Pressable> */}
        {hasReviewableItems && (
          <Button
            action="primary"
            className="flex-1 items-center rounded-lg"
            onPress={() => router.push("/(stack)/(user)/reviews")}
          >
            <ButtonText size="sm">Write Review</ButtonText>
          </Button>
        )}
      </HStack>
    </Card>
  );
};
