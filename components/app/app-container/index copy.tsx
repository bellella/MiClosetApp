import React from "react";
import { View } from "@/components/Themed";
import { AppHeader } from "@/components/app/app-container/AppHeader";
import { Box } from "@/components/ui/box";
import { CustomScrollView } from "@/components/common/CustomScrollView";

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
  children,
}: AppContainerProps) {
  if (disableScroll) {
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
          <View className="w-full max-w-[600px] flex-1 self-center bg-white">
            {children}
          </View>
        </Box>
      </View>
    );
  }

  return (
    <CustomScrollView stickyHeaderIndices={[0]} scrollVisible="always">
      <AppHeader
        title={headerTitle}
        left={headerLeft}
        right={headerRight}
        showBackButton={showBackButton}
        showLogo={showHeaderLogo}
        showCart={showHeaderCart}
        showSearch={showHeaderSearch}
      />
      <Box className="min-h-[calc(100vh-100px)] w-screen items-center">
        <View className="min-h-full w-full max-w-[600px] self-center bg-white">
          {children}
        </View>
      </Box>
    </CustomScrollView>
  );
}
