import React from "react";
import { View, ActivityIndicator } from "react-native";

/**
 * Full-screen loading overlay component
 * - Shows a centered spinner with a semi-transparent white overlay
 * - Covers entire screen (100vh/100vw)
 */
export function PageLoading() {
  return (
    <View className="absolute h-full w-full bg-white/70 justify-center items-center z-50">
      <ActivityIndicator size="large" color="purple" />
    </View>
  );
}
