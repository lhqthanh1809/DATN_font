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
import { cn, convertToNumber } from "@/helper/helper";

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
  placeHolder?: string;
  onBlur?: () => void;
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
  placeHolder,
  onBlur,
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
          value={type === "number" ? convertToNumber(value) : value}
          onChangeText={(text) =>
            type === "number"
              ? onChange && onChange(text.replace(/[^0-9,]/g, ""))
              : onChange && onChange(text)
          }
          className={`py-0 flex-1 text-14 font-BeVietnamRegular text-mineShaft-500 caret-mineShaft-600 ${classNameInput}`}
          secureTextEntry={type === "password" && !showPassword}
          textContentType="none"
          keyboardType={type === "number" ? "numeric" : "default"}
          placeholder={placeHolder}
          placeholderTextColor={"#B0B0B0"}
          onBlur={onBlur}
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
