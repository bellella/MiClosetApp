import { AppContainer } from "@/components/app/app-container";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { FloatingButton } from "@/components/common/FloatingButton";
import { QuantitySelector } from "@/components/common/QuantitySelector";
import { useCart } from "./useCart";
import { PageLoading } from "@/components/common/PageLoading";
import { CheckoutWaitingAlert } from "@/components/common/CheckoutWaitingAlert";
import { useCheckout } from "@/lib/hooks/useCheckout";

export default function CartScreen() {
  const {
    data: cart,
    isLoading,
    isError,
    updateLineQuantity,
    removeLine,
    isCheckoutInProgress,
  } = useCart();
  const { handleCheckout } = useCheckout();

  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(
    new Set()
  );

  if (isLoading) {
    return (
      <AppContainer headerTitle="Cart" showBackButton>
        <PageLoading />
      </AppContainer>
    );
  }

  if (isError || !cart) {
    return (
      <AppContainer headerTitle="Cart" showBackButton>
        <VStack className="items-center py-20">
          <Text>Your cart is empty.</Text>
        </VStack>
      </AppContainer>
    );
  }

  const lines = cart.lines?.edges || [];
  const totalPrice = parseFloat(cart.estimatedCost?.totalAmount?.amount ?? "0");

  const allItemIds = lines.map(({ node }) => node.id);
  const isAllSelected =
    allItemIds.length > 0 && allItemIds.every((id) => selectedItems.has(id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(allItemIds));
    }
  };

  const toggleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach((itemId) => {
      removeLine.mutate(itemId);
    });
    setSelectedItems(new Set());
  };

  return (
    <>
      <AppContainer headerTitle="Cart" showBackButton>
        <VStack className="space-y-4 px-4 pb-20">
          {/* Select All / Delete */}
          <HStack className="items-center justify-between">
            <Pressable onPress={toggleSelectAll}>
              <HStack className="items-center space-x-2">
                <FontAwesome
                  name={isAllSelected ? "check-square" : "square-o"}
                  size={20}
                  color={isAllSelected ? "#000" : "#999"}
                />
                <Text>
                  Select All ({selectedItems.size}/{lines.length})
                </Text>
              </HStack>
            </Pressable>
            <Pressable
              onPress={handleDeleteSelected}
              disabled={selectedItems.size === 0}
            >
              <Text
                className={`text-sm ${selectedItems.size > 0 ? "text-red-500" : "text-gray-400"}`}
              >
                Delete Items
              </Text>
            </Pressable>
          </HStack>

          {/* Cart Items */}
          {lines.map(({ node }) => {
            const variant = node.merchandise;
            const product = variant.product;
            const price = parseFloat(variant.price.amount);
            return (
              <Box
                key={node.id}
                className="space-y-2 rounded-xl border border-gray-200 p-4"
              >
                <Pressable onPress={() => toggleSelectItem(node.id)}>
                  <FontAwesome
                    name={
                      selectedItems.has(node.id) ? "check-square" : "square-o"
                    }
                    size={20}
                    color={selectedItems.has(node.id) ? "#000" : "#999"}
                  />
                </Pressable>
                <HStack className="space-x-4">
                  <Image
                    source={{ uri: product.featuredImage?.url }}
                    className="h-32 w-24 rounded"
                    resizeMode="cover"
                  />
                  <VStack className="flex-1 space-y-1">
                    <HStack className="justify-between">
                      <Text bold>{product.vendor}</Text>
                      <Pressable onPress={() => removeLine.mutate(node.id)}>
                        <FontAwesome name="times" size={16} color="#999" />
                      </Pressable>
                    </HStack>
                    <Text size="sm" className="text-gray-600" numberOfLines={2}>
                      {product.title}
                    </Text>
                    <Text size="sm" className="text-gray-500">
                      {variant.title}
                    </Text>

                    {/* Price */}
                    <HStack className="items-center space-x-2">
                      <Text bold>${price.toLocaleString()}</Text>
                    </HStack>

                    {/* Quantity Selector */}
                    <QuantitySelector
                      quantity={node.quantity}
                      onChange={(newQty) =>
                        updateLineQuantity.mutate({
                          lineId: node.id,
                          quantity: newQty,
                        })
                      }
                    />

                    <Text className="mt-2 text-sm text-gray-400">
                      ${price.toLocaleString()} × {node.quantity} = $
                      {(price * node.quantity).toLocaleString()}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            );
          })}

          {/* Order Summary */}
          <Box className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
            <Text bold>Order Summary</Text>
            <HStack className="justify-between">
              <Text>Subtotal</Text>
              <Text>${totalPrice.toLocaleString()}</Text>
            </HStack>
            <HStack className="justify-between">
              <Text>Shipping</Text>
              <Text>Free</Text>
            </HStack>
            <Box className="border-t border-gray-200 pt-3">
              <HStack className="justify-between">
                <Text bold size="lg">
                  Total
                </Text>
                <Text bold size="lg" className="text-primary-600">
                  ${totalPrice.toLocaleString()}
                </Text>
              </HStack>
            </Box>
          </Box>
        </VStack>
      </AppContainer>

      <FloatingButton onPress={() => handleCheckout(cart.checkoutUrl)}>
        <Text className="text-base font-bold text-white">
          Checkout - ${totalPrice.toLocaleString()}
        </Text>
      </FloatingButton>
      <CheckoutWaitingAlert isOpen={isCheckoutInProgress} />
    </>
  );
}
