"use client";
import { ActivityIndicator } from "react-native";
import React from "react";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { cssInterop } from "nativewind";
import { Colors } from "@/constants/Colors";

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
  return (
    <ActivityIndicator
      ref={ref}
      focusable={focusable}
      aria-label={ariaLabel}
      {...props}
      color={color ?? Colors.light.icon}
      className={spinnerStyle({ class: className })}
    />
  );
});

Spinner.displayName = "Spinner";

export { Spinner };
