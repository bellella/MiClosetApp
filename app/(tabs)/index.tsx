import { AppContainer } from "@/components/app/app-container";
import { CategoryListSlider } from "@/components/categories/CategoryList/Slider";
import { HomeBanner } from "@/components/home/HomeBanner";
import { HomeCollections } from "@/components/home/HomeCollections";
import { Box } from "@/components/ui/box";
import React from "react";

export default function HomeScreen() {
  return (
    <AppContainer showHeaderLogo showHeaderCart showHeaderSearch>
      <Box className="space-y-8">
        <HomeBanner />
        <CategoryListSlider />
        <HomeCollections />
      </Box>
    </AppContainer>
  );
}