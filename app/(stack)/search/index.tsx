// app/search/index.tsx
import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { AppContainer } from "@/components/app/app-container";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

export default function SearchScreen() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (!keyword.trim()) return;
    router.push({
      pathname: "/search/result",
      params: { keyword },
    });
  };

  return (
    <AppContainer headerTitle="Search" showBackButton={true}>
      <View className="p-4">
        <Text className="mb-4 text-xl font-bold">Search</Text>
        <View className="flex-row items-center gap-2">
          <Input className="flex-1" size="sm">
            <InputField
              value={keyword}
              onChangeText={setKeyword}
              placeholder="Enter your search term"
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </Input>

          <Button
          size="sm"
          variant="outline"
          action="primary"
            onPress={handleSearch}
          >
            <ButtonText>Search</ButtonText>
          </Button>
        </View>
      </View>
    </AppContainer>
  );
}
