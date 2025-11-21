import React from "react";
import { Image, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { useCategories } from "@/lib/hooks/useCategories";
import { CustomScrollView } from "@/components/common/CustomScrollView";

export function CategoryIconList() {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <View
        style={{ height: 100, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <CustomScrollView
      scrollVisible="hover"
      horizontal
      contentContainerStyle={{ paddingHorizontal: 10, gap: 16 }}
    >
      {categories.map((item) => {
        const category = item.resource!;
        return (
          <Link
            key={item.id}
            href={{
              pathname: "/categories/products",
              params: {
                categoryId: category.id,
              },
            }}
            asChild
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 75,
              }}
              activeOpacity={0.8}
            >
              <View className="h-16 w-16">
                {category.image?.url ? (
                  <Image
                    source={{ uri: category.image.url }}
                    style={{ width: 64, height: 64, borderRadius: 32 }}
                  />
                ) : (
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      backgroundColor: "#f0f0f0",
                    }}
                  />
                )}
              </View>
              <Text size="xs" className="mt-1 text-center">
                {item.title}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </CustomScrollView>
  );
}
