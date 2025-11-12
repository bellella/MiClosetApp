import React, { useRef } from "react";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { Box } from "@/components/ui/box";
import { useLayoutStore } from "@/lib/stores/layout.store";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Image } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Image as ShopifyImage } from "@/lib/graphql/shopify.schema";

type ProductImageCarouselProps = {
  imageUrls: Partial<ShopifyImage>[];
};

const PRODUCT_IMAGE_ASPECT_RATIO = 1;

export function ProductImageCarousel({
  imageUrls,
}: ProductImageCarouselProps) {
  const { maxContentWidth } = useLayoutStore();
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);

  const handlePrev = () => {
    ref.current?.scrollTo({ count: -1, animated: true });
  };

  const handleNext = () => {
    ref.current?.scrollTo({ count: 1, animated: true });
  };

  return (
    <Box className="relative items-center">
      {/* Carousel */}
      <Carousel
        ref={ref}
        width={maxContentWidth}
        height={maxContentWidth * PRODUCT_IMAGE_ASPECT_RATIO}
        data={imageUrls}
        onProgressChange={progress}
        renderItem={({ item }) => (
          <Box className="overflow-hidden rounded-2xl mx-4">
            <Image
              source={item.url ?? ''}
              alt={item.altText ?? 'Product Image'}
              style={{
                width: maxContentWidth,
                aspectRatio: PRODUCT_IMAGE_ASPECT_RATIO,
                resizeMode: "cover",
              }}
            />
          </Box>
        )}
      />

      {/* Left Button */}
      <Pressable
        onPress={handlePrev}
        style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: [{ translateY: -15 }],
          backgroundColor: "rgba(0,0,0,0.3)",
          borderRadius: 15,
          width: 30,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 20 }}>{'<'}</Text>
      </Pressable>

      {/* Right Button */}
      <Pressable
        onPress={handleNext}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: [{ translateY: -15 }],
          backgroundColor: "rgba(0,0,0,0.3)",
          borderRadius: 15,
          width: 30,
          height: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 20 }}>{'>'}</Text>
      </Pressable>

      {/* Pagination Indicator */}
      <Pagination.Basic
        progress={progress}
        data={imageUrls}
        dotStyle={{
          backgroundColor: "rgba(0,0,0,0.3)",
          width: 8,
          height: 8,
          borderRadius: 50,
        }}
        containerStyle={{
          marginTop: 10,
          gap: 6,
        }}
      />
    </Box>
  );
}
