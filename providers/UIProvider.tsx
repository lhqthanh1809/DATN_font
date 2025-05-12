import { DatePickerState, UIContextValue } from "@/interfaces/UIInterface";
import Button from "@/ui/Button";
import Calendar from "@/ui/date/Calendar";
import { weekdays } from "moment";
import NetInfo from "@react-native-community/netinfo";
import * as Haptics from "expo-haptics";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Linking,
} from "react-native";
import DateTimePicker, {
  useDefaultClassNames,
} from "react-native-ui-datepicker";
import Icon from "@/ui/Icon";
import { Wifi } from "@/ui/icon/symbol";

// Tạo context
export const UIContext = createContext<UIContextValue | undefined>(undefined);

// Tạo Provider
export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [openDatePicker, setOpenDatePicker] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<DatePickerState>({});
  const [idPicker, setIdPicker] = useState<string | null>(null);
  const [modals, setModals] = useState<ReactNode[]>([]);
  const [isConnected, setConnected] = useState(true);

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

  const retryConnection = useCallback(async () => {
    const state = await NetInfo.fetch();

    const isConnected = !!(state?.isConnected && state?.isInternetReachable);
    setConnected(isConnected);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state?.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

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
                      ...useDefaultClassNames,
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

      {!isConnected && (
        <View className="absolute w-screen h-screen bg-black/50 z-50 items-center justify-center p-4">
          <View className="bg-white-50 p-6 rounded-2xl items-center w-full gap-5">
            <View className="bg-white-200 p-6 rounded-full">
              <Icon
                icon={Wifi}
                strokeWidth={2}
                className="text-mineShaft-950"
              />
            </View>

            <View className="gap-2 items-center">
              <Text className="font-BeVietnamSemiBold text-18">
                Không có kết nối Internet
              </Text>
              <Text className="font-BeVietnamRegular">
                Vui lòng kiểm tra cài đặt mạng của bạn và thử lại.
              </Text>
            </View>

            <View className="gap-3 w-full">
              <Button
                className="bg-lime-400 w-full p-3"
                onPress={retryConnection}
              >
                <Text className="font-BeVietnamMedium text-mineShaft-950 text-16">
                  Thử lại
                </Text>
              </Button>

              <Button
                className="border-1 border-white-200 w-full p-3"
                onPress={() => Linking.openSettings()}
              >
                <Text className="font-BeVietnamMedium text-mineShaft-950 text-16">
                  Chuyển đến cài đặt
                </Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </UIContext.Provider>
  );
};
