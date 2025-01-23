import {} from "nativewind";
import React, { useMemo } from "react";
import { Pressable, StyleProp, Text, ViewStyle } from "react-native";


interface Props {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  titleClassName?: string;
  icon?: React.ReactNode;
}

function Button({
  onPress,
  title,
  disabled,
  style,
  className,
  titleClassName,
  icon,
}: Props) {

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={`rounded-2xl flex flex-row gap-5 items-center justify-center py-4 ${className}`}
      style={style}
    >
      {icon}
      <Text className={`${titleClassName}`}>{title}</Text>
    </Pressable>
  );
}

export default Button;
