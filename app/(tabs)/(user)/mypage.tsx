import { View } from "react-native";
import { AppContainer } from "@/components/app/app-container";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { router } from "expo-router";
import { Button } from "@/components/common/Button";
import { useShallow } from "zustand/react/shallow";

const menuItems = [
  { label: "주문 배송", icon: "truck", count: undefined, url: "/orders" },
  { label: "리뷰", icon: "comment-o", count: 0, url: "/reviews" },
  // { label: "쿠폰", icon: "ticket", count: 6 },
  // { label: "포인트", icon: "circle-o", count: 0 },
  // { label: "마일리지", icon: "circle", count: undefined },
  // { label: "공유 리워드", icon: "won", count: undefined },
];

export default function MyPage() {
  useAuthGuard();
  const [user, logout] = useAuthStore(
    useShallow((state) => [state.user, state.logout])
  );

  return (
    <AppContainer
      headerTitle="마이페이지"
      showHeaderLogo={true}
      showHeaderCart={true}
    >
      <View className="w-full max-w-[600px] space-y-6 self-center px-4 py-6">
        {/* 👤 프로필 영역 */}
        <View className="items-center space-y-2">
          <Text bold size="xl">
            {user?.name ?? "로그인 필요"}
          </Text>
          <Text size="sm" className="text-gray-500">
            {maskEmail(user?.email ?? "")}
          </Text>

          <Pressable className="mt-2 rounded-full bg-black px-4 py-2">
            <Text size="sm" className="text-white">
              내 정보 수정
            </Text>
          </Pressable>
        </View>

        {/* 구분선 */}
        <View className="bg-muted h-[1px]" />

        {/* 📋 메뉴 리스트 */}
        <View className="space-y-1">
          {menuItems.map((item, idx) => (
            <Pressable
              key={idx}
              className="border-muted flex-row items-center justify-between border-b py-4"
              onPress={() => {
                if (item.url) {
                  router.push(item.url);
                }
              }}
            >
              <View className="flex-row items-center space-x-3">
                <FontAwesome name={item.icon as any} size={18} />
                <Text size="sm">{item.label}</Text>
              </View>

              <View className="flex-row items-center space-x-2">
                {typeof item.count === "number" && (
                  <Text size="sm" className="text-pink-500">
                    {item.count}
                  </Text>
                )}
                <FontAwesome name="angle-right" size={16} />
              </View>
            </Pressable>
          ))}
        </View>

        <Button onPress={() => logout()} className="mt-6">
          로그아웃
        </Button>

        {/* 하단 정책 메뉴 */}
        <Pressable className="mt-4 py-4">
          <Text size="xs" className="text-gray-400">
            개인 정보 처리 방침
          </Text>
        </Pressable>
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
