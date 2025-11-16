import { Platform } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

export function useCheckout() {
  const handleCheckout = async (checkoutUrl: string | undefined) => {
    if (!checkoutUrl) return;

    if (Platform.OS === "web") {
      router.push(`/checkout/web/${encodeURIComponent(checkoutUrl)}`);
    } else {
      router.push(`/checkout/app/${encodeURIComponent(checkoutUrl)}`);
    }
  };
  return {
    handleCheckout,
  };
}
