import { create } from "zustand";
import { LocationUnit } from "@/interfaces/LocationInterface";

interface LocationState {
  provinces: LocationUnit[];
  districts: Record<number, LocationUnit[]>;
  wards: Record<number, LocationUnit[]>;
  setProvinces: (data: LocationUnit[]) => void;
  setDistricts: (parentId: number, data: LocationUnit[]) => void;
  setWards: (parentId: number, data: LocationUnit[]) => void;
}

const useLocationStore = create<LocationState>((set) => ({
  provinces: [],
  districts: {},
  wards: {},
  setProvinces: (data) => set({ provinces: data }),
  setDistricts: (parentId, data) =>
    set((state) => ({
      districts: { ...state.districts, [parentId]: data },
    })),
  setWards: (parentId, data) =>
    set((state) => ({
      wards: { ...state.wards, [parentId]: data },
    })),
}));

export default useLocationStore;