import { cn } from "@gluestack-ui/utils/nativewind-utils";
import React from "react";
import { ScrollView } from "react-native";

type Props = React.ComponentProps<typeof ScrollView> & {
  className?: string;
  style?: any;
  scrollVisible?: "hover" | "always";
  scrollThumbColor?: string;
};

export function CustomScrollView({
  children,
  className = "",
  style,
  scrollVisible = "hover",
  scrollThumbColor,
  ...rest
}: Props) {
  const scrollClass =
    scrollVisible === "hover" ? "scroll-hover" : "scroll-always";

  return (
    <ScrollView
      className={cn("custom-scroll", scrollClass, className)}
      style={{
        ...(scrollThumbColor && {
          "--scroll-thumb-color": scrollThumbColor,
        }),
        ...style,
      }}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}
