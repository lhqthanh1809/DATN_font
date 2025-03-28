// stores/useEquipmentStore.ts
import { create } from "zustand";
import { AssetInfo } from "expo-media-library";
import { constant } from "@/assets/constant";
import { EquipmentService } from "@/services/Equipment/EquipmentService";
import { router } from "expo-router";
import { IEquipment, IUpdateEquipment } from "@/interfaces/EquipmentInterface";
import { IRoom } from "@/interfaces/RoomInterface";
import useToastStore from "../toast/useToastStore";
import { IError } from "@/interfaces/ErrorInterface";

interface EquipmentState {
  equipment: IEquipment | null;
  rooms: IRoom[];
  selectRooms: IRoom[];
  quantity: number;
  name: string;
  type: number;
  selectPhotos: (AssetInfo | string)[];
  loading: boolean;
  loadingProcess: boolean;

  fetchEquipment: (id: string) => Promise<void>;
  handleUpdateEquipment: (lodgingId: string) => Promise<void>;

  setEquipment: (equipment: IEquipment) => void;
  setRooms: (rooms: IRoom[]) => void;
  setSelectRooms: (rooms: IRoom[]) => void;
  setQuantity: (quantity: number) => void;
  setName: (name: string) => void;
  setType: (type: number) => void;
  setSelectPhotos: (photos: (AssetInfo | string)[]) => void;
  reset: () => void;
}

export const useEquipmentStore = create<EquipmentState>((set, get) => {
  const equipmentService = new EquipmentService();
  const { addToast } = useToastStore.getState();

  return {
    equipment: null,
    rooms: [],
    selectRooms: [],
    quantity: 1,
    name: "",
    type: constant.equipment.type.private,
    selectPhotos: [],
    loading: false,
    loadingProcess: false,

    setEquipment: (equipment: IEquipment) =>
      set({
        equipment,
        name: equipment.name,
        quantity: equipment.quantity,
        type: equipment.type,
        selectPhotos: [equipment.thumbnail],
        selectRooms:
          equipment.room_setups
            ?.map((item) => item.room ?? null)
            .filter((item) => item !== null) || [],
      }),

    // Fetch equipment detail
    fetchEquipment: async (id: string) => {
      set({ loading: true });
      try {
        const result = await equipmentService.detailEquipment(id);

        if (result.hasOwnProperty("message")) {
          addToast(constant.toast.type.error, (result as IError).message);
          router.back();
          return;
        }

        const equipment = result as IEquipment;
        get().setEquipment(equipment);
      } catch (err) {
        console.log(err);
      } finally {
        set({ loading: false });
      }
    },

    // Update equipment
    handleUpdateEquipment: async (lodgingId: string) => {
      const { selectPhotos, name, quantity, selectRooms, type, equipment } =
        get();

      const images = selectPhotos.filter(
        (item) => typeof item == "string" || item.mediaType === "photo"
      );

      if (images.length <= 0) {
        addToast(constant.toast.type.error, "Ảnh đại diện là bắt buộc");
        return;
      }

      if (!name) {
        addToast(constant.toast.type.error, "Tên thiết bị là bắt buộc");
        return;
      }

      if (!quantity) {
        addToast(constant.toast.type.error, "Số lượng là bắt buộc");
        return;
      }

      if (!equipment) {
        addToast(constant.toast.type.error, "Trang thiết bị không tồn tại.");
        return;
      }

      if (quantity < selectRooms.length) {
        addToast(
          constant.toast.type.error,
          "Số lượng trang thiết bị không đủ để trang bị"
        );
        return;
      }

      set({ loadingProcess: true });
      try {
        const formData = new FormData();
        let thumbnail = images[0];

        if (typeof thumbnail !== "string") {
          const response = await fetch(thumbnail.uri);
          const blob = await response.blob();

          formData.append("thumbnail", {
            uri: thumbnail.uri,
            type: blob.type,
            name: thumbnail.filename,
          } as any);
        } else {
          formData.append("thumbnail", thumbnail);
        }

        const roomIds =
          selectRooms.length > 0
            ? selectRooms
                .map((item) => item.id ?? null)
                .filter((item) => item != null)
            : [];

        // Step 3: Create FormData
        formData.append("id", equipment.id);
        formData.append("lodging_id", lodgingId);
        formData.append("name", name);
        formData.append("type", type.toString());
        formData.append("quantity", quantity.toString());
        roomIds.forEach((roomId) => {
          formData.append("room_ids[]", roomId as string);
        });

        const result = await equipmentService.updateEquipment(formData);
        if ("message" in result) {
          addToast(constant.toast.type.error, result.message);
          return;
        }
        addToast(
          constant.toast.type.success,
          "Cập nhập trang thiết bị thành công!"
        );

        get().setEquipment(result as IEquipment);
      } catch (error) {
        console.log(error);
      } finally {
        set({ loadingProcess: false });
      }
    },

    // Setters
    setRooms: (rooms) => set({ rooms }),
    setSelectRooms: (selectRooms) => set({ selectRooms }),
    setQuantity: (quantity) => set({ quantity }),
    setName: (name) => set({ name }),
    setType: (type) => set({ type }),
    setSelectPhotos: (selectPhotos) => set({ selectPhotos }),

    // Reset toàn bộ store
    reset: () =>
      set({
        equipment: null,
        rooms: [],
        selectRooms: [],
        quantity: 1,
        name: "",
        type: constant.equipment.type.private,
        selectPhotos: [],
        loading: false,
        loadingProcess: false,
      }),
  };
});
