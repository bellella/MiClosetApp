import { useState } from "react";
import { Pressable } from "react-native";
import { AppContainer } from "@/components/app/app-container";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import {
  ChevronRight,
  Sun,
  Moon,
  Smartphone,
  Circle,
} from "lucide-react-native";
import { useThemeStore, ThemeMode } from "@/lib/stores/theme.store";
import { ActionsheetItem, ActionsheetItemText } from "@/components/ui/actionsheet";
import { Radio, RadioGroup, RadioIndicator, RadioIcon } from "@/components/ui/radio";
import { AppActionSheet } from "@/components/app/AppActionSheet";
import { useColors } from "@/lib/hooks/useColors";

const themeModeLabels: Record<ThemeMode, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

const themeModeIcons: Record<ThemeMode, React.ElementType> = {
  system: Smartphone,
  light: Sun,
  dark: Moon,
};

export default function SettingScreen() {
  const { themeMode, setThemeMode } = useThemeStore();
  const [showThemeSheet, setShowThemeSheet] = useState(false);
  const { colors } = useColors();
  const iconColor = colors.primary;
  const handleThemeSelect = (mode: ThemeMode) => {
    setThemeMode(mode);
    setShowThemeSheet(false);
  };

  return (
    <AppContainer headerTitle="Settings" showBackButton>
      <VStack className="flex-1 py-4">
        {/* Theme Setting */}
        <Pressable onPress={() => setShowThemeSheet(true)}>
          <HStack className="items-center justify-between px-4 py-4">
            <HStack className="items-center gap-x-3">
              <Sun size={20} color={iconColor} />
              <Text size="md">Appearance</Text>
            </HStack>
            <HStack className="items-center gap-x-2">
              <Text size="sm">
                {themeModeLabels[themeMode]}
              </Text>
              <ChevronRight size={20} color={iconColor} />
            </HStack>
          </HStack>
        </Pressable>

        {/* Divider */}
        <VStack className="h-px bg-gray-100" />

        {/* More settings will be added here */}
      </VStack>

      {/* Theme Selection ActionSheet */}
      <AppActionSheet
        isOpen={showThemeSheet}
        onClose={() => setShowThemeSheet(false)}
      >
        <Text size="lg" bold className="mb-4 w-full">
          Appearance
        </Text>
        <RadioGroup
          value={themeMode}
          onChange={(value) => handleThemeSelect(value as ThemeMode)}
        >
          <VStack className="w-full gap-y-1">
            {(["system", "light", "dark"] as ThemeMode[]).map((mode) => {
              const Icon = themeModeIcons[mode];
              return (
                <ActionsheetItem
                  key={mode}
                  onPress={() => handleThemeSelect(mode)}
                >
                  <Radio value={mode} size="md">
                    <RadioIndicator>
                      <RadioIcon as={Circle} />
                    </RadioIndicator>
                  </Radio>
                  <Icon size={20} color={iconColor} />
                  <ActionsheetItemText>
                    {themeModeLabels[mode]}
                  </ActionsheetItemText>
                </ActionsheetItem>
              );
            })}
          </VStack>
        </RadioGroup>
      </AppActionSheet>
    </AppContainer>
  );
}
