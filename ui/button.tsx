import { cn } from "@/helper/helper";
import React from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, {
  SharedValue,
} from "react-native-reanimated";
import LoadingAnimation from "./LoadingAnimation";

interface Props {
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
  accessibilityLabel?: string;
  classNameLoading?: string;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined
}

function Button({
  onPress,
  disabled = false,
  style,
  className,
  children,
  accessibilityLabel,
  loading = false,
  classNameLoading,
  onLayout
}: Props) {

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[style]}
      onLayout={onLayout}
      className={cn(
        "rounded-2xl flex flex-row gap-5 items-center justify-center disabled:opacity-85",
        className
      )}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      {loading ? <LoadingAnimation className={classNameLoading} /> : <>{children}</>}
    </Pressable>
  );
}

export default Button;
