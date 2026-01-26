import React, { useState } from "react";
import { View, Text } from "react-native";
import RangeSlider from "react-native-fast-range-slider";
import { usePriceRange } from "./usePriceRange";
import { Colors } from "@/theme/colors.generated";

type Props = {
  priceRangeFacet: Record<string, number> | undefined;
  priceMin: number | null | undefined;
  priceMax: number | null | undefined;
  onPriceChange: (min: number, max: number) => void;
};

export function PriceRangeFilter({
  priceRangeFacet,
  priceMin,
  priceMax,
  onPriceChange,
}: Props) {
  const priceRangeInfo = usePriceRange(priceRangeFacet);

  // 라벨링용 로컬 상태
  const [currentMin, setCurrentMin] = useState(
    priceMin ?? priceRangeInfo.min
  );
  const [currentMax, setCurrentMax] = useState(
    priceMax ?? priceRangeInfo.max
  );

  const handleValuesChange = (values: [number, number]) => {
    const [min, max] = values;
    setCurrentMin(min);
    setCurrentMax(max);
  };

  const handleValuesChangeFinish = (values: [number, number]) => {
    const [min, max] = values;
    onPriceChange(min, max);
  };

  if (!priceRangeFacet) return null;

  return (
    <View className="mb-8">
      <Text className="mb-3 text-lg font-bold text-typography-900">
        Price Range
      </Text>
      <Text className="mb-2 text-sm text-typography-600">
        Min: {currentMin.toLocaleString()}원
      </Text>
      <Text className="mb-2 text-sm text-typography-600">
        Max: {currentMax.toLocaleString()}원
      </Text>
      <RangeSlider
        initialMinValue={20}
        initialMaxValue={80}
        min={0}
        max={100}
        step={1}
        thumbSize={18}
        trackHeight={3}
        selectedTrackStyle={{
          backgroundColor: Colors.scheme.light.primary,
        }}
        pressedThumbStyle={{ transform: [{ scale: 1.5 }] }}
        allowOverlap={false}
        showThumbLines={false}
        onValuesChange={handleValuesChange}
        onValuesChangeFinish={handleValuesChangeFinish}
      />
    </View>
  );
}
