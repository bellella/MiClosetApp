import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Feather } from "@expo/vector-icons";

type Props = {
  quantity: number;
  onChange: (newQty: number) => void;
};

export function QuantitySelector({ quantity, onChange }: Props) {
  return (
    <View className="flex-row items-center gap-x-3">
      <Pressable
        onPress={() => onChange(Math.max(quantity - 1, 1))}
        className="p-1 border border-gray-300 rounded-md"
      >
        <Feather name="minus" size={16} color="var(--color-on-surface)" />
      </Pressable>

      <Text className="min-w-[24px] text-center">{quantity}</Text>

      <Pressable
        onPress={() => onChange(quantity + 1)}
        className="p-1 border border-gray-300 rounded-md"
      >
        <Feather name="plus" size={16} color="var(--color-on-surface)" />
      </Pressable>
    </View>
  );
}
