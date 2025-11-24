// app/search/index.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { AppContainer } from "@/components/app/app-container";

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
      <View className="flex-1 bg-white p-4">
        <Text className="mb-4 text-xl font-bold">Search</Text>

        <View className="flex-row items-center">
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="검색어를 입력하세요"
            className="flex-1 rounded-lg border px-3 py-2"
          />

          <TouchableOpacity
            onPress={handleSearch}
            className="ml-3 rounded-lg bg-black px-4 py-2"
          >
            <Text className="font-semibold text-white">검색</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppContainer>
  );
}
