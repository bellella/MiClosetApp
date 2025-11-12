import React, { useRef } from "react";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { View } from "@/components/Themed";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import type { Product } from "@/types/products.type";
import { ProductListBase } from "@/components/products/product-collectoin/Base";

type ProductListSliderProps = {
    products: Product[];
    title: string;
    onPressMore?: () => void;
};

const WRAPPER_WIDTH = 600;
const VISIBLE_ITEMS = 4;
const ITEM_WIDTH = WRAPPER_WIDTH / VISIBLE_ITEMS;

export function ProductListSlider({ products, title, onPressMore }: ProductListSliderProps) {
    const ref = useRef<ICarouselInstance>(null);

    return (
        <ProductListBase title={title} onPressMore={onPressMore}>
                <Carousel
                    ref={ref}
                    loop={false}
                    data={products}
                    width={ITEM_WIDTH}
                    height={260}
                    style={{ maxWidth: WRAPPER_WIDTH, width: '100%', paddingLeft: 16 }}
                    scrollAnimationDuration={300}
                    renderItem={({ item }) => (
                        <Pressable className="w-[100%] pr-3">
                            <View className="w-full aspect-[5/6] rounded-md overflow-hidden bg-white">
                                <Image
                                    source={item.image}
                                    className="w-full h-full"
                                    resizeMode="contain"
                                />
                            </View>
                            <Text size="sm" bold numberOfLines={1} isTruncated className="mt-1">
                                {item.brand}
                            </Text>
                            <Text size="sm" numberOfLines={2} isTruncated className="text-gray-500">
                                {item.name}
                            </Text>
                            <Text size="sm" bold numberOfLines={1} isTruncated className="mt-1">
                                {item.price.toLocaleString()}원
                            </Text>
                        </Pressable>
                    )}
                />
        </ProductListBase>
    );
}
