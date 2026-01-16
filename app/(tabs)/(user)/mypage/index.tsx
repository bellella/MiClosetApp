import { View } from "react-native";
import { AppContainer } from "@/components/app/app-container";
import { Text } from "@/components/ui/text";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { Link } from "expo-router";
import { Button } from "@/components/common/Button";
import { useShallow } from "zustand/react/shallow";
import { useAuth } from "@/lib/hooks/useAuth";

export default function MyPage() {
  useAuthGuard();
  const { logout } = useAuth();
  const [user] = useAuthStore(useShallow((state) => [state.user]));

  return (
    <AppContainer
      headerTitle="My Page"
      showHeaderLogo={true}
      showHeaderCart={true}
    >
      <View className="w-full max-w-[600px] space-y-6 self-center px-4 py-6">
        <View className="items-center space-y-2">
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
        <View className="space-y-1">
          <Link href="/orders" asChild>
            <View className="border-muted flex-row items-center justify-between border-b py-4">
              <View className="flex-row items-center space-x-3">
                <FontAwesome name="truck" size={18} />
                <Text size="sm">Orders & Delivery</Text>
              </View>
              <FontAwesome name="angle-right" size={16} />
            </View>
          </Link>

          <Link href="/reviews">
            <View className="border-muted flex-row items-center justify-between border-b py-4">
              <View className="flex-row items-center space-x-3">
                <FontAwesome name="comment-o" size={18} />
                <Text size="sm">Reviews</Text>
              </View>
              <FontAwesome name="angle-right" size={16} />
            </View>
          </Link>

          <Link href="/mypage/setting">
            <View className="border-muted flex-row items-center justify-between border-b py-4">
              <View className="flex-row items-center space-x-3">
                <FontAwesome name="comment-o" size={18} />
                <Text size="sm">Setting</Text>
              </View>
              <FontAwesome name="angle-right" size={16} />
            </View>
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
