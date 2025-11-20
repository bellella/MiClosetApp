import { ScrollView, Pressable, View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, router } from "expo-router";
import { shopifySdk } from "@/lib/graphql/client";

export function CategoryHeader() {
  const { categoryId, subCategoryId } = useLocalSearchParams<{
    categoryId?: string;
    subCategoryId?: string;
  }>();
  if (!categoryId) {
    router.back();
  }

  // ─────────────── 상위 카테고리 ───────────────
  const { data: topData, isLoading: loadingTop } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await shopifySdk.categories.GetCategories();
      return res.menu?.items;
    },
  });

  const topCategories = topData ?? [];

  // ─────────────── 하위 카테고리 ───────────────
  const { data: subData } = useQuery({
    queryKey: ["subCategories", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const res = await shopifySdk.categories.GetSubCategories({
        id: categoryId,
      });
      return res?.collection?.metafield?.references?.nodes ?? [];
    },
  });

  const subCategories = subData ?? [];

  if (loadingTop) return null;

  // ─────────────── 네비게이션 함수 ───────────────
  const changeCategory = (newCategoryId?: string | null) => {
    router.setParams({
      categoryId: newCategoryId ?? undefined,
      subCategoryId: undefined, // 카테고리 바꾸면 서브는 초기화
    });
  };

  const changeSubCategory = (newSubId?: string | null) => {
    router.setParams({
      categoryId,
      subCategoryId: newSubId ?? undefined,
    });
  };

  return (
    <View className="bg-white">
      {/* ─────────────── Top Categories ─────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-gray-200"
      >
        {topCategories.map(({ resource: cat }) => {
          const selected = categoryId === cat?.id;

          return (
            <Pressable
              key={cat?.id}
              className="px-4 py-3"
              onPress={() => changeCategory(cat?.id)}
            >
              <Text
                className={`text-base ${
                  selected ? "font-bold text-black" : "text-gray-500"
                }`}
              >
                {cat?.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ─────────────── Sub Categories ─────────────── */}
      {categoryId && subCategories && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="border-b border-gray-200"
        >
          {/* ALL (sub categories) */}
          <Pressable
            className="px-4 py-3"
            onPress={() => changeSubCategory(null)}
          >
            <Text
              className={`text-base ${
                !subCategoryId ? "font-bold text-black" : "text-gray-500"
              }`}
            >
              All
            </Text>
          </Pressable>

          {subCategories.map((sub) => {
            const selected = subCategoryId === sub.id;

            return (
              <Pressable
                key={sub.id}
                className="px-4 py-3"
                onPress={() => changeSubCategory(sub.id)}
              >
                <Text
                  className={`text-base ${
                    selected ? "font-bold text-black" : "text-gray-700"
                  }`}
                >
                  {sub.title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
