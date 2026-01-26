import { Pressable, View } from "react-native";
import { AppContainer } from "@/components/app/app-container";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { Link } from "expo-router";
import { Button } from "@/components/common/Button";
import { useShallow } from "zustand/react/shallow";
import { useAuth } from "@/lib/hooks/useAuth";
import { useColors } from "@/lib/hooks/useColors";

export default function MyPage() {
  useAuthGuard();
  const { colors } = useColors();
  const iconColor = colors.primary;
  const { logout } = useAuth();
  const [user] = useAuthStore(useShallow((state) => [state.user]));

  return (
    <AppContainer
      headerTitle="My Page"
      showHeaderCart
      showBackButton
      showHeaderSearch
    >
      <View className="w-full max-w-[600px] gap-y-6 self-center px-4 py-6">
        <View className="items-center gap-y-2">
          <Text bold size="xl">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text size="sm" className="text-gray-500">
            {maskEmail(user?.email ?? "")}
          </Text>

          {/* <View className="mt-2 rounded-full bg-black px-4 py-2">
            <Text size="sm" className="text-white">
              Edit Profile
            </Text>
          </View> */}
        </View>

        {/* 구분선 */}
        <View className="bg-muted h-[1px]" />

        {/* 📋 메뉴 리스트 */}
        <View className="gap-y-1">
          <Link href="/orders" asChild>
            <Pressable className="border-muted flex-row items-center justify-between border-b py-4">
              <View className="flex-row items-center gap-x-3">
                <Ionicons name="cube-outline" size={18} color={iconColor} />
                <Text size="sm">Orders & Delivery</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={iconColor} />
            </Pressable>
          </Link>

          <Link href="/reviews" asChild>
            <Pressable className="border-muted flex-row items-center justify-between border-b py-4">
              <View className="flex-row items-center gap-x-3">
                <Ionicons name="chatbubble-outline" size={18} color={iconColor} />
                <Text size="sm">Reviews</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={iconColor} />
            </Pressable>
          </Link>

          <Link href="/mypage/setting" asChild>
            <Pressable className="border-muted flex-row items-center justify-between border-b py-4">
              <View className="flex-row items-center gap-x-3">
                <Ionicons name="settings-outline" size={18} color={iconColor} />
                <Text size="sm">Setting</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={iconColor} />
            </Pressable>
          </Link>
        </View>

        <Button onPress={() => logout()} className="mt-6">
          Logout
        </Button>

        {/* Bottom Policy Menu */}
        {/* <Pressable className="mt-4 py-4">
          <Text size="xs" className="text-gray-400">
            Privacy Policy
          </Text>
        </Pressable> */}
      </View>
    </AppContainer>
  );
}

// 이메일 마스킹 함수 (be********@gmail.com)
function maskEmail(email: string) {
  const [id, domain] = email.split("@");
  if (!id || !domain) return email;
  return id.slice(0, 2) + "*".repeat(id.length - 2) + "@" + domain;
}
