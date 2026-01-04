import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { shopifySdk } from "@/lib/graphql/client";

interface ReviewProductInfoProps {
  productId: string;
}

export const ReviewProductInfo = ({ productId }: ReviewProductInfoProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => shopifySdk.products.GetProductById({ id: productId }),
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <Box className="border-b border-gray-200 p-4">
        <Spinner size="small" />
      </Box>
    );
  }
  const product = data?.product;

  if (!product) {
    return null;
  }

  return (
    <Box className="border-b border-gray-200 bg-gray-50 p-4">
      <HStack className="gap-x-3">
        {product.images && (
          <Image
            source={{ uri: product.images.nodes[0].url }}
            className="h-16 w-16 rounded-lg"
          />
        )}
        <VStack className="flex-1 gap-y-1">
          <Text size="sm" numberOfLines={2} bold>
            {product.title}
          </Text>
          {product.vendor && (
            <Text size="xs" className="text-gray-500">
              {product.vendor}
            </Text>
          )}
          {product.price && (
            <Text size="sm" bold className="text-pink-500">
              {parseFloat(product.price).toLocaleString()}원
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};
