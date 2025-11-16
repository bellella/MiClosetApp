import React, { useRef, useState } from "react";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { Box } from "@/components/ui/box";
import { useLayoutStore } from "@/lib/stores/layout.store";
import { Pressable } from "@/components/ui/pressable";
import { Image } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Image as ShopifyImage } from "@/lib/graphql/shopify.schema";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

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
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    ref.current?.scrollTo({ count: -1, animated: true });
  };

  const handleNext = () => {
    ref.current?.scrollTo({ count: 1, animated: true });
  };

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < imageUrls.length - 1;

  return (
    <Box className="relative items-center">
      {/* Carousel */}
      <Carousel
        ref={ref}
        width={maxContentWidth}
        height={maxContentWidth * PRODUCT_IMAGE_ASPECT_RATIO}
        data={imageUrls}
        loop={false}
        onProgressChange={progress}
        onSnapToItem={(index) => setCurrentIndex(index)}
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

      {/* Left Button - Only show if there's a previous item */}
      {hasPrevious && (
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
          <ChevronLeft color="white" size={20} />
        </Pressable>
      )}

      {/* Right Button - Only show if there's a next item */}
      {hasNext && (
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
          <ChevronRight color="white" size={20} />
        </Pressable>
      )}

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
