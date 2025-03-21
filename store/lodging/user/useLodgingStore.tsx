import { create } from "zustand";
import { ILodging } from "@/interfaces/LodgingInterface";
import ClientService from "@/services/Client/ClientService";
import { isArray } from "lodash";
import { useUI } from "@/hooks/useUI";
import { ReactNode } from "react";
import ModelConfirmDelete from "@/pages/Lodging/ModalConfirmDelete";

interface LodgingState {
  lodgings: (ILodging & { showContracts: boolean })[];
  loading: boolean;
  fetchLodgings: () => Promise<void>;
  toggleShowContracts: (id: string) => void;
  search: {
    value: string;
    onChange: (text: string) => void;
  };

  deleteLodging: (
    lodgingId: string,
    showModal: (model: ReactNode) => void
  ) => void;
}

// Khởi tạo Zustand store
const useLodgingStore = create<LodgingState>((set) => ({
  lodgings: [],
  loading: false,

  fetchLodgings: async () => {
    set({ loading: true });
    const clientService = new ClientService();
    const data = await clientService.listLodgingAndRoomFromContractByUser({
      with_contracts: true,
    });

    if (isArray(data)) {
      set({
        lodgings: data.map((item) => ({ ...item, showContracts: false })),
      });
    }
    set({ loading: false });
  },

  toggleShowContracts: (id: string) =>
    set((state) => ({
      lodgings: state.lodgings.map((lodging) =>
        lodging.id === id
          ? { ...lodging, showContracts: !lodging.showContracts }
          : lodging
      ),
    })),

  search: {
    value: "",
    onChange: (text: string) =>
      set((state) => ({
        search: {
          ...state.search,
          value: text,
        },
      })),
  },

  deleteLodging: (lodgingId: string, showModal: (model: ReactNode) => void) => {
    showModal(<ModelConfirmDelete lodgingId={lodgingId} />);
  },
}));

export default useLodgingStore;
