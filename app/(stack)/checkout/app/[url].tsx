import React, { useEffect } from "react";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";
import { AppContainer } from "@/components/app/app-container";

export default function CheckoutScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();

  if (!url) return null;

  const decodedUrl = decodeURIComponent(url);

  const handleNavigationStateChange = (navState: any) => {
    // Check if URL includes "thank-you" and redirect to orders page
    if (navState.url.includes("thank-you")) {
      router.replace("/orders");
    }
  };

  return (
    <WebView
      source={{ uri: decodedUrl }}
      startInLoadingState
      javaScriptEnabled
      domStorageEnabled
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
}
