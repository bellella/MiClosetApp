import FontAwesome from "@expo/vector-icons/FontAwesome";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Dimensions } from "react-native";

import { useColorScheme } from "@/components/useColorScheme";
import { useLayoutStore } from "@/lib/stores/layout.store";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "@/components/app/AuthProvider";
import { expoTheme, expoThemeDark, expoThemeLight } from "@/theme/expoTheme";
import { Colors } from "@/theme/colors.generated";
import { useColors } from "@/lib/hooks/useColors";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [styleLoaded, setStyleLoaded] = useState(false);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  return <RootLayoutNav />;
}

// tanstack query client
const queryClient = new QueryClient();

function RootLayoutNav() {
  const { colorScheme } = useColors();
  const { updateMaxContentWidth } = useLayoutStore();

  useEffect(() => {
    updateMaxContentWidth();
    const subscription = Dimensions.addEventListener(
      "change",
      updateMaxContentWidth
    );
    return () => subscription.remove();
  }, []);

  return (
    <GluestackUIProvider mode={colorScheme}>
      <ThemeProvider
        value={expoTheme[colorScheme]}
      >
        <SafeAreaProvider>
          <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: 'var(--color-background)' }}>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(stack)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal" }}
                  />
                  <Stack.Protected guard={__DEV__}>
                    <Stack.Screen name="storybook" />
                  </Stack.Protected>
                </Stack>
              </AuthProvider>
            </QueryClientProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
