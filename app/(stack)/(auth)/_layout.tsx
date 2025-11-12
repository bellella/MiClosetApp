import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "@/lib/stores/auth.store";

export default function AuthLayout() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  // 로그인 상태에 따라 라우팅 제어
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login"); // 로그인 안 되어 있으면 /login 으로 이동
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 로그인된 사용자만 하위 라우트 접근 가능
  return <Stack screenOptions={{ headerShown: false }} />;
}
