import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { FontAwesome } from "@expo/vector-icons";
import { AppContainer } from "@/components/app/app-container";
import { FloatingButton } from "@/components/common/FloatingButton";
import { ScrollView } from "react-native";

export default function OrderScreen() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AppContainer headerTitle="주문하기" showBackButton>
        <ScrollView className="flex-1 bg-white px-4 pt-6 pb-32">
          {/* 배송지 섹션 */}
          <Box className="border rounded-xl p-4 mb-6">
            <Box className="flex-row justify-between items-center mb-2">
              <Text bold className="text-lg">
                배송지
              </Text>
              <Pressable>
                <Text className="text-sm text-gray-500">배송지 변경 &gt;</Text>
              </Pressable>
            </Box>
            <Text bold className="text-base mb-1">
              최미나{" "}
              <Text className="text-xs text-pink-500 border border-pink-200 px-1 rounded-full ml-1">
                기본배송지
              </Text>
            </Text>
            <Text className="text-sm mb-1">최미나 · 010-5359-9976</Text>
            <Text className="text-sm text-gray-700 mb-3">
              경기 성남시 중원구 제일로 55 (성남동, 대동다숲아파트),
              대동다숲아파트 1003호 [13368]
            </Text>
            <Box className="border rounded-md px-3 py-2">
              <Text className="text-sm text-gray-400">
                배송 메모를 선택해주세요.
              </Text>
            </Box>
          </Box>

          {/* 주문 상품 아코디언 */}
          <Box className="border-t border-b py-4">
            <Pressable
              className="flex-row justify-between items-center"
              onPress={() => setOpen(!open)}
            >
              <Text bold className="text-base">
                주문 상품
              </Text>
              <Box className="flex-row items-center space-x-2">
                <Text className="text-sm text-gray-500">1개</Text>
                {open ? (
                  <FontAwesome name="chevron-up" size={20} />
                ) : (
                  <FontAwesome name="chevron-down" size={20} />
                )}
              </Box>
            </Pressable>

            {open && (
              <Box className="mt-4 space-y-3">
                <Box className="flex-row space-x-3 items-center">
                  <Box className="w-[60px] h-[80px] bg-gray-200 rounded-md" />
                  <Box className="flex-1">
                    <Text className="text-sm font-medium">
                      [예시 상품명] 여름 반팔티
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      옵션: 블랙 / M
                    </Text>
                    <Text className="text-sm font-bold mt-2">₩19,800</Text>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* 결제 금액 */}
          <Box className="pt-6 pb-4 border-b">
            <Text bold className="text-base mb-3">
              결제 금액
            </Text>
            <Box className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-500">상품 금액</Text>
              <Text className="text-sm font-medium">35,910원</Text>
            </Box>
            <Box className="flex-row justify-between">
              <Text className="text-sm text-gray-500">배송비</Text>
              <Text className="text-sm text-pink-500 font-medium">
                무료배송
              </Text>
            </Box>
          </Box>

          {/* 구매 혜택 */}
          <Box className="py-4 border-b">
            <Text bold className="text-base mb-3">
              구매 혜택
            </Text>
            <Box className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-500">구매확정 마일리지</Text>
              <Text className="text-sm">180M</Text>
            </Box>
            <Box className="flex-row justify-between">
              <Text className="text-sm text-gray-500">리뷰 작성 마일리지</Text>
              <Text className="text-sm">최대 500M</Text>
            </Box>
            <Text className="text-right text-sm text-pink-500 mt-2 font-semibold">
              + 최대 680
            </Text>
          </Box>

          {/* 동의 영역 */}
          <Box className="py-6">
            <Box className="flex-row items-center space-x-2 mb-3">
              <Box className="w-5 h-5 rounded border border-gray-400" />
              <Text className="text-sm font-medium">
                주문내용 확인 및 결제 동의
              </Text>
            </Box>

            <Box className="space-y-1 pl-6">
              <Text className="text-xs text-gray-500">
                ✓ (필수) 개인정보 수집·이용 동의
              </Text>
              <Text className="text-xs text-gray-500">
                ✓ (필수) 개인정보 제3자 정보 제공 동의
              </Text>
              <Text className="text-xs text-gray-500">
                ✓ (필수) 결제대행 서비스 이용약관 동의
              </Text>
            </Box>

            <Text className="text-xs text-gray-400 mt-4 leading-relaxed">
              개별 판매자가 등록한 상품에 대한 광고, 상품주문, 배송, 환불의
              의무와 책임은 각 판매자에게 있으며, 개별 판매자의 상품에 대하여
              카카오스타일은 통신판매중개자로서 통신판매의 당사자가 아닙니다.
            </Text>
          </Box>
        </ScrollView>
      </AppContainer>
      <FloatingButton onPress={() => console.log("구매하기")}>
        <Text className="text-white font-bold text-base">
          35,900원 결제하기
        </Text>
      </FloatingButton>
    </>
  );
}
