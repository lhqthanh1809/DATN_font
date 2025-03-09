import { DatePickerState, UIContextValue } from "@/interfaces/UIInterface";
import Button from "@/ui/button";
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
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const showModal = (content: ReactNode) => setModalContent(content);
  const hideModal = (callback?: () => void) => {
    setModalContent(null);
    callback;
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
                    onChange={({ date }) =>
                      setDate(openDatePicker, date as Date)
                    }
                    styles={{
                      month_selector_label: { textTransform: "capitalize" },
                    }}
                    classNames={{
                      ...getDefaultClassNames,
                      selected: "rounded-full bg-lime-500",
                      selected_label: "font-BeVietnamSemiBold text-lime-50",
                      day: "",
                      day_label: "font-BeVietnamRegular",
                      day_cell: "p-1",
                      today_label: "font-BeVietnamSemiBold text-lime-500",
                      month_label: " font-BeVietnamRegular",
                      weekday_label: "font-BeVietnamSemiBold text-lime-800",
                      year_label: "font-BeVietnamRegular",
                      year_selector_label: "font-BeVietnamMedium",
                      month_selector_label: "font-BeVietnamMedium",
                      time_selector_label: "bg-black",
                      button_next: "bg-lime-600 rounded-full",
                      button_prev: "bg-lime-600 rounded-full",
                      weekdays: "border-b-1",
                      outside: "bg-black",
                      outside_label: "text-black",
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

      {modalContent && (
        <TouchableWithoutFeedback onPress={() => hideModal()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="absolute w-screen h-screen bg-black/50 z-30 top-0"
          >
            <View className="flex-1 h-full w-full">{modalContent}</View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      )}
    </UIContext.Provider>
  );
};
