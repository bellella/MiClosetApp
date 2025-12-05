import React from "react";
import { ActivityIndicator } from "react-native";
import { AppContainer } from "@/components/app/app-container";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useGoogleAuth } from "@/lib/hooks/useGoogleAuth";

export default function LoginScreen() {
  const { signInWithGoogle, loading } = useGoogleAuth();

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
            onPress={signInWithGoogle}
            isDisabled={loading}
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
