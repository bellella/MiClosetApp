import React, { useRef } from "react";
import { Image, TouchableOpacity, View, Dimensions } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Text } from "@/components/ui/text";

const VISIBLE_ITEMS = 8;
const WRAPPER_WIDTH = 600;
const ITEM_WIDTH = WRAPPER_WIDTH / VISIBLE_ITEMS;

const categories = [
    { id: 1, label: "직진배송", image: require("#/images/icon-shoes.webp") },
    { id: 2, label: "슈즈", image: require("#/images/icon-shoes.webp") },
    { id: 3, label: "상의", image: require("#/images/icon-shoes.webp") },
    { id: 4, label: "원피스", image: require("#/images/icon-dress.webp") },
    { id: 5, label: "원피스", image: require("#/images/icon-dress.webp") },
    { id: 6, label: "원피스", image: require("#/images/icon-dress.webp") },
    { id: 7, label: "원피스", image: require("#/images/icon-dress.webp") },
    { id: 8, label: "원피스", image: require("#/images/icon-dress.webp") },
];

export function CategoryListSlider() {
    const ref = useRef<ICarouselInstance>(null);

    return (
        <Carousel
            ref={ref}
            loop={false}
            data={categories}
            width={ITEM_WIDTH}
            height={100}
            style={{
                width: WRAPPER_WIDTH,
            }}
            scrollAnimationDuration={300}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    activeOpacity={0.8}
                >
                    <View
                    >
                        <Image source={item.image} style={{ width: 64, height: 64 }} />
                    </View>
                    <Text size="xs">{item.label}</Text>
                </TouchableOpacity>
            )}
        />
    );
}
