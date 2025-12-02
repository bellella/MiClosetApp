// app/search/result.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TextInput,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  algolia,
  AlgoliaSearchParams,
  AlgoliaIndex,
} from "@/lib/algolia/client";
import { AppContainer } from "@/components/app/app-container";
import {
  SearchFilters,
  SearchFiltersContainer,
} from "@/components/search/search-filters-containers";

export default function SearchResultScreen() {
  const { keyword: initialKeyword } = useLocalSearchParams<{
    keyword: string;
  }>();

  const [keyword, setKeyword] = useState(initialKeyword || "");
  const [hits, setHits] = useState<any[]>([]);
  const [facets, setFacets] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runSearch = async (filters?: SearchFilters) => {
    setLoading(true);

    const searchParams: AlgoliaSearchParams = {
      index: (filters?.sort as AlgoliaIndex) || AlgoliaIndex.PRODUCTS,
      searchParams: {
        facetFilters: buildFacetFilters(filters),
        filters: buildNumericFilters(filters),
        facets: [
          "options.color",
          "options.size",
          "product_type",
          "price_range",
        ],
        distinct: true,
      },
    };

    const res = await algolia.search(keyword, searchParams);

    setHits(res.hits);
    setFacets(res.facets || {});
    setLoading(false);
  };

  useEffect(() => {
    runSearch();
  }, []);

  return (
    <AppContainer headerTitle="Search" showBackButton={true}>
      {/* ----------------------------  
           🔍 상단 검색창 추가
      ---------------------------- */}
      <View className="flex-row items-center border-b border-gray-200 p-4">
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder="검색어 입력"
          returnKeyType="search"
          onSubmitEditing={() => runSearch()}
          className="flex-1 rounded-lg border px-3 py-2"
        />

        <Pressable
          onPress={() => runSearch()}
          className="bg-primary ml-3 rounded-lg px-4 py-2"
        >
          <Text className="font-semibold text-white">검색</Text>
        </Pressable>
      </View>

      {/* ----------------------------
           🔽 필터 (ActionSheet)
      ---------------------------- */}
      <SearchFiltersContainer
        facets={facets}
        onApplyFilters={(f) => runSearch(f)}
      />

      {/* ---------------------------- */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={hits}
          keyExtractor={(item) => item.objectID}
          renderItem={({ item }) => (
            <View className="border-b border-gray-200 p-4">
              <Text className="font-semibold">{item.title}</Text>
              <Text className="text-gray-500">{item.vendor}</Text>
              {item.price && (
                <Text className="mt-1 font-medium">
                  {Number(item.price).toLocaleString()}원
                </Text>
              )}
            </View>
          )}
        />
      )}
    </AppContainer>
  );
}

/* ---------------------------------------------------
   ⭐ facetFilters builder (색/카테고리/소재)
   Algolia 구조: [ ["color:black", "color:white"], ["category:상의"] ]
--------------------------------------------------- */
function buildFacetFilters(filters?: SearchFilters) {
  if (!filters) return undefined;

  const facetFilters: any[] = [];

  if (filters.colors?.length) {
    facetFilters.push(filters.colors.map((c) => `options.color:${c}`));
  }

  if (filters.sizes?.length) {
    facetFilters.push(filters.sizes.map((s) => `options.size:${s}`));
  }

  if (filters.productTypes?.length) {
    facetFilters.push(filters.productTypes.map((p) => `product_type:${p}`));
  }

  return facetFilters.length > 0 ? facetFilters : undefined;
}

/* ---------------------------------------------------
   ⭐ Numeric filters (가격)
   facetFilters로는 불가 → filters로만 가능
   예: ["price>=10000", "price<=50000"]
--------------------------------------------------- */
function buildNumericFilters(filters?: SearchFilters) {
  if (!filters) return undefined;
  const numeric: string[] = [];

  if (filters.priceMin != null) numeric.push(`price>=${filters.priceMin}`);
  if (filters.priceMax != null) numeric.push(`price<=${filters.priceMax}`);

  if (!numeric.length) return undefined;
  return numeric.join(" AND ");
}
