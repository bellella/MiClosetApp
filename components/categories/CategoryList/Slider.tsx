import React, { useRef, useMemo } from "react";
import {
  Image,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";
import { Link } from "expo-router";
import { MenuItem } from "@/types";

const VISIBLE_ITEMS = 8;
const WRAPPER_WIDTH = 600;
const ITEM_WIDTH = WRAPPER_WIDTH / VISIBLE_ITEMS;

export function CategoryListSlider() {
  const ref = useRef<ICarouselInstance>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await shopifySdk.categories.GetCategories();
      return res.menu?.items as MenuItem[];
    },
  });

  if (isLoading) {
    return (
      <View
        style={{ height: 100, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!data?.length) {
    return null;
  }

  return (
    <Carousel
      ref={ref}
      loop={false}
      data={data}
      width={ITEM_WIDTH}
      height={100}
      style={{
        width: WRAPPER_WIDTH,
        paddingLeft: 10,
      }}
      scrollAnimationDuration={300}
      renderItem={({ item }) => {
        const category = item.resource!;
        return (
          <Link
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
              <Text size="xs">{item.title}</Text>
            </TouchableOpacity>
          </Link>
        );
      }}
    />
  );
}
