// components/search/SearchFiltersContainer.tsx
import React, { useRef, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { AppActionSheet } from "../app/AppActionSheet";
import { Button } from "../common/Button";

export type SearchFilters = {
  sort: string;
  priceMin?: number | null;
  priceMax?: number | null;
  colors?: string[];
  categories?: string[];
  materials?: string[];
};

type Props = {
  onApplyFilters: (filters: SearchFilters) => void;
};

export function SearchFiltersContainer({ onApplyFilters }: Props) {
  const [open, setOpen] = useState(false);

  // 현재 선택된 필터 버튼 (scroll target)
  const [activeKey, setActiveKey] = useState<
    "sort" | "price" | "color" | "category" | "material"
  >("sort");

  const scrollRef = useRef<ScrollView>(null);

  // 각 섹션 위치 저장용 ref
  const sectionRefs = {
    sort: useRef<View>(null),
    price: useRef<View>(null),
    color: useRef<View>(null),
    category: useRef<View>(null),
    material: useRef<View>(null),
  };

  // 필터 상태
  const [filters, setFilters] = useState<SearchFilters>({
    sort: "recommended",
    colors: [],
    categories: [],
    materials: [],
    priceMin: null,
    priceMax: null,
  });

  // 필터 카운트
  const FILTER_TABS = [
    { key: "sort", label: "sort", count: 0 },
    {
      key: "price",
      label: "price",
      count: filters.priceMin || filters.priceMax ? 1 : 0,
    },
    { key: "options.color", label: "color", count: filters.colors!.length },
    { key: "category", label: "category", count: filters.categories!.length },
    { key: "material", label: "material", count: filters.materials!.length },
  ];

  const SORT_OPTIONS = [
    { label: "Recommended", value: "recommended" },
    { label: "Popular", value: "popular" },
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
  ];

  const COLOR_OPTIONS = [
    "black",
    "gray",
    "white",
    "brown",
    "beige",
    "Blue",
    "pink",
  ];

  const CATEGORY_OPTIONS = [
    "Top",
    "Bottom",
    "Shoes",
    "Outerwear",
    "Dresses",
    "Accessories",
  ];

  const MATERIAL_OPTIONS = [
    "Cotton",
    "Polyester",
    "Leather",
    "Knit",
    "Linen",
    "Fleece",
  ];

  const resetFilters = () => {
    setFilters({
      sort: "recommended",
      priceMin: null,
      priceMax: null,
      colors: [],
      categories: [],
      materials: [],
    });
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    setOpen(false);
  };

  // 🔥 액션시트 열리면 자동으로 해당 섹션으로 스크롤
  const handleOpenFilter = (key: typeof activeKey) => {
    setActiveKey(key);
    setOpen(true);

    setTimeout(() => {
      const section = sectionRefs[key].current;
      if (section && scrollRef.current) {
        section.measureLayout(
          scrollRef.current,
          (_, y) => {
            scrollRef.current?.scrollTo({ y, animated: true });
          },
          () => {}
        );
      }
    }, 120);
  };

  return (
    <>
      {/* 상단 버튼 */}
      <View className="flex-row flex-wrap gap-2 p-4">
        {FILTER_TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => handleOpenFilter(tab.label as any)}
            className="flex-row items-center rounded-full bg-gray-100 px-3 py-2"
          >
            <Text>
              {tab.label}
              {tab.count > 0 ? ` (${tab.count})` : ""}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ACTION SHEET */}
      <AppActionSheet isOpen={open} onClose={() => setOpen(false)}>
        <ScrollView ref={scrollRef} className="max-h-[85vh] p-4">
          {/* ---- Sort ---- */}
          <View ref={sectionRefs.sort} className="mb-8">
            <Text className="mb-3 text-lg font-bold">Sort</Text>
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => setFilters({ ...filters, sort: opt.value })}
                className="flex-row items-center py-2"
              >
                <View
                  className={`mr-3 h-5 w-5 rounded-full border ${
                    filters.sort === opt.value
                      ? "bg-primary"
                      : "border-gray-400"
                  }`}
                />
                <Text>{opt.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* ---- Price ---- */}
          <View ref={sectionRefs.price} className="mb-8">
            <Text className="mb-3 text-lg font-bold">Price</Text>

            <View className="flex-row items-center">
              <View className="mr-3 flex-1 rounded-lg border px-3 py-2">
                <Text>{filters.priceMin ?? "Min"}</Text>
              </View>
              <Text>~</Text>
              <View className="ml-3 flex-1 rounded-lg border px-3 py-2">
                <Text>{filters.priceMax ?? "Max"}</Text>
              </View>
            </View>
          </View>

          {/* ---- Color ---- */}
          <View ref={sectionRefs.color} className="mb-8">
            <Text className="mb-3 text-lg font-bold">Color</Text>
            <View className="flex-row flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => {
                const selected = filters.colors!.includes(color);
                return (
                  <Pressable
                    key={color}
                    onPress={() => {
                      const next = selected
                        ? filters.colors!.filter((c) => c !== color)
                        : [...filters.colors!, color];
                      setFilters({ ...filters, colors: next });
                    }}
                    className={`rounded-full border px-4 py-2 ${
                      selected ? "bg-primary text-white" : "border-gray-400"
                    }`}
                  >
                    <Text className={selected ? "text-white" : ""}>
                      {color}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ---- Category ---- */}
          <View ref={sectionRefs.category} className="mb-8">
            <Text className="mb-3 text-lg font-bold">Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((c) => {
                const selected = filters.categories!.includes(c);
                return (
                  <Pressable
                    key={c}
                    onPress={() => {
                      const next = selected
                        ? filters.categories!.filter((v) => v !== c)
                        : [...filters.categories!, c];
                      setFilters({ ...filters, categories: next });
                    }}
                    className={`rounded-lg border px-4 py-2 ${
                      selected ? "bg-primary text-white" : "border-gray-400"
                    }`}
                  >
                    <Text className={selected ? "text-white" : ""}>{c}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ---- Material ---- */}
          <View ref={sectionRefs.material} className="mb-16">
            <Text className="mb-3 text-lg font-bold">Material</Text>
            <View className="flex-row flex-wrap gap-2">
              {MATERIAL_OPTIONS.map((m) => {
                const selected = filters.materials!.includes(m);
                return (
                  <Pressable
                    key={m}
                    onPress={() => {
                      const next = selected
                        ? filters.materials!.filter((v) => v !== m)
                        : [...filters.materials!, m];
                      setFilters({ ...filters, materials: next });
                    }}
                    className={`rounded-lg border px-4 py-2 ${
                      selected ? "bg-primary text-white" : "border-gray-400"
                    }`}
                  >
                    <Text className={selected ? "text-white" : ""}>{m}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Bottom buttons */}
        <View className="w-full flex-row p-4">
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
