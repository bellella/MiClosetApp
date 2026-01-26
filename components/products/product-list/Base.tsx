import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import type { ReactNode } from "react";

export type ProductListBaseProps = {
    title?: string;
    onPressMore?: () => void;
    children: ReactNode;
};

export function ProductListBase({ title, onPressMore, children }: ProductListBaseProps) {
    return (
        <VStack className="gap-y-3 overflow-hidden">
            <HStack className="justify-between items-center">
                {title && (
                    <Text size="md" bold className="pl-4">
                        {title}
                    </Text>
                )}
                {onPressMore && (
                    <Pressable onPress={onPressMore} className="flex-row items-center gap-x-1">
                        <Text size="sm" className="text-gray-400">
                            더보기
                        </Text>
                        <FontAwesome name="angle-right" size={14} color="#9ca3af" />
                    </Pressable>
                )}
            </HStack>
            <Box>{children}</Box>
        </VStack>
    );
}
