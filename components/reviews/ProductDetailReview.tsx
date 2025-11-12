// components/products/ProductReviewSection.tsx
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "@/components/ui/image";

type Review = {
  id: number;
  user: string;
  rating: number;
  content: string;
  createdAt: string;
};

type Props = {
  reviews?: Review[];
};

export const dummyReviews = [
    {
      id: 1,
      user: "choi****",
      rating: 5,
      content: "사진보다 실물이 훨씬 예뻐요! 재질도 부드럽고 맘에 들어요.",
      createdAt: "2024.12.01",
      image: require("#/images/review1.webp"),
    },
    {
      id: 2,
      user: "lee****",
      rating: 4,
      content: "핏 괜찮고 배송도 빨라요. 색상이 화면이랑 거의 같아요.",
      createdAt: "2024.12.02",
      image: require("#/images/review2.webp"),
    },
    {
      id: 3,
      user: "park****",
      rating: 3,
      content: "무난한 편인데 조금 크게 나왔어요. 참고하셔야 할 듯.",
      createdAt: "2024.12.03",
    },
    {
      id: 4,
      user: "kang****",
      rating: 5,
      content: "선물했는데 받는 분이 너무 좋아했어요 :) 재구매 의사 있음!",
      createdAt: "2024.12.04",
    },
    {
      id: 5,
      user: "hong****",
      rating: 4,
      content: "디자인은 예쁜데 생각보다 얇아서 봄에 입기 좋아요.",
      createdAt: "2024.12.05",
    },
  ];

  export function ProductDetailReview() {
    const reviews = dummyReviews;
  
    const imageReviews = reviews.filter((r) => r.image);
    const textReviews = reviews.filter((r) => !r.image);
  
    if (reviews.length === 0) {
      return (
        <View className="mt-10">
          <Text bold size="md" className="mb-2">상품 리뷰</Text>
          <Text size="sm" className="text-gray-400">아직 등록된 리뷰가 없습니다.</Text>
        </View>
      );
    }
  
    return (
      <View className="mt-10 space-y-8">
        <Text bold size="md">상품 리뷰</Text>
  
        {/* 📸 이미지 리뷰 카드 */}
        {imageReviews.length > 0 && (
          <View className="flex-row flex-wrap gap-3">
            {imageReviews.map((r) => (
              <View key={r.id} className="w-[46%] bg-muted rounded-md overflow-hidden">
                <Image
                  source={r.image}
                  className="w-full aspect-square"
                  resizeMode="cover"
                />
                <View className="p-2">
                  <Text size="xs" bold className="mb-1">{r.user}</Text>
                  <View className="flex-row items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FontAwesome
                        key={i}
                        name={i < r.rating ? "star" : "star-o"}
                        size={12}
                        color="#facc15"
                      />
                    ))}
                  </View>
                  <Text size="xs" numberOfLines={2} className="text-gray-600">{r.content}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
  
        {/* 📝 텍스트 리뷰 리스트 */}
        <View className="space-y-6">
          {textReviews.map((review) => (
            <View key={review.id} className="border-b border-muted pb-4">
              <View className="flex-row justify-between items-center mb-1">
                <Text size="sm" bold>{review.user}</Text>
                <View className="flex-row items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FontAwesome
                      key={i}
                      name={i < review.rating ? "star" : "star-o"}
                      size={14}
                      color="#facc15"
                    />
                  ))}
                  <Text size="xs" className="text-gray-500 ml-1">{review.rating}.0</Text>
                </View>
              </View>
  
              <Text size="sm" className="text-gray-800 leading-relaxed">
                {review.content}
              </Text>
  
              <Text size="xs" className="text-gray-400 mt-1">{review.createdAt}</Text>
            </View>
          ))}
        </View>
  
        {/* 🔘 전체 보기 버튼 */}
        <Pressable
          className="border border-muted py-3 rounded-lg items-center mt-4"
          onPress={() => console.log("전체 리뷰 보기")}
        >
          <Text size="sm" bold>리뷰 전체 보기</Text>
        </Pressable>
      </View>
    );
  }
