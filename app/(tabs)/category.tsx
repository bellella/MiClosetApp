import React, { useRef, useState } from "react";
import { ScrollView, View, Platform, UIManager } from "react-native";
import { View as ThemedView } from "@/components/Themed";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { AppContainer } from "@/components/app/app-container";
import {AppHeader} from "@/components/app/app-container/AppHeader";

const MAIN_CATEGORIES = [
    "의류", "가방", "슈즈", "패션잡화", "주얼리", "뷰티", "푸드", "라이프"
];

const SUB_CATEGORIES: Record<string, { title: string; items: string[] }[]> = {
    "의류": [
        { title: "의류", items: ["신상품", "블라우스", "셔츠", "니트", "가디건", "티셔츠", "맨투맨/후디"] },
        { title: "", items: ["베스트", "아우터", "원피스", "팬츠", "스커트", "세트", "트레이닝"] }
    ],
    "가방": [
        { title: "가방", items: ["신상품", "크로스백", "토트백", "백팩", "에코백"] },
        { title: "", items: ["클러치", "미니백", "지갑", "파우치"] }
    ],
    "슈즈": [
        { title: "슈즈", items: ["신상품", "플랫/로퍼", "스니커즈", "슬리퍼"] },
        { title: "", items: ["힐", "부츠/워커", "샌들"] }
    ],
    "패션잡화": [
        { title: "패션잡화", items: ["신상품", "양말", "타이즈", "벨트", "장갑"] },
        { title: "", items: ["모자", "스카프", "시계", "헤어 액세서리"] }
    ],
    "주얼리": [
        { title: "주얼리", items: ["신상품", "귀걸이", "목걸이", "반지", "팔찌", "브로치"] }
    ],
    "뷰티": [
        { title: "뷰티", items: ["신상품", "스킨케어", "메이크업", "립/아이", "향수", "바디케어"] },
        { title: "", items: ["클렌징", "선케어", "네일", "미용기기"] }
    ],
    "푸드": [
        { title: "푸드", items: ["신상품", "건강식품", "스낵/디저트", "음료", "즉석식품", "밀키트"] }
    ],
    "라이프": [
        { title: "라이프", items: ["신상품", "홈데코", "문구", "전자기기", "팬시용품"] },
        { title: "", items: ["키친/리빙", "욕실", "청소/세탁", "반려동물", "자동차용품"] }
    ],
};


export default function CategoryScreen() {
    const scrollRef = useRef<ScrollView>(null);
    const sectionRefs = useRef<Record<string, any>>({});
    const [selected, setSelected] = useState<string>("의류");

    const handleScrollTo = (key: string) => {
        const section = sectionRefs.current[key];
        if (!section) return;

        if (Platform.OS === "web") {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            section.measureLayout(
                scrollRef.current,
                (x: number, y: number) => {
                    scrollRef.current?.scrollTo({ y, animated: true });
                },
                (error: any) => console.warn("measure error", error)
            );
        }

        setSelected(key);
    };

    return (
        <AppContainer headerTitle="카테고리" showBackButton={true}>
            <View className="flex-row w-full">
                {/* ✅ 고정된 왼쪽 메뉴 */}
                <View   className={`w-[80px] bg-muted ${
                    Platform.OS === "web" ? "sticky top-0 h-screen" : "absolute top-0 bottom-0 left-0 z-10"
                }`}>
                    {MAIN_CATEGORIES.map((name) => (
                        <Pressable
                            key={name}
                            onPress={() => handleScrollTo(name)}
                            className={`px-2 py-3 ${selected === name ? "bg-white" : ""}`}
                        >
                            <Text
                                size="sm"
                                bold={selected === name}
                                className={`text-center ${
                                    selected === name ? "text-primary" : "text-gray-500"
                                }`}
                            >
                                {name}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* ✅ 오른쪽 스크롤 영역 */}
                <ScrollView ref={scrollRef} className="flex-1 px-4">
                    <View className="py-4 flex-col gap-6">
                        {MAIN_CATEGORIES.map((name) => (
                            <View
                                key={name}
                                ref={(ref) => {
                                    if (ref) {
                                        if (Platform.OS === "web") {
                                            // @ts-ignore
                                            sectionRefs.current[name] = ref?.ref || ref;
                                        } else {
                                            sectionRefs.current[name] = ref;
                                        }
                                    }
                                }}
                            >
                                <Text className="text-primary font-bold mb-2">{name}</Text>
                                {(SUB_CATEGORIES[name] ?? []).map((section, idx) => (
                                    <View key={idx}>
                                        {section.title ? (
                                            <Text className="text-base font-semibold mb-1">{section.title}</Text>
                                        ) : null}
                                        <View className="flex-row flex-wrap">
                                            {section.items.map((item, i) => (
                                                <Pressable
                                                    key={i}
                                                    className="w-1/2 py-2 flex-row justify-between items-center"
                                                    onPress={() => {}}
                                                >
                                                    <Text size="sm">{item}</Text>
                                                    <Text className="text-gray-400">›</Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </AppContainer>
    );
}
