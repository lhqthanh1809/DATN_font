import { create } from "zustand";
import uuid from "react-native-uuid";

interface IToast {
  id: string;
  type: number;
  message: string;
}

interface IToastStore {
  toasts: IToast[];
  addToast: (type: number, message: string) => void;
  removeToast: (id: string) => void;
}

const useToastStore = create<IToastStore>((set) => ({
  toasts: [],

  addToast: (type, message) => {
    const id = uuid.v4() as string;

    const newToast: IToast = { id, type, message };

    set((state) => ({
      toasts: [newToast, ...state.toasts],
    }));

    // Tự động xoá sau 2 giây
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 2000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

export default useToastStore;