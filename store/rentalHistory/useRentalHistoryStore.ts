import { create } from "zustand";
import { IListRental, IRentalHistory } from "@/interfaces/RentalInterface";
import RentalHistory from "@/services/RentalHistory/RentalHistoryService";
import { isArray } from "lodash";
import useToastStore from "../toast/useToastStore";
import { constant } from "@/assets/constant";
import axios, { CancelTokenSource } from "axios";

interface RentalHistoryStore {
  rentals: IRentalHistory[];
  loading: boolean;
  cancelTokenSource?: CancelTokenSource;
  fetchRental: (data: IListRental) => Promise<void>;
}
export const useRentalHistoryStore = create<RentalHistoryStore>((set, get) => ({
  rentals: [],
  loading: false,

  fetchRental: async (data: IListRental) => {
    set({ loading: true });
    const addToast = useToastStore.getState().addToast;
    const prevSource = get().cancelTokenSource;
    if (prevSource) {
      prevSource.cancel("Request canceled due to a new fetch call.");
    }

    const newSource = axios.CancelToken.source();
    set({ cancelTokenSource: newSource });

    try {
      const res = await new RentalHistory().list(data, newSource.token);

      if (isArray(res)) {
        set({ rentals: res });
      } else {
        addToast(
          constant.toast.type.error,
          res.message || "Failed to fetch rentals"
        );
      }
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        addToast(
          constant.toast.type.error,
          "An error occurred while fetching rentals."
        );
      }
    } finally {
      set({ loading: false });
    }
  },
}));