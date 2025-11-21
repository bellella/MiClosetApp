import React, { useRef, useState, useEffect, useMemo } from "react";
import { ScrollView, View, Platform, ActivityIndicator } from "react-native";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { AppContainer } from "@/components/app/app-container";
import { cn } from "@/lib/utils/classnames";
import { CustomScrollView } from "@/components/common/CustomScrollView";
import { useCategories } from "@/lib/hooks/useCategories";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";
import { Collection } from "@/types";

export default function CategoryScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const sectionRefs = useRef<Record<string, any>>({});
  const { categories: originalCategories } = useCategories();
  const [selected, setSelected] = useState<string>("");

  // Extract category IDs
  const categoryIds = useMemo(() => {
    return originalCategories
      .filter((cat) => cat.resource?.__typename === "Collection")
      .map((cat) => cat.resource!.id as string);
  }, [originalCategories]);

  // Fetch all categories with subcategories
  const { data: categories, isLoading } = useQuery({
    queryKey: ["allCategories", categoryIds],
    queryFn: async () => {
      const res = await shopifySdk.categories.GetAllCategoriesByIds({
        ids: categoryIds,
      });
      return (res.nodes as Collection[]) ?? [];
    },
    enabled: categoryIds.length > 0,
  });

  // Set first category as selected when data loads
  useEffect(() => {
    if (categories && categories.length > 0 && !selected) {
      setSelected(categories[0].id);
    }
  }, [categories, selected]);

  const handleScrollTo = (key: string) => {
    const section = sectionRefs.current[key];
    if (!section) return;

    if (Platform.OS === "web") {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      section.measureLayout(
        scrollRef.current,
        (x: number, y: number) => {
          scrollRef.current?.scrollTo({ y, animated: true });
        },
        (error: any) => console.warn("measure error", error)
      );
    }

    setSelected(key);
  };

  if (isLoading || !categories) {
    return (
      <AppContainer headerTitle="카테고리" showBackButton={true}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      </AppContainer>
    );
  }

  return (
    <AppContainer headerTitle="카테고리" showBackButton={true}>
      <View className="w-full flex-row">
        {/* ✅ 고정된 왼쪽 메뉴 */}
        <View
          className="bg-muted z-50 w-[80px]"
          style={{
            position: Platform.OS === "web" ? "sticky" : "absolute",
            top: Platform.OS === "web" ? 50 : 0, // header 높이
            height: Platform.OS === "web" ? "calc(100vh - 100px)" : "100%",
          }}
        >
          <CustomScrollView>
            {categories.map((category) => {
              return (
                <Pressable
                  key={category.id}
                  onPress={() => handleScrollTo(category.id)}
                  className={cn(
                    "px-2 py-3",
                    selected === category.id && "bg-white"
                  )}
                >
                  <Text
                    size="sm"
                    bold={selected === category.id}
                    className={cn(
                      "text-center",
                      selected === category.id ? "text-primary" : "text-gray-500"
                    )}
                  >
                    {category.title}
                  </Text>
                </Pressable>
              );
            })}
          </CustomScrollView>
        </View>

        {/* ✅ 오른쪽 스크롤 영역 */}
        <ScrollView ref={scrollRef} className="flex-1 px-4">
          <View className="flex-col gap-6 py-4">
            {categories.map((category) => {
              const subCategories = category.metafield?.references?.nodes || [];

              return (
                <View
                  key={category.id}
                  ref={(ref) => {
                    if (ref) {
                      if (Platform.OS === "web") {
                        // @ts-ignore
                        sectionRefs.current[category.id] = ref?.ref || ref;
                      } else {
                        sectionRefs.current[category.id] = ref;
                      }
                    }
                  }}
                >
                  <Text className="text-primary mb-2 font-bold">
                    {category.title}
                  </Text>
                  <View className="flex-row flex-wrap">
                    {subCategories.map((subItem: any) => (
                      <Pressable
                        key={subItem.id}
                        className="w-1/2 flex-row items-center justify-between py-2"
                        onPress={() => {
                          router.push({
                            pathname: "/categories/products",
                            params: {
                              categoryId: category.id,
                              subCategoryId: subItem.id,
                            },
                          });
                        }}
                      >
                        <Text size="sm">{subItem.title}</Text>
                        <Text className="text-gray-400">›</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </AppContainer>
  );
}
