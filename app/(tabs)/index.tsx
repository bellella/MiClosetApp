import { AppContainer } from "@/components/app/app-container";
import { CategoryIconList } from "@/components/categories/category-icon-list";
import { HomeBanner } from "@/components/home/HomeBanner";
import { HomeCollections } from "@/components/home/HomeCollections";
import { Box } from "@/components/ui/box";
import React from "react";

export default function HomeScreen() {
  return (
    <AppContainer showHeaderLogo showHeaderCart showHeaderSearch>
      <Box className="space-y-8">
        <HomeBanner />
        <CategoryIconList />
        <HomeCollections />
      </Box>
    </AppContainer>
  );
}
