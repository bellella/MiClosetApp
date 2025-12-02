import { useMemo } from "react";

type PriceRangeInfo = {
  min: number;
  max: number;
  step: number;
};

export function usePriceRange(
  priceRangeFacet: Record<string, number> | undefined
): PriceRangeInfo {
  return useMemo(() => {
    if (!priceRangeFacet) return { min: 0, max: 1000000, step: 10000 };

    let minPrice = Infinity;
    let maxPrice = 0;

    Object.keys(priceRangeFacet).forEach((range) => {
      const [min, max] = range.split(":").map(Number);
      if (min < minPrice) minPrice = min;
      if (max > maxPrice) maxPrice = max;
    });

    return {
      min: minPrice === Infinity ? 0 : minPrice,
      max: maxPrice === 0 ? 1000000 : maxPrice,
      step: Math.ceil((maxPrice - minPrice) / 20) || 10000,
    };
  }, [priceRangeFacet]);
}
