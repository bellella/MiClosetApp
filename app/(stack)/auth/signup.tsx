import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { shopifySdk } from "@/lib/graphql/client";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AppContainer } from "@/components/app/app-container";

export default function SignupScreen() {
  const router = useRouter();
  const { email, name } = useLocalSearchParams<{ email: string; name: string }>();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const defaultPassword = `${email}_social`;
      // 1️⃣ Shopify 계정 생성
      const { customerCreate } = await shopifySdk.auth.CustomerCreate({
        input: { email, password: defaultPassword, firstName: name },
      });

      const errors = customerCreate?.customerUserErrors;
      if (errors && errors.length > 0) {
        alert(errors[0]?.message || "회원가입 실패");
        return;
      }
      // 2️⃣ 자동 로그인
      const { customerAccessTokenCreate } =
        await shopifySdk.auth.CustomerAccessTokenCreate({
          input: { email, password: defaultPassword },
        });

      const token =
        customerAccessTokenCreate?.customerAccessToken?.accessToken;

      if (token) {
        await AsyncStorage.setItem("customerAccessToken", token);
        alert("회원가입 및 로그인 완료 🎉");
        router.replace("/mypage");
      } else {
        alert("로그인 토큰 발급 실패");
      }
    } catch (err) {
      console.error(err);
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer headerTitle="회원가입" showBackButton>
      <Box className="p-6">
        <Text className="text-2xl font-bold mb-6">회원가입</Text>

        <Text className="text-gray-500 mb-2">이메일</Text>
        <Input className="mb-4 opacity-80">
          <InputField value={email || ""} editable={false} />
        </Input>

        <Text className="text-gray-500 mb-2">비밀번호</Text>
        <Input className="mb-4">
          <InputField
            placeholder="비밀번호 입력"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </Input>

        <Button
          className={`mt-4 py-3 rounded-2xl ${
            loading ? "bg-gray-400" : "bg-primary-500"
          }`}
          onPress={handleSignup}
          isDisabled={loading}
        >
          <ButtonText className="text-white font-semibold text-base">
            {loading ? "가입 중..." : "회원가입 완료"}
          </ButtonText>
        </Button>
      </Box>
    </AppContainer>
  );
}
