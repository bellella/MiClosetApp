"use client";
import { ActivityIndicator, useColorScheme } from "react-native";
import React from "react";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { cssInterop } from "nativewind";
import { Colors } from "@/theme/colors.generated";

cssInterop(ActivityIndicator, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});

const spinnerStyle = tva({});

const Spinner = React.forwardRef<
  React.ComponentRef<typeof ActivityIndicator>,
  React.ComponentProps<typeof ActivityIndicator>
>(function Spinner(
  {
    className,
    color,
    focusable = false,
    "aria-label": ariaLabel = "loading",
    ...props
  },
  ref
) {
  const scheme = useColorScheme() ?? "light";
  return (
    <ActivityIndicator
      ref={ref}
      focusable={focusable}
      aria-label={ariaLabel}
      {...props}
      color={color ?? Colors.scheme[scheme].primary}
      className={spinnerStyle({ class: className })}
    />
  );
});

Spinner.displayName = "Spinner";

export { Spinner };
