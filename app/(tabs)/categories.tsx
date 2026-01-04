import React, { useRef, useState, useEffect, useMemo } from "react";
import { ScrollView, View, Platform } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { AppContainer } from "@/components/app/app-container";
import { useCategories } from "@/lib/hooks/useCategories";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";
import { Collection } from "@/types";

export default function CategoieScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const sectionRefs = useRef<Record<string, any>>({});
  const { categories: originalCategories } = useCategories();

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

  if (isLoading || !categories) {
    return (
      <AppContainer headerTitle="카테고리" showBackButton={true}>
        <View className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </View>
      </AppContainer>
    );
  }

  return (
    <AppContainer headerTitle="Categories" showBackButton={true}>
      <View className="w-full flex-row">
        <ScrollView ref={scrollRef} className="flex-1 px-4">
          <View className="flex-col gap-6 py-4">
            {categories.map((category) => {
              const subCategories = category.metafield?.references?.nodes || [];

              return (
                <View key={category.id}>
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
