import React, { useRef, useEffect, useState } from "react";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { Box } from "@/components/ui/box";
import { useLayoutStore } from "@/lib/stores/layout.store";
import { Image } from "react-native";
import { useColors } from "@/lib/hooks/useColors";

const banners = [
  { id: 1, image: require("#/images/banner1.webp") },
  { id: 2, image: require("#/images/banner2.webp") },
  { id: 3, image: require("#/images/banner3.webp") },
];

//const MAX_WIDTH = 600;
const BANNER_RATIO = 9 / 16;

export function HomeBanner() {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);
  const { maxContentWidth } = useLayoutStore();
  const { colors } = useColors();
  //const [carouselWidth, setCarouselWidth] = useState(MAX_WIDTH);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  // useEffect(() => {
  //   const updateWidth = () => {
  //     const screenWidth = Dimensions.get("window").width;
  //     console.log(screenWidth,'screenWidth');
  //     setCarouselWidth(Math.min(screenWidth, MAX_WIDTH));
  //   };

  //   const subscription = Dimensions.addEventListener("change", updateWidth);

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);
  return (
    <Box className="items-center mt-4">
      <Carousel
        ref={ref}
        width={maxContentWidth}
        height={maxContentWidth * BANNER_RATIO}
        autoPlay={false}
        autoPlayInterval={3000}
        data={banners}
        onProgressChange={progress}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        renderItem={({ item }) => (
          <Image
            className="overflow-hidden rounded-2xl"
            source={item.image}
            style={{
              width: '100%',
              height: '100%',
              //height: carouselWidth * BANNER_RATIO,
              resizeMode: "cover",
            }}
          />
        )}
      />
      <Pagination.Basic
        progress={progress}
        data={banners}
        dotStyle={{
          backgroundColor: 'gray',
          width: 8,
          height: 8,
          borderRadius: 50,
        }}
        activeDotStyle={{
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        }}
        containerStyle={{ marginTop: 10, gap: 6 }}
        onPress={onPressPagination}
      />
    </Box>
  );
}
