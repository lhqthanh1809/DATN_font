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

interface Props {
  label?: string;
  onChange?: () => void;
  style?: StyleProp<ViewStyle>;
  className?: string;
  type?: string;
  icon?: ReactNode;
}

function Input({
  label,
  onChange,
  style,
  className,
  type = "text",
  icon,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex gap-2">
      {label && (
        <Text className="font-BeVietnamRegular text-14 text-mineShaft-950 ml-2">
          {label}
        </Text>
      )}
      <View className="border-1.5 border-woodSmoke-200 px-2 h-[3.75rem] rounded-xl flex-row items-center gap-2">
        <TextInput
          className={`py-0 flex-1 text-14 font-BeVietnamRegular text-doveGray-500 caret-doveGray-600 ${className}`}
          secureTextEntry={type === "password" && !showPassword}
        />
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
