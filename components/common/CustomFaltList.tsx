import { cn } from "@gluestack-ui/utils/nativewind-utils";
import React from "react";
import { FlatList, FlatListProps } from "react-native";

type Props<T> = FlatListProps<T> & {
  className?: string;
  style?: any;
  scrollVisible?: "hover" | "always";
  scrollThumbColor?: string;
};

export function CustomFlatList<T>({
  className = "",
  style,
  scrollVisible = "hover",
  scrollThumbColor,
  ...rest
}: Props<T>) {
  const scrollClass =
    scrollVisible === "hover" ? "scroll-hover" : "scroll-always";

  return (
    <FlatList<T>
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
