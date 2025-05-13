import { ReactNode } from "react";
import { DateType } from "react-native-ui-datepicker";

export interface UIContextValue {
  selectedDates: DatePickerState;

  closeDatePicker: () => void;
  // setDate: (id: string, date: Date) => void;
  showModal: (model: ReactNode) => void;
  hideModal: (index?: number, callback?: () => void) => void;

  openDatePicker: (date: Date | null, callback: (date: Date) => void) => void;
}

export interface DatePickerState {
  [id: string]: Date | null;
}
