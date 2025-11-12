import React, { useRef, useEffect, useState } from "react";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { Box } from "@/components/ui/box";
import { useLayoutStore } from "@/lib/stores/layout.store";
import { Dimensions } from "react-native";
import { Image } from "react-native";

const banners = [
  { id: 1, image: require("#/images/banner1.webp") },
  { id: 2, image: require("#/images/banner2.webp") },
  { id: 3, image: require("#/images/banner3.webp") },
];

const MAX_WIDTH = 600;
const BANNER_RATIO = 9 / 16;

export function HomeBanner() {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);
  const { maxContentWidth } = useLayoutStore();
  const [carouselWidth, setCarouselWidth] = useState(MAX_WIDTH);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  useEffect(() => {
    const updateWidth = () => {
      const screenWidth = Dimensions.get("window").width;
      setCarouselWidth(Math.min(screenWidth, MAX_WIDTH));
    };

    const subscription = Dimensions.addEventListener("change", updateWidth);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Box className="items-center mt-4">
      <Carousel
        ref={ref}
        width={carouselWidth}
        height={carouselWidth * BANNER_RATIO}
        autoPlay
        autoPlayInterval={3000}
        data={banners}
        onProgressChange={progress}
        renderItem={({ item }) => (
          <Box className="overflow-hidden rounded-2xl mx-4">
            <Image
              source={item.image}
              style={{
                width: carouselWidth,
                height: carouselWidth,
                resizeMode: "cover",
              }}
            />
          </Box>
        )}
      />
      <Pagination.Basic
        progress={progress}
        data={banners}
        dotStyle={{
          backgroundColor: "rgba(0,0,0,0.3)",
          width: 8,
          height: 8,
          borderRadius: 50,
        }}
        containerStyle={{ marginTop: 10, gap: 6 }}
        onPress={onPressPagination}
      />
    </Box>
  );
}
