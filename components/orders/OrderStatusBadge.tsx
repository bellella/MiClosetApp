import React from "react";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";

const STATUS_LABELS: Record<string, string> = {
  FULFILLED: "배송완료",
  PARTIALLY_FULFILLED: "부분배송",
  UNFULFILLED: "배송준비중",
  CANCELED: "취소됨",
  REFUNDED: "환불완료",
};

const STATUS_COLORS: Record<string, string> = {
  FULFILLED: "bg-green-100 text-green-600",
  PARTIALLY_FULFILLED: "bg-yellow-100 text-yellow-700",
  UNFULFILLED: "bg-blue-100 text-blue-600",
  CANCELED: "bg-gray-100 text-gray-500",
  REFUNDED: "bg-red-100 text-red-600",
};

export const OrderStatusBadge = ({ status }: { status?: string }) => {
  const label = STATUS_LABELS[status ?? "UNFULFILLED"] ?? "처리중";
  const color = STATUS_COLORS[status ?? "UNFULFILLED"];
  return (
    <Box className={`px-2 py-1 rounded-full ${color}`}>
      <Text size="xs">{label}</Text>
    </Box>
  );
};
