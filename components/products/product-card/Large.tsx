import { CollectionProduct } from "@/types";
import { DimensionValue } from "react-native";
import { ProductCard } from ".";

type ProductCardLargeProps = {
  className?: string;
  product: CollectionProduct;
  onPress?: () => void;
  width?: DimensionValue;
};

export function ProductCardLarge({
  className,
  product,
  onPress,
  width,
}: ProductCardLargeProps) {
  return (
    <ProductCard
      product={product}
      fontSize="md"
      showReview={true}
      showHeart={true}
      onPress={onPress}
      width={width}
      className={className}
    />
  );
}
