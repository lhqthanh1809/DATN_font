import { create } from "zustand";
import { LodgingType } from "@/interfaces/LodgingInterface";

interface LodgingTypeState {
  lodgingTypes: LodgingType[];
  setLodgingTypes: (data: LodgingType[]) => void;
}

const useLodgingTypeStore = create<LodgingTypeState>((set) => ({
  lodgingTypes: [],
  setLodgingTypes: (data) => set({ lodgingTypes: data }),
}));

export default useLodgingTypeStore;