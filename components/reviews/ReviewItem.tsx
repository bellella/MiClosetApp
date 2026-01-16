import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Image } from "react-native";
import { Star } from "lucide-react-native";
import { Review } from "@/lib/api/model";
import { formatLocalDate } from "@/lib/utils/date.utils";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";

interface ReviewItemProps {
  item: Review;
}

export function ReviewItem({ item }: ReviewItemProps) {
  const userName =
    item.user?.firstName && item.user?.lastName
      ? `${item.user.firstName} ${item.user.lastName.charAt(0)}.`
      : item.user?.email?.split("@")[0] || "Anonymous";

  return (
    <VStack className="border-b border-gray-100 px-4 py-5">
      {/* User Info & Rating */}
      <HStack className="items-center gap-x-3">
        <Avatar size="md">
          <AvatarFallbackText>{userName}</AvatarFallbackText>
        </Avatar>
        <VStack className="flex-1">
          <Text size="sm" bold>
            {userName}
          </Text>
          <HStack className="items-center gap-x-2">
            <HStack className="gap-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < item.rating ? "#FCD34D" : "none"}
                  color={i < item.rating ? "#FCD34D" : "#D1D5DB"}
                />
              ))}
            </HStack>
            <Text size="xs" className="text-gray-400">
              {formatLocalDate(item.createdAt)}
            </Text>
          </HStack>
        </VStack>
      </HStack>

      {/* Review Images */}
      {item.images && item.images.length > 0 && (
        <HStack className="mt-3 gap-x-2">
          {item.images.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              className="h-20 w-20 rounded-lg"
              resizeMode="cover"
            />
          ))}
        </HStack>
      )}

      {/* Variant Info (Color/Size) */}
      {item.title && (
        <Box className="mt-3 rounded-md bg-gray-50 px-3 py-2">
          <Text size="xs" className="text-gray-500">
            {item.title}
          </Text>
        </Box>
      )}

      {/* Review Body */}
      <Text size="sm" className="mt-3 leading-relaxed text-gray-700">
        {item.body}
      </Text>
    </VStack>
  );
}
