import { create } from "zustand";
import RoomUsageService from "@/services/RoomUsage/RoomUsageService";
import { IRoomUsage } from "@/interfaces/RoomUsageInterface";
import { isArray } from "lodash";

interface RoomUsageState {
  roomUsages: IRoomUsage[];
  loading: boolean;
  fetchRoomUsages: (lodgingId: string) => Promise<void>;
  removeRoomUsage: (id: string) => void;
}

export const useListRoomUsageStore = create<RoomUsageState>((set) => {
  const roomUsageService = new RoomUsageService();

  return {
    roomUsages: [],
    loading: false,
    fetchRoomUsages: async (lodgingId: string) => {
      set({ loading: true });
      try {
        const result = await roomUsageService.listRoomUsageNeedClose(lodgingId);
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