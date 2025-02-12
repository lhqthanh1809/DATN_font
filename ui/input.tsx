import { ReactNode, useState } from "react";
import {
  StyleProp,
  Text,
  TextInput,
  View,
  ViewStyle,
  StyleSheet,
  Pressable,
} from "react-native";
import Icon from "./icon";
import { Hide, Show } from "./icon/edit";
import { cn } from "@/helper/helper";

interface Props {
  label?: string;
  onChange?: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  className?: string;
  classNameInput?: string;
  type?: "password" | "number" | "text";
  prefix?: ReactNode;
  suffix?: ReactNode;
  value: string;
}

function Input({
  label,
  onChange,
  style,
  className,
  classNameInput,
  type = "text",
  prefix,
  suffix,
  value,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex gap-2">
      {label && (
        <Text className="font-BeVietnamRegular text-14 text-mineShaft-950 ml-2">
          {label}
        </Text>
      )}
      <View
        className={cn(
          "border-1 border-mineShaft-200 bg-white-50 px-3 h-[3rem] rounded-xl flex-row items-center gap-2",
          className
        )}
      >
        {prefix}
        <TextInput
          value={value}
          onChangeText={onChange}
          className={`py-0 flex-1 text-14 font-BeVietnamRegular text-mineShaft-500 caret-mineShaft-600 ${classNameInput}`}
          secureTextEntry={type === "password" && !showPassword}
          textContentType="none"
          keyboardType={type === "number" ? "numeric" : "default"}
        />
        {suffix}
        {type === "password" && (
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <Icon icon={Show} /> : <Icon icon={Hide} />}
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default Input;
