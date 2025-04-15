import { DatePickerState, UIContextValue } from "@/interfaces/UIInterface";
import Button from "@/ui/Button";
import Calendar from "@/ui/date/Calendar";
import { weekdays } from "moment";
import React, { createContext, ReactNode, useState } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import DateTimePicker, {
  getDefaultClassNames,
} from "react-native-ui-datepicker";

// Tạo context
export const UIContext = createContext<UIContextValue | undefined>(undefined);

// Tạo Provider
export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [openDatePicker, setOpenDatePicker] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<DatePickerState>({});
  const [idPicker, setIdPicker] = useState<string | null>(null);
  const [modals, setModals] = useState<ReactNode[]>([]);

  const showModal = (content: ReactNode) => {
    setModals((prev) => [...prev, content]);
  };

  const hideModal = (index?: number, callback?: () => void) => {
    setModals((prev) => {
      if (typeof index === "number") {
        return prev.filter((_, i) => i !== index);
      }
      // Nếu không truyền index, đóng modal cuối cùng
      return prev.slice(0, -1);
    });
  };

  const setDatePicker = (id: string) => {
    setOpenDatePicker(id);
    setIdPicker(id);
  };

  const closeDatePicker = () => {
    Keyboard.dismiss();
    setOpenDatePicker(null);
    setIdPicker(null);
  };

  const setDate = (id: string, date: Date) => {
    setSelectedDates((prev) => ({ ...prev, [id]: date }));
  };

  return (
    <UIContext.Provider
      value={{
        openDatePicker,
        selectedDates,
        setDatePicker,
        closeDatePicker,
        setDate,
        showModal,
        hideModal,
      }}
    >
      {children}

      {/* Hiển thị DateTimePicker nếu có DatePicker đang mở */}
      {openDatePicker && (
        <TouchableWithoutFeedback onPress={closeDatePicker}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="absolute w-screen h-screen bg-black/50 z-50 top-0"
          >
            <View className="flex-1 h-full w-full">
              <View className="absolute bottom-0 p-2 gap-2">
                <Pressable
                  onPress={() => {}}
                  className="bg-white-50 flex-1 pt-2 px-8 rounded-3xl"
                >
                  <DateTimePicker
                    mode="single"
                    //   date={selectedDate}
                    locale="vi-VN"
                    date={idPicker ? selectedDates[idPicker] : undefined}
                    onChange={({ date }) => {
                      setDate(openDatePicker, new Date(date as Date));
                    }}
                    showOutsideDays={true}
                    navigationPosition={"right"}
                    weekdaysFormat="short"
                    weekdaysHeight={36}
                    styles={{
                      month_selector_label: { textTransform: "capitalize" },
                    }}
                    components={Calendar}
                    classNames={{
                      ...getDefaultClassNames,
                      selected: "rounded-xl bg-lime-500",
                      selected_label: "font-BeVietnamSemiBold text-lime-50",
                      day: "",
                      day_label: "font-BeVietnamRegular",
                      day_cell: "p-1",
                      today_label: "font-BeVietnamSemiBold text-lime-500",
                      month_label: " font-BeVietnamRegular capitalize",
                      year_label: "font-BeVietnamRegular",
                      year_selector_label: "font-BeVietnamSemiBold text-16",
                      month_selector_label: "font-BeVietnamSemiBold text-16",
                      time_selector_label: "bg-black",
                      button_next: "bg-lime-600 rounded-lg",
                      button_prev: "bg-lime-600 rounded-lg",
                      weekdays: "bg-lime-100 rounded-full",
                      outside_label: "text-mineShaft-100",
                    }}
                  />
                  {/* <Button>
                <Text className="font-BeVietnamSemiBold text-16 py-4 text-mineShaft-950">
                  Xác nhận
                </Text>
              </Button> */}
                </Pressable>
                <Button className="bg-white-50" onPress={closeDatePicker}>
                  <Text className="font-BeVietnamSemiBold text-16 py-4 text-mineShaft-950">
                    Đóng
                  </Text>
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      )}
      {modals.map((modal, index) => (
        <TouchableWithoutFeedback key={index} onPress={() => hideModal(index)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="absolute w-screen h-screen bg-black/50 z-30 top-0"
          >
            <View className="flex-1 h-full w-full">{modal}</View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      ))}
    </UIContext.Provider>
  );
};
