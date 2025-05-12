import { create } from "zustand";
import RoomServiceInvoiceService from "@/services/RoomServiceInvoice/RoomServiceInvoiceService";
import { IRoomServiceInvoice } from "@/interfaces/RoomServiceInvoiceInterface";
import { isArray } from "lodash";

interface RoomUsageState {
  roomUsages: IRoomServiceInvoice[];
  loading: boolean;
  fetchRoomUsages: (lodgingId: string) => Promise<void>;
  removeRoomUsage: (id: string) => void;
}

export const useListRoomUsageStore = create<RoomUsageState>((set) => {
  const roomUsageService = new RoomServiceInvoiceService();

  return {
    roomUsages: [],
    loading: false,
    fetchRoomUsages: async (lodgingId: string) => {
      set({ loading: true });
      try {
        const result = await roomUsageService.listRoomServiceNeedClose(lodgingId);
        if (isArray(result)) {
          set({ roomUsages: result });
        }
      } catch (err) {
        console.error(err);
      } finally {
        set({ loading: false });
      }
    },

    removeRoomUsage: (id: string) => {
      set((state) => ({
        roomUsages: state.roomUsages.filter((usage) => usage.id !== id),
      }));
    },
  };
});