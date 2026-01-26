import { ScrollView, Pressable, View, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useCategories, useSubCategories } from "@/lib/hooks/useCategories";
import { CustomScrollView } from "../common/CustomScrollView";

export function CategoryHeader() {
  const { categoryId, subCategoryId } = useLocalSearchParams<{
    categoryId?: string;
    subCategoryId?: string;
  }>();
  if (!categoryId) {
    router.back();
  }

  // ─────────────── 상위 카테고리 ───────────────
  const { categories: topCategories, isLoading: loadingTop } = useCategories();

  // ─────────────── 하위 카테고리 ───────────────
  const { subCategories } = useSubCategories(categoryId);

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
    <View>
      {/* ─────────────── Top Categories ─────────────── */}
      <CustomScrollView
        scrollVisible="hover"
        horizontal
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
      </CustomScrollView>

      {/* ─────────────── Sub Categories ─────────────── */}
      {categoryId && subCategories && (
        <CustomScrollView
          scrollVisible="hover"
          horizontal
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
        </CustomScrollView>
      )}
    </View>
  );
}
