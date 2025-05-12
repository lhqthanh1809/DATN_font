import {
  IListPaymentHistory,
  IPaymentHistory,
} from "@/interfaces/PaymentHistoryInterface";
import { create } from "zustand";
import uuid from "react-native-uuid";
import moment from "moment";
import PaymentHistoryService from "@/services/PaymentHistory/PaymentHistoryService";
import useToastStore from "../toast/useToastStore";
import { constant } from "@/assets/constant";

interface IPaymentHistoryStore {
  paymentHistories: IPaymentHistory[];

  addPaymentHistory: (
    objectId: string,
    objectType: "rent" | "service",
    amount: number,
    paymentMethod: string,
  ) => void;
  list: (data: IListPaymentHistory) => void;
}

const usePaymentHistoryStore = create<IPaymentHistoryStore>((set, get) => {
  const paymentHistoryService = new PaymentHistoryService();
  return {
    paymentHistories: [],

    addPaymentHistory: (objectId, objectType, amount, paymentMethod) => {
      const history: IPaymentHistory = {
        id: uuid.v4(),
        amount,
        object_id: objectId,
        object_type: objectType,
        note: null,
        created_at: moment().toISOString(true),
        paid_at: moment().toISOString(true),
        payment_method: paymentMethod
      };

      set((state) => ({
        paymentHistories: [history, ...state.paymentHistories],
      }));
    },

    list: async (data) => {
      try {
        const result = await paymentHistoryService.list(data);

        if ("message" in result) {
          throw new Error(result.message);
        }

        set({
          paymentHistories: result.data,
        });
      } catch (err: any) {
        useToastStore
          .getState()
          .addToast(
            constant.toast.type.error,
            err.message || "Lỗi không xác định"
          );
      }
    },
  };
});

export default usePaymentHistoryStore