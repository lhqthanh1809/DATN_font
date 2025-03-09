import { ReactNode } from "react";

export interface UIContextValue {
  openDatePicker: string | null;
  selectedDates: DatePickerState;
  setDatePicker: (id: string) => void;
  closeDatePicker: () => void;
  setDate: (id: string, date: Date) => void;
  showModal: (model: ReactNode) => void;
  hideModal: (callback?: () => void) => void;
}

export interface DatePickerState {
  [id: string]: Date | null;
}
