import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Star } from "lucide-react-native";
import { Review } from "@/lib/api/model";
import { formatLocalDate } from "@/lib/utils/date.utils";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";

interface PreviewReviewItemProps {
  item: Review;
}

export function PreviewReviewItem({ item }: PreviewReviewItemProps) {
  const userName =
    item.user?.firstName && item.user?.lastName
      ? `${item.user.firstName} ${item.user.lastName.charAt(0)}.`
      : item.user?.firstName || "Anonymous";

  return (
    <VStack className="mr-3 w-64 rounded-xl border border-gray-100 bg-white p-3">
      {/* User Info & Rating */}
      <HStack className="items-center gap-x-2">
        <Avatar size="sm">
          <AvatarFallbackText>{userName}</AvatarFallbackText>
        </Avatar>
        <VStack className="flex-1">
          <Text size="sm" bold>
            {userName}
          </Text>
          <HStack className="gap-x-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < item.rating ? "#FCD34D" : "none"}
                color={i < item.rating ? "#FCD34D" : "#D1D5DB"}
              />
            ))}
          </HStack>
        </VStack>
      </HStack>

      {/* Review Image */}
      {item.images && item.images.length > 0 && (
        <Image
          source={{ uri: item.images[0] }}
          className="mt-3 h-40 w-full rounded-lg"
          resizeMode="cover"
          alt="review image"
        />
      )}

      {/* Variant Info (Color/Size) */}
      {item.title && (
        <View className="mt-3 rounded-md bg-gray-50 px-2 py-1.5">
          <Text size="xs" className="text-gray-500">
            {item.title}
          </Text>
        </View>
      )}

      {/* Review Body */}
      <Text size="sm" className="mt-3 text-gray-700" numberOfLines={3}>
        {item.body}
      </Text>

      {/* Date */}
      <Text size="xs" className="mt-2 text-gray-400">
        {formatLocalDate(item.createdAt)}
      </Text>
    </VStack>
  );
}
