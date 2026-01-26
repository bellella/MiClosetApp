// app/search/result.tsx
import React, { useEffect, useState } from "react";
import {
  View,
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
import { ProductListGrid } from "@/components/products/product-list/Grid";
import { ProductItem } from "@/types/product.type";
import { Button, ButtonText } from "@/components/ui/button";
import { AlgoliaProduct, useProductConverter } from "@/lib/hooks/useProductConverter";
import { PageLoading } from "@/components/common/loading/PageLoading";
import { Input, InputField } from "@/components/ui/input";

export default function SearchResultScreen() {
  const { algoliaToProductCards} = useProductConverter();
  const { keyword: initialKeyword } = useLocalSearchParams<{
    keyword: string;
  }>();

  const [keyword, setKeyword] = useState(initialKeyword || "");
  const [products, setProducts] = useState<ProductItem[]>([]);
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

    // Algolia 결과를 ProductItem으로 변환
    const productCards = algoliaToProductCards(res.hits as unknown as AlgoliaProduct[]);
    setProducts(productCards);
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
      <View className="flex-row items-center border-b border-gray-200 p-4 gap-2">

          <Input className="flex-1" size="sm">
            <InputField
              value={keyword}
              onChangeText={setKeyword}
              placeholder="Enter your search term"
              returnKeyType="search"
              onSubmitEditing={() => runSearch()}
            />
          </Input>

        <Button
                  size="sm"
                  variant="outline"
                  action="primary"
            onPress={() => runSearch()}
          >
            <ButtonText>Search</ButtonText>
          </Button>
      </View>

      {/* ----------------------------
           🔽 필터 (ActionSheet)
      ---------------------------- */}
      <SearchFiltersContainer
        facets={facets}
        onApplyFilters={(f) => runSearch(f)}
      />

      {loading ? (
        <PageLoading />
      ) : (
        <ProductListGrid products={products} />
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
