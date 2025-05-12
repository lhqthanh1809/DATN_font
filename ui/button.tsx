import { cn } from "@/helper/helper";
import React from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  SharedValue,
} from "react-native-reanimated";
import LoadingAnimation from "./LoadingAnimation";

interface Props {
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
  accessibilityLabel?: string;
  classNameLoading?: string;
  delayLongPress?: number;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined
}

const Button = React.forwardRef<View, Props>(function Button(
  {
    onPress,
    onLongPress,
    disabled = false,
    style,
    className,
    children,
    accessibilityLabel,
    loading = false,
    classNameLoading,
    delayLongPress = 300,
    onLayout,
  },
  ref
) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      onLayout={onLayout}
      ref={ref}
      style={style}
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
});


export default Button;
