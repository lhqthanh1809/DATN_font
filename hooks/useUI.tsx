import { UIContext } from "@/providers/UIProvider";
import { useContext } from "react";

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useDatePicker must be used within a DatePickerProvider");
  }
  return context;
};
