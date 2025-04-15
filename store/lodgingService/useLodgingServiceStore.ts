import { ILodgingService } from "@/interfaces/LodgingServiceInterface";
import LodgingServiceManagerService from "@/services/LodgingService/LodgingServiceManagerService";
import { isArray } from "lodash";
import { create } from "zustand";

interface ILodgingServiceStore {
  services: (ILodgingService & {
    current_value: any;
  })[];
  loading: boolean;
  fetchServiceByRoom: (roomId: string) => void;
  setCurrentValue: (id: string, value: string) => void;
}

const useLodgingServiceStore = create<ILodgingServiceStore>((set) => {
  const lodgingService = new LodgingServiceManagerService();
  return {
    services: [],
    loading: false,

    fetchServiceByRoom: async (roomId) => {
      set({ loading: true });

      const result = await lodgingService.listByRoom(roomId);

      if (isArray(result)) {
        const services = result.map((service) => ({
          ...service,
          current_value:
            service.room_services?.find((item) => item.room_id == roomId)
              ?.last_recorded_value ?? 0,
        }));

        set({ services });
      }

      set({ loading: false });
    },

    setCurrentValue: (id, value) => {
      set((state) => ({
        services: state.services.map((service) =>
          service.id === id ? { ...service, current_value:  value } : service
        ),
      }));
    },
  };
});

export default useLodgingServiceStore;
