// src/components/RestoreUserGate.tsx
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "@/lib/stores/auth.store";
import * as WebBrowser from "expo-web-browser";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { restoreUser, isRestoring } = useAuthStore();

  useEffect(() => {
    restoreUser(); // ✅ 앱 실행 시 저장된 유저 복원
  }, []);

  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession();
  }, []);

  if (isRestoring) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
