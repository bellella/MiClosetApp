import { cn } from "@gluestack-ui/utils/nativewind-utils";
import React from "react";
import { FlatList, Platform } from "react-native";

type Props = React.ComponentProps<typeof FlatList> & {
  className?: string;
  style?: any;
  scrollVisible?: "hover" | "always";
  scrollThumbColor?: string;
};

export function CustomFlatList({
  className = "",
  style,
  scrollVisible = "hover",
  scrollThumbColor,
  ...rest
}: Props) {
  const scrollClass =
    scrollVisible === "hover" ? "scroll-hover" : "scroll-always";

  return (
    <FlatList
      className={cn("custom-scroll", scrollClass, className)}
      style={{
        ...(scrollThumbColor && {
          "--scroll-thumb-color": scrollThumbColor, // ★ thumb 색상 override
        }),
        ...style,
      }}
      {...rest}
    />
  );
}
