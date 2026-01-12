import { ProductItem } from "@/types";
import { DimensionValue } from "react-native";
import { ProductCard } from ".";

type ProductCardSmallProps = {
  className?: string;
  product: ProductItem;

  onPress?: () => void;
  width?: DimensionValue;
};

export function ProductCardSmall({
  className,
  product,
  onPress,
  width,
}: ProductCardSmallProps) {
  return (
    <ProductCard
      product={product}
      fontSize="sm"
      showReview={false}
      showHeart={true}
      onPress={onPress}
      width={width}
      className={className}
    />
  );
}
