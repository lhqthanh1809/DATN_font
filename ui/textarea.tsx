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
import Icon from "./Icon";
import { Hide, Show } from "./icon/edit";
import { cn, convertToNumber } from "@/helper/helper";

interface Props {
  required?: boolean;
  label?: string;
  onChange?: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  className?: string;
  classNameInput?: string;
  type?: "password" | "number" | "text" | "phone" | "code";
  prefix?: ReactNode;
  suffix?: ReactNode;
  value: string;
  placeHolder?: string;
  onBlur?: () => void;
  disabled?: boolean;
}

function TextArea({
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
  required,
  disabled,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="gap-2 relative h-full flex-1">
      {label && (
        <View className="flex-row">
          <Text className="font-BeVietnamRegular text-14 text-mineShaft-950 ml-2">
            {label}
          </Text>
          {required && (
            <Text className="font-BeVietnamRegular text-14 text-red-600 ml-2">
              *
            </Text>
          )}
        </View>
      )}
      <View
        className={cn(
          "border-1 border-mineShaft-200 bg-white-50 px-3 py-3 rounded-xl flex-row items-center gap-2",
          disabled && "bg-mineShaft-50",
          className
        )}
      >
        {prefix}
        <TextInput
          multiline={true}
          readOnly={disabled}
          value={type === "number" ? convertToNumber(value) : value}
          onChangeText={(text) =>
            type === "number"
              ? onChange && onChange(text.replace(/[^0-9,]/g, ""))
              : onChange && onChange(text)
          }
          className={`h-full flex-1 text-14 font-BeVietnamRegular text-mineShaft-600 caret-mineShaft-700 ${classNameInput}`}
          secureTextEntry={type === "password" && !showPassword}
          textContentType="none"
          keyboardType={
            type === "number" || type === "code" || type === "phone"
              ? "numeric"
              : "default"
          }
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

export default TextArea;
