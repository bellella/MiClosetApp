import React, { useState } from "react";
import { Pressable } from "@/components/ui/pressable";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { cn } from "@/lib/utils/classnames";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { ProductOptionItem } from "@/types";

type Props = {
  options?: ProductOptionItem[];
  onSelect?: (options: Record<string, string>) => void;
};

export function OptionsSelector({ options = [], onSelect }: Props) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [openOptionIndex, setOpenOptionIndex] = useState<number | null>(0);
  const [lastSelectedOptionsIndex, setLastSelectedOptionsIndex] = useState<
    number | null
  >(null);

  const handleSelect = (optionName: string, value: string, index: number) => {
    const isLastOption = index === options.length - 1;
    const newSelectedOptions = { ...selectedOptions, [optionName]: value };
    if (isLastOption) {
      onSelect?.(newSelectedOptions);
      setOpenOptionIndex(null);
      setSelectedOptions({});
      setLastSelectedOptionsIndex(null);
    } else {
      setLastSelectedOptionsIndex(index);
      setSelectedOptions(newSelectedOptions);
      setOpenOptionIndex(index + 1);
    }
  };

  return (
    <View className="gap-y-4">
      {options.map((option, index) => {
        const selectedValue = selectedOptions[option.name];
        const isOpen = openOptionIndex === index;
        const isSelected = !!selectedValue;

        const disabled =
          index !== 0 && index > (lastSelectedOptionsIndex ?? -1) + 1;

        return (
          <Box key={option.name} className="">
            <Pressable
              onPress={() => setOpenOptionIndex(isOpen ? null : index)}
              disabled={disabled}
              className={cn(
                "w-full flex-row items-center justify-between border border-gray-300 bg-surface px-4 py-3",
                isOpen ? "rounded-b-0 rounded-t-lg" : "rounded-lg",
                disabled && "bg-gray-50 opacity-40"
              )}
            >
              <Text size="sm">
                {isSelected
                  ? `${option.name}: ${selectedValue}`
                  : `${option.name} 선택`}
              </Text>
              {isOpen ? (
                <ChevronUp size={20} color="#9CA3AF" />
              ) : (
                <ChevronDown size={20} />
              )}
            </Pressable>

            {isOpen && (
              <Box className="w-full overflow-hidden rounded-b-lg border border-t-0 border-gray-300 bg-white">
                {option.values.map((value) => {
                  const isSelected = selectedValue === value;
                  return (
                    <Pressable
                      key={value}
                      onPress={() => handleSelect(option.name, value, index)}
                      className={`w-full border-b border-gray-200 px-4 py-3 last:border-b-0 ${
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
