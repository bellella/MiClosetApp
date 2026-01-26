import { Image, useColorScheme } from "react-native";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { View } from "react-native";
import { Box } from "@/components/ui/box";
import { useColors } from "@/lib/hooks/useColors";
type AppHeaderProps = {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  showLogo?: boolean;
  showBackButton?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
};

export function AppHeader({
  title,
  left,
  right,
  showLogo = false,
  showBackButton = false,
  showCart = false,
  showSearch = false,
}: AppHeaderProps) {
  const router = useRouter();
  const { colors } = useColors();
  const iconColor = colors.primary;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View className="w-screen items-center">
      <View className="z-50 h-[50px] w-full max-w-app flex-row items-center justify-between self-center px-4 py-3">
        <View className="w-1/4">
          {left}
          {showBackButton && (
            <Pressable onPress={handleBack}>
              <Ionicons name="chevron-back" size={20} color={iconColor} />
            </Pressable>
          )}
          <View />
          {showLogo ? (
            <Box
              className="h-7"
              style={{
                aspectRatio: 5 / 1,
              }}
            >
              <Image
                source={require("#/images/logo.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
              />
            </Box>
          ) : null}
        </View>
        <View className="flex-1">
          {title && (
            <Text size="lg" bold className="flex-1 text-center">
              {title}
            </Text>
          )}
        </View>
        <View className="w-1/4 flex-row items-center gap-4 justify-end">
          {right}
          {showSearch && (
            <Link href="/search">
              <Ionicons name="search" size={20} color={iconColor} />
            </Link>
          )}
          {showCart && (
            <Link href="/cart">
              <Ionicons name="cart" size={20} color={iconColor} />
            </Link>
          )}
        </View>
      </View>
    </View>
  );
}
