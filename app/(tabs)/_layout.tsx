import React from "react";
import { Tabs } from "expo-router";
import { Colors } from "@/theme/colors.generated";
import { useColorScheme } from "react-native";
import { Home, List, UserRound, Heart } from "lucide-react-native";
import { useColors } from "@/lib/hooks/useColors";

export default function TabLayout() {
  const { colors } = useColors();
  const iconColor = colors.primary;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          maxWidth: 600,
          width: "100%",
          alignSelf: "center",
          //borderTopColor: colors.primary,
        },
        tabBarActiveTintColor: iconColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ focused, color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "카테고리",
          tabBarIcon: ({ color, size }) => (
            <List size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          href: null,
          title: "로그인",
        }}
      />
      <Tabs.Screen
        name="(user)/wishlist"
        options={{
          title: "찜",
          tabBarIcon: ({ color, size }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(user)/mypage/index"
        options={{
          title: "마이페이지",
          tabBarIcon: ({ color, size }) => (
            <UserRound size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(user)/mypage/setting"
        options={{
          href: null
        }}
      />
    </Tabs>
  );
}
