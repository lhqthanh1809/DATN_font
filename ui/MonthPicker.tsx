import { cn, getTimezone } from "@/helper/helper";
import { useUI } from "@/hooks/useUI";
import moment from "moment";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Button from "./Button";
import { number } from "yup";
import Divide from "./Divide";
import Icon from "./Icon";
import { CrossMedium } from "./icon/symbol";

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

const MonthPicker = ({
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
}: Props) => {
  const { showModal } = useUI();

  const openModal = useCallback(() => {
    showModal(
      <ModalMonthPicker
        value={value}
        onChange={(date) => onChange && onChange(date)}
      />
    );
  }, [value]);

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
        className="z-10 relative"
        onPress={() => {
          Keyboard.dismiss();
          openModal();
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
              ? moment(new Date(value))
                  .tz(getTimezone())
                  .format("[Tháng] MM/YYYY")
              : placeHolder}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const ModalMonthPicker: React.FC<{
  value: Date | null;
  onChange: (date: Date) => void;
}> = ({ value, onChange }) => {
  const { hideModal } = useUI();
  const [selectDate, setSelectDate] = useState<Date | null>(value);
  const [currentYear, setCurrentYear] = useState<number>(
    value ? value.getFullYear() : new Date().getFullYear()
  );
  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    selectDate && onChange(selectDate);
  }, [selectDate]);

  const handleSelectDate = useCallback((month: number, year: number) => {
    setSelectDate(new Date(year, month, 1));
  }, []);

  return (
    <View className="absolute w-full h-full top-0 left-0 items-center justify-center">
      <View className="w-full px-4">
        <Button className="bg-white-50 p-3 flex-col gap-2">
          <View className="w-full">
            {/* Year */}
            <View className="flex-row justify-between items-center">
              <Button
                onPress={() => {
                  setCurrentYear(currentYear - 1);
                }}
                className="flex-1"
              >
                <Text className="font-BeVietnamSemiBold text-16 py-3">
                  {currentYear - 1}
                </Text>
              </Button>

              <Button className="flex-1">
                <Text className="font-BeVietnamSemiBold text-16 py-3 text-lime-700">
                  {currentYear}
                </Text>
              </Button>

              <Button
                onPress={() => {
                  setCurrentYear(currentYear + 1);
                }}
                className="flex-1"
              >
                <Text className="font-BeVietnamSemiBold text-16 py-3">
                  {currentYear + 1}
                </Text>
              </Button>
            </View>

            {/* Line */}
            <View className="flex-row justify-between items-center">
              <View className="h-1 flex-1 bg-lime-200 rounded-l-full" />
              <View className="h-1 flex-1 bg-lime-500" />
              <View className="h-1 flex-1 bg-lime-200 rounded-r-full" />
            </View>
          </View>

          {/* Month */}
          <View className="flex-wrap flex-row">
            {[...Array(12)].map((_, index) => (
              <Button
                key={index}
                onPress={() => handleSelectDate(index, currentYear)}
                className={cn(
                  "flex-col flex-1 basis-1/4 gap-1 p-4",
                  selectDate && index === selectDate.getMonth() && selectDate.getFullYear() == currentYear && "bg-lime-100"
                )}
              >
                <Text
                  style={{ fontSize: 16 }}
                  className={cn(
                    "font-BeVietnamSemiBold",
                    selectDate &&
                      index === selectDate.getMonth() && selectDate.getFullYear() == currentYear &&
                      "text-lime-700"
                  )}
                >
                  {index < 9 && "0"}
                  {index + 1}
                </Text>
                <Text className="font-BeVietnamRegular text-12">
                  {currentYear}
                </Text>
                {index === now.getMonth() && (
                  <View className="absolute right-4 top-4 w-2 h-2 bg-lime-400 rounded-full" />
                )}
              </Button>
            ))}
          </View>

          {/* Close */}
          <Divide className="h-0.25" />
          <Button
            onPress={hideModal}
            className="w-full gap-3 items-center py-2"
          >
            <Icon icon={CrossMedium} strokeWidth={2} />
            <Text className="font-BeVietnamSemiBold text-16">Đóng chọn</Text>
          </Button>
        </Button>
      </View>
    </View>
  );
};

export default MonthPicker;
