import { Image } from "react-native";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import { View } from "react-native";
import { Box } from "@/components/ui/box";
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
  const navigation = useNavigation();

  return (
    <View className="w-screen items-center">
      <View className="bg-white h-[50px] max-w-app self-center w-full flex-row justify-between items-center px-4 py-3 z-50">
        <View>
          {left}
          {showBackButton && (
            <Pressable onPress={() => navigation.goBack()}>
              <FontAwesome name="chevron-left" size={20} />
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
        <View>
          {title && (
            <Text size="lg" bold className="text-center flex-1">
              {title}
            </Text>
          )}
        </View>
        <View className="justify-self-end flex-row items-center gap-4">
          {right}
          {showSearch && (
            <Link href="/search">
              <FontAwesome name="search" size={20} />
            </Link>
          )}
          {showCart && (
            <Link href="/cart">
              <FontAwesome name="shopping-cart" size={20} />
            </Link>
          )}
        </View>
      </View>
    </View>
  );
}
