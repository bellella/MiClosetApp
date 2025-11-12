import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import {
  CheckboxGroup,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
} from "@/components/ui/toast";

export default function AgreementScreen() {
  const toast = useToast();
  const [toastId, setToastId] = useState(0);
  const [values, setValues] = useState<string[]>([]);

  const requiredKeys = ["age", "terms", "privacy"];
  const allKeys = ["age", "terms", "privacy", "night", "marketing", "third"];

  const allChecked = values.length === allKeys.length;
  const canSubmit = requiredKeys.every((k) => values.includes(k));

  const handleAllToggle = () => {
    setValues(allChecked ? [] : [...allKeys]);
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.show({
        placement: "top",
        duration: 2500,
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="error" variant="solid">
            <ToastTitle>필수 항목 누락</ToastTitle>
            <ToastDescription>
              모든 필수 항목에 동의해야 진행할 수 있습니다.
            </ToastDescription>
          </Toast>
        ),
      });
      return;
    }

    if (!toast.isActive(toastId)) {
      const newId = Math.random();
      setToastId(newId);
      toast.show({
        id: newId,
        placement: "top",
        duration: 3000,
        render: ({ id }) => (
          <Toast nativeID={`toast-${id}`} action="success" variant="solid">
            <ToastTitle>가입 완료 🎉</ToastTitle>
            <ToastDescription>
              회원가입이 성공적으로 완료되었습니다.
            </ToastDescription>
          </Toast>
        ),
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <Box className="p-6">
        <Text className="text-xl font-bold mb-4">
          서비스 이용약관에 동의해주세요.
        </Text>

        {/* 모두 동의 */}
        <Checkbox value="all" isChecked={allChecked} onChange={handleAllToggle}>
          <CheckboxIndicator>
            <CheckboxIcon />
          </CheckboxIndicator>
          <CheckboxLabel className="ml-2 text-base">
            네, 모두 동의합니다.
          </CheckboxLabel>
        </Checkbox>

        <Box className="mt-4">
          <CheckboxGroup value={values} onChange={setValues}>
            <VStack space="md">
              <Checkbox value="age">
                <CheckboxIndicator>
                  <CheckboxIcon/>
                </CheckboxIndicator>
                <CheckboxLabel className="ml-2 text-base">
                  (필수) 만 14세 이상입니다.
                </CheckboxLabel>
              </Checkbox>

              <Checkbox value="terms">
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel className="ml-2 text-base">
                  (필수) 서비스 이용약관에 동의
                </CheckboxLabel>
              </Checkbox>

              <Checkbox value="privacy">
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel className="ml-2 text-base">
                  (필수) 개인정보 수집이용에 동의
                </CheckboxLabel>
              </Checkbox>

              <Checkbox value="night">
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel className="ml-2 text-base">
                  (선택) 야간 혜택 수신에 동의
                </CheckboxLabel>
              </Checkbox>

              <Checkbox value="marketing">
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel className="ml-2 text-base">
                  (선택) 홍보 및 마케팅 이용에 동의
                </CheckboxLabel>
              </Checkbox>

              <Checkbox value="third">
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel className="ml-2 text-base">
                  (선택) 마케팅 개인정보 제3자 제공 동의
                </CheckboxLabel>
              </Checkbox>
            </VStack>
          </CheckboxGroup>
        </Box>

        {/* 다음 버튼 */}
        <Button
          className={`mt-6 py-3 rounded-2xl ${
            canSubmit ? "bg-primary-500" : "bg-gray-300"
          }`}
          onPress={handleSubmit}
        >
          <ButtonText className="text-white font-semibold text-base">
            다음
          </ButtonText>
        </Button>
      </Box>
    </ScrollView>
  );
}
