// app/search/index.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { AppContainer } from "@/components/app/app-container";
import { Button, ButtonText } from "@/components/ui/button";

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
        <View className="flex-row items-center">
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Enter your search term"
            className="flex-1 rounded-md border px-3 py-2 mr-2"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />

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
