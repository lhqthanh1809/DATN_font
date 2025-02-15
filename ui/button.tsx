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
import LoadingAnimation from "./loading_animation";

interface Props {
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
  accessibilityLabel?: string;
  onLayout?:
    | ((event: LayoutChangeEvent) => void)
    | SharedValue<((event: LayoutChangeEvent) => void) | undefined>
    | undefined;
}

function Button({
  onPress,
  disabled = false,
  style,
  className,
  children,
  accessibilityLabel,
  loading = false,
  onLayout,
}: Props) {
  const AnimatePressable = Animated.createAnimatedComponent(Pressable);

  return (
    <AnimatePressable
      disabled={disabled}
      onPress={onPress}
      style={[style]}
      className={cn(
        "rounded-2xl flex flex-row gap-5 items-center justify-center disabled:opacity-85",
        className
      )}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onLayout={onLayout}
    >
      {loading ? <LoadingAnimation /> : <>{children}</>}
    </AnimatePressable>
  );
}

export default Button;
