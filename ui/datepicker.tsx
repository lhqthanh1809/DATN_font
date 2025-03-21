import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import moment from "moment-timezone";
import { cn, getTimezone } from "@/helper/helper";
import { useUI } from "@/hooks/useUI";
import uuid from "react-native-uuid";

interface Props {
  label?: string;
  onChange?: (date: Date) => void;
  style?: StyleProp<ViewStyle>;
  className?: string;
  icon?: ReactNode;
  value: Date | null;
  placeHolder?: string;
  disabled?: boolean;
  prefix?: ReactNode;
  required?: boolean;
}

function DatePicker({
  label,
  onChange,
  style,
  className,
  icon,
  value,
  placeHolder = "",
  disabled = false,
  required,
  prefix,
}: Props) {
  const { selectedDates, setDatePicker, setDate } = useUI();
  const [date, setDateLocal] = useState<Date | null>(value);
  const id = useMemo(() => {
    return uuid.v4();
  }, []);

  useEffect(() => {
    if (!date) return;
    onChange && onChange(date);
  }, [date]);

  useEffect(() => {
    if (!value) return;
    setDate(id, value);
  }, [value]);

  useEffect(() => {
    if (selectedDates[id] && selectedDates[id] !== date) {
      setDateLocal(selectedDates[id]);
    }
  }, [selectedDates[id]]);

  return (
    <View className="flex gap-2 flex-1">
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
      <Pressable
        disabled={disabled}
        className="z-10 relative flex-1"
        onPress={() => {
          Keyboard.dismiss();
          setDatePicker(id);
        }}
      >
        <View
          className={cn(
            "border-1 border-mineShaft-200 px-3 h-[3rem] rounded-xl flex-row items-center gap-2 relative w-full",
            disabled && "bg-mineShaft-50"
          )}
        >
          {prefix}
          <Text
            className={cn(
              `py-0 flex-1 text-14 font-BeVietnamRegular text-mineShaft-600 ${className}`,
              !value && "text-mineShaft-300"
            )}
          >
            {value
              ? moment(new Date(value)).tz(getTimezone()).format("DD/MM/YYYY")
              : placeHolder}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default DatePicker;
