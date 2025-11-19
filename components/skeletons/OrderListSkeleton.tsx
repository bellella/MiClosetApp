import React from "react";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Skeleton } from "@/components/ui/skeleton";
import { View } from "@/components/Themed";

const OrderItemSkeleton = () => (
  <Box className="bg-white rounded-xl p-4 mb-4 border border-gray-100 shadow-sm">
    <HStack className="justify-between mb-2">
      <Skeleton className="h-4 w-32 rounded" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </HStack>

    <HStack className="gap-3">
      <Skeleton className="w-20 h-24 rounded-md" />
      <VStack className="flex-1 gap-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
        <Skeleton className="h-4 w-24 rounded mt-1" />
      </VStack>
    </HStack>

    <HStack className="mt-3 gap-2">
      <Skeleton className="h-9 flex-1 rounded-md" />
      <Skeleton className="h-9 flex-1 rounded-md" />
    </HStack>
  </Box>
);

export const OrderListSkeleton = () => {
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 80 }}>
      <OrderItemSkeleton />
      <OrderItemSkeleton />
      <OrderItemSkeleton />
    </View>
  );
};
