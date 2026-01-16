import React from "react";
import { View } from "@/components/Themed";
import { AppHeader } from "@/components/app/app-container/AppHeader";
import { Box } from "@/components/ui/box";
import { CustomScrollView } from "@/components/common/CustomScrollView";
import { cn } from "@/lib/utils/classnames";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface AppContainerProps {
  showHeaderLogo?: boolean;
  showBackButton?: boolean;
  headerTitle?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  showHeaderCart?: boolean;
  showHeaderSearch?: boolean;
  onPressCart?: () => void;
  disableScroll?: boolean;
  hasFloatButton?: boolean;
  children: React.ReactNode;
}

export function AppContainer({
  showHeaderLogo = false,
  showBackButton = false,
  headerTitle,
  headerLeft,
  headerRight,
  showHeaderCart = false,
  showHeaderSearch = false,
  onPressCart,
  disableScroll = false,
  hasFloatButton = false,
  children,
}: AppContainerProps) {
  return (
    <View className="flex-1">
      <AppHeader
        title={headerTitle}
        left={headerLeft}
        right={headerRight}
        showBackButton={showBackButton}
        showLogo={showHeaderLogo}
        showCart={showHeaderCart}
        showSearch={showHeaderSearch}
      />
      <Box className="w-screen flex-1 items-center">
        {disableScroll ? (
          <View className="w-full max-w-[600px] flex-1">{children}</View>
        ) : (
          <CustomScrollView
            className={cn("flex w-full max-w-[600px] flex-1", hasFloatButton ? "pb-20" : "")}
            scrollVisible="always"
          >
            <SafeAreaView>
            {children}
            </SafeAreaView>
          </CustomScrollView>
        )}
      </Box>
    </View>
  );
}
