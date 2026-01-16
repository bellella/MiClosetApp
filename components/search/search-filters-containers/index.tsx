// components/search/SearchFiltersContainer.tsx
import React, { useRef, useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { AppActionSheet } from "../../app/AppActionSheet";
import { AlgoliaIndex } from "@/lib/algolia/client";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from "@/components/ui/radio";
import { Circle } from "lucide-react-native";
import { CustomScrollView } from "@/components/common/CustomScrollView";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { Button, ButtonText } from "@/components/ui/button";

export type SearchFilters = {
  sort: string;
  priceMin?: number | null;
  priceMax?: number | null;
  colors?: string[];
  sizes?: string[];
  productTypes?: string[];
};

type Props = {
  facets: Record<string, Record<string, number>>;
  onApplyFilters: (filters: SearchFilters) => void;
};

// Mapping for display names
const FACET_DISPLAY_NAMES: Record<string, string> = {
  "options.color": "Color",
  "options.size": "Size",
  product_type: "Type",
  price_range: "Price Range",
};

// Helper functions
const getFacetKey = (facetName: string): keyof SearchFilters | null => {
  const mapping: Record<string, keyof SearchFilters> = {
    "options.color": "colors",
    "options.size": "sizes",
    product_type: "productTypes",
  };
  return mapping[facetName] || null;
};

export function SearchFiltersContainer({ facets, onApplyFilters }: Props) {
  const [open, setOpen] = useState(false);

  // 필터 상태
  const [filters, setFilters] = useState<SearchFilters>({
    sort: AlgoliaIndex.PRODUCTS,
    colors: [],
    sizes: [],
    productTypes: [],
    priceMin: null,
    priceMax: null,
  });

  const getFilterCount = useCallback(
    (facetName: string): number => {
      const key = getFacetKey(facetName);
      if (!key) return 0;
      const value = filters[key];
      return Array.isArray(value) ? value.length : 0;
    },
    [filters]
  );

  const FILTER_TABS = [
    { key: "sort", label: "Sort", count: 0 },
    ...(facets["price_range"]
      ? [
          {
            key: "price",
            label: "Price",
            count: filters.priceMin || filters.priceMax ? 1 : 0,
          },
        ]
      : []),
    ...Object.keys(facets)
      .filter((facetName) => facetName !== "price_range")
      .map((facetName) => ({
        key: facetName,
        label: FACET_DISPLAY_NAMES[facetName] || facetName,
        count: getFilterCount(facetName),
      })),
  ];

  const SORT_OPTIONS = [
    { label: "Featured", value: AlgoliaIndex.PRODUCTS },
    { label: "Popular", value: AlgoliaIndex.PRODUCTS_POPULAR },
    { label: "Newest", value: AlgoliaIndex.PRODUCTS_NEWEST },
    { label: "Price: Low to High", value: AlgoliaIndex.PRODUCTS_PRICE_ASC },
    { label: "Price: High to Low", value: AlgoliaIndex.PRODUCTS_PRICE_DESC },
  ];

  const resetFilters = useCallback(() => {
    const newFilters: SearchFilters = {
      sort: AlgoliaIndex.PRODUCTS,
      priceMin: null,
      priceMax: null,
      colors: [],
      sizes: [],
      productTypes: [],
    };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  }, [onApplyFilters]);

  const applyFilters = useCallback(() => {
    onApplyFilters(filters);
    setOpen(false);
  }, [filters, onApplyFilters]);

  const handleOpenFilter = useCallback((key: string) => {
    setOpen(true);
  }, []);

  const toggleFacetValue = useCallback(
    (facetName: string, value: string) => {
      const key = getFacetKey(facetName);
      if (!key) return;

      const currentValues = (filters[key] as string[]) || [];
      const isSelected = currentValues.includes(value);

      const newFilters = {
        ...filters,
        [key]: isSelected
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };

      setFilters(newFilters);
      onApplyFilters(newFilters);
    },
    [filters, onApplyFilters]
  );

  const setSortOption = useCallback(
    (sortValue: string) => {
      const newFilters = { ...filters, sort: sortValue };
      setFilters(newFilters);
      onApplyFilters(newFilters);
    },
    [filters, onApplyFilters]
  );

  const handlePriceChange = useCallback(
    (min: number, max: number) => {
      const newFilters = { ...filters, priceMin: min, priceMax: max };
      setFilters(newFilters);
      onApplyFilters(newFilters);
    },
    [filters, onApplyFilters]
  );

  return (
    <>
      {/* 상단 버튼 */}
      <View className="flex-row flex-wrap  p-4">
        {FILTER_TABS.map((tab) => (
          <Button
          className="mr-2"
          size="sm"
          variant="chip"
            key={tab.key}
            onPress={() => handleOpenFilter(tab.key)}
          >
            <ButtonText>
              {tab.label}
              {tab.count > 0 ? ` (${tab.count})` : ""}
            </ButtonText>
          </Button>
        ))}
      </View>

      {/* ACTION SHEET */}
      <AppActionSheet isOpen={open} onClose={() => setOpen(false)}>
        <View className="w-full px-3 pt-5">
          <CustomScrollView className="h-[80vh]">
            {/* ---- Sort ---- */}
            <View className="mb-8">
              <Text className="mb-3 text-lg font-bold text-typography-900">
                Sort
              </Text>
              <RadioGroup value={filters.sort} onChange={setSortOption}>
                {SORT_OPTIONS.map((opt) => (
                  <Radio key={opt.value} value={opt.value} className="py-2">
                    <RadioIndicator>
                      <RadioIcon as={Circle} />
                    </RadioIndicator>
                    <RadioLabel className="text-typography-900">
                      {opt.label}
                    </RadioLabel>
                  </Radio>
                ))}
              </RadioGroup>
            </View>

            {/* ---- Price Range ---- */}
            <PriceRangeFilter
              priceRangeFacet={facets["price_range"]}
              priceMin={filters.priceMin}
              priceMax={filters.priceMax}
              onPriceChange={handlePriceChange}
            />

            {/* ---- Dynamic Facets ---- */}
            {Object.entries(facets).map(([facetName, facetValues]) => {
              if (facetName === "price_range") return null;

              const key = getFacetKey(facetName);
              if (!key) return null;

              const selectedValues = (filters[key] as string[]) || [];

              return (
                <View key={facetName} className="mb-8">
                  <Text className="mb-3 text-lg font-bold text-typography-900">
                    {FACET_DISPLAY_NAMES[facetName] || facetName}
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {Object.entries(facetValues).map(([value, count]) => {
                      const isSelected = selectedValues.includes(value);
                      return (
                        <Pressable
                          key={value}
                          onPress={() => toggleFacetValue(facetName, value)}
                          className={`rounded-full border-2 px-4 py-2 ${
                            isSelected
                              ? "border-primary-600 bg-primary-600"
                              : "border-outline-300 bg-background-0"
                          }`}
                        >
                          <Text
                            className={
                              isSelected
                                ? "font-medium text-typography-0"
                                : "text-typography-700"
                            }
                          >
                            {value} ({count})
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </CustomScrollView>
        </View>
        {/* Bottom buttons */}
        <View className="w-full flex-row gap-2 p-4">
          <Button className="flex-1" variant="outline" onPress={resetFilters}>
            Reset
          </Button>
          <Button className="flex-1" onPress={applyFilters}>
            Apply
          </Button>
        </View>
      </AppActionSheet>
    </>
  );
}
