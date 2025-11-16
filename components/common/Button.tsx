import React from "react";
import {
  Button as GluestackButton,
  ButtonText,
  ButtonSpinner,
} from "@/components/ui//button";
import { ViewStyle } from "react-native";

type Props = React.ComponentProps<typeof GluestackButton> & {
  loading?: boolean;
  className?: string;
  style?: ViewStyle;
};

/**
 * 공통 Button 컴포넌트 (gluestack-ui 오버라이드)
 * - variant / size / action props 그대로 사용 가능
 * - loading, disabled 상태 지원
 */
export const Button: React.FC<Props> = ({
  children,
  loading = false,
  disabled,
  className = "",
  style,
  ...props
}) => {
  return (
    <GluestackButton
      isDisabled={disabled || loading}
      className={`h-12 justify-center rounded-lg px-4 ${className}`}
      style={style}
      {...props}
    >
      <ButtonText>{children as React.ReactNode}</ButtonText>
      {loading && <ButtonSpinner color="purple" size="small" />}
    </GluestackButton>
  );
};
