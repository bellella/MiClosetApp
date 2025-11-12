import React, { useState } from "react";
import { Pressable } from "@/components/ui/pressable";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { ProductOption } from "@/lib/graphql/shopify.schema";

type Props = {
  options?: Pick<ProductOption, "name" | "values">[];
  onSelect?: (optionName: string, value: string) => void;
};

export function OptionsSelector({ options = [], onSelect }: Props) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [openOptionIndex, setOpenOptionIndex] = useState<number | null>(0);

  const handleSelect = (optionName: string, value: string, index: number) => {
    const newSelected = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newSelected);
    onSelect?.(optionName, value);
    setOpenOptionIndex(index + 1);
  };

  return (
    <View className="space-y-4">
      {options.map((option, index) => {
        const selectedValue = selectedOptions[option.name];
        const isVisible = openOptionIndex === index;
        const isCompleted = !!selectedValue;

        return (
          <Box key={option.name} className="space-y-2">
            <Pressable
              onPress={() => setOpenOptionIndex(index)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white flex-row justify-between items-center"
            >
              <Text size="sm">
                {isCompleted
                  ? `${option.name}: ${selectedValue}`
                  : `${option.name} 선택`}
              </Text>
              <Text className="text-gray-400">▼</Text>
            </Pressable>

            {isVisible && (
              <Box className="w-full border border-gray-300 rounded-lg bg-white">
                {option.values.map((value) => {
                  const isSelected = selectedValue === value;
                  return (
                    <Pressable
                      key={value}
                      onPress={() => handleSelect(option.name, value, index)}
                      className={`w-full px-4 py-3 border-b border-gray-200 ${
                        isSelected ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <Text>{value}</Text>
                    </Pressable>
                  );
                })}
              </Box>
            )}
          </Box>
        );
      })}
    </View>
  );
}
