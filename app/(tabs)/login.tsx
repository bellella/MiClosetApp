import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/stores/auth.store";
import { AppContainer } from "@/components/app/app-container";
import { shopifySdk } from "@/lib/graphql/client";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!;

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // ✅ redirectUri — 반드시 scheme + path 유지
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "myapp", // app.json의 "scheme" 값과 일치해야 함
    path: "http://localhost:8081/auth/callback",
  });
  console.log("Redirect URI:", redirectUri);

  // ✅ Google OAuth 설정
  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
  };

  // ✅ 로그인 요청 준비
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: "code",
    },
    discovery
  );

  // ✅ OAuth 콜백 처리
  useEffect(() => {
    const exchangeCodeForToken = async (code: string) => {
      try {
        setLoading(true);

        const body = new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
          client_secret: "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",
          code_verifier: request?.codeVerifier as string,
        });

        const res = await fetch(discovery.tokenEndpoint!, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });

        const tokenData = await res.json();

        if (tokenData.error) {
          console.error(tokenData);
          throw new Error(
            tokenData.error_description || "Token exchange failed"
          );
        }

        // ✅ Google userinfo 가져오기
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
          }
        );
        const user = await userInfoResponse.json();

        // ✅ Shopify 로그인 시도
        const defaultPassword = `${user.email}_social`;
        const { customerAccessTokenCreate } =
          await shopifySdk.auth.CustomerAccessTokenCreate({
            input: { email: user.email, password: defaultPassword },
          });

        const token =
          customerAccessTokenCreate?.customerAccessToken?.accessToken;

        if (token) {
          // Shopify에 고객 존재 → 로그인 성공
          await AsyncStorage.setItem("customerAccessToken", token);

          await login({
            user: { id: user.sub, name: user.name, email: user.email },
            accessToken: token,
            refreshToken: tokenData.refresh_token ?? null,
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

    if (response?.type === "success") {
      const { code } = response.params;
      exchangeCodeForToken(code);
    }
  }, [response]);

  // ✅ Gluestack UI 기반 화면
  return (
    <AppContainer headerTitle="로그인" showBackButton>
      <Box className="flex-1 items-center justify-center bg-white p-6 space-y-6">
        <Text className="text-2xl font-bold">로그인</Text>

        {loading ? (
          <Box className="mt-4 items-center justify-center">
            <ActivityIndicator size="large" />
            <Text className="text-gray-500 mt-2">로그인 중...</Text>
          </Box>
        ) : (
          <Button
            className="bg-red-500 rounded-xl w-full mt-2"
            onPress={() => promptAsync()}
            isDisabled={!request}
          >
            <ButtonText className="text-white font-semibold text-base">
              Google 계정으로 로그인
            </ButtonText>
          </Button>
        )}

        <Text className="text-gray-400 text-center px-6 mt-6">
          처음 로그인 시 자동으로 회원가입 페이지로 이동합니다.
        </Text>
      </Box>
    </AppContainer>
  );
}
