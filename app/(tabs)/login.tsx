import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/stores/auth.store";
import { AppContainer } from "@/components/app/app-container";
import { shopifySdk } from "@/lib/graphql/client";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthRequest } from "expo-auth-session";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// only app
const googleSigninConfigure = () => {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_LIENT_ID,
    scopes: ["openid", "profile", "email"],
  });
};
const redirectUri = AuthSession.makeRedirectUri({
  path: "auth/callback",
  scheme: "miclosetapp",
});
export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    googleSigninConfigure();
  }, []);

  const onGoogleButtonPress = async () => {
    promptAsync();
    return;
    if (Platform.OS === "web") {
      promptAsync();
    } else {
      await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens();
      tokenHandle(accessToken);
    }
  };
  // ✅ 로그인 요청 준비
  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_LIENT_ID,
      redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: "token",
    }
    // {
    //   authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    //   tokenEndpoint: "https://oauth2.googleapis.com/token",
    // }
  );
  const tokenHandle = async (access_token: string) => {
    console.log(access_token, "token....");
    try {
      setLoading(true);
      // ✅ Google userinfo 가져오기
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      const user = await userInfoResponse.json();
      console.log(user, "user다");

      // ✅ Shopify 로그인 시도
      const defaultPassword = `${user.email}_social`;
      const { customerAccessTokenCreate } =
        await shopifySdk.auth.CustomerAccessTokenCreate({
          input: { email: user.email, password: defaultPassword },
        });

      const token = customerAccessTokenCreate?.customerAccessToken?.accessToken;

      if (token) {
        // Shopify에 고객 존재 → 로그인 성공
        await AsyncStorage.setItem("customerAccessToken", token);

        await login({
          user: { id: user.sub, name: user.name, email: user.email },
          accessToken: token,
          refreshToken: "",
        });

        router.replace("/mypage");
      } else {
        // Shopify에 고객 없음 → 회원가입 페이지로 이동
        router.push({
          pathname: "/auth/signup",
          params: { email: user.email, name: user.name },
        });
      }
    } catch (err) {
      console.error(err);
      Alert.alert("로그인 실패", "인증 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response && response?.type === "success") {
      const { access_token } = response.params;
      tokenHandle(access_token);
    }
  }, [response]);

  // ✅ Gluestack UI 기반 화면
  return (
    <AppContainer headerTitle="로그인" showBackButton>
      <Box className="flex-1 items-center justify-center space-y-6 bg-white p-6">
        <Text className="text-2xl font-bold">로그인</Text>

        {loading ? (
          <Box className="mt-4 items-center justify-center">
            <ActivityIndicator size="large" />
            <Text className="mt-2 text-gray-500">로그인 중...</Text>
          </Box>
        ) : (
          <Button
            className="mt-2 w-full rounded-xl bg-red-500"
            onPress={() => onGoogleButtonPress()}
            isDisabled={!request}
          >
            <ButtonText className="text-base font-semibold text-white">
              Google 계정으로 로그인
            </ButtonText>
          </Button>
        )}

        <Text className="mt-6 px-6 text-center text-gray-400">
          처음 로그인 시 자동으로 회원가입 페이지로 이동합니다.
        </Text>
      </Box>
    </AppContainer>
  );
}
