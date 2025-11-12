import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { FlatList, Image } from "react-native";

const categories = [
    { name: "상의", icon: "https://via.placeholder.com/60x60.png?text=Top" },
    { name: "하의", icon: "https://via.placeholder.com/60x60.png?text=Bottom" },
    { name: "신발", icon: "https://via.placeholder.com/60x60.png?text=Shoes" },
    { name: "가방", icon: "https://via.placeholder.com/60x60.png?text=Bag" },
    { name: "악세사리", icon: "https://via.placeholder.com/60x60.png?text=Acc" },
    { name: "뷰티", icon: "https://via.placeholder.com/60x60.png?text=Beauty" },
];

export function HomeCategoryIcons() {
    return (
        <FlatList
            data={categories}
            keyExtractor={(item) => item.name}
            numColumns={4}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }}
            renderItem={({ item }) => (
                <Pressable className="items-center">
                    <Image
                        source={{ uri: item.icon }}
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                    />
                    <Text size="sm" className="mt-2 text-center">
                        {item.name}
                    </Text>
                </Pressable>
            )}
        />
    );
}
