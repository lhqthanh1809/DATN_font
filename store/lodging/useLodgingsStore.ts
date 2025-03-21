import { create } from 'zustand';
import { ILodging } from '@/interfaces/LodgingInterface';

interface LodgingState {
  lodgings: ILodging[];
  setLodgings: (data: ILodging[]) => void;
  updateLodging: (lodging: ILodging) => void;
  removeLodging: (id: string) => void;
}

const useLodgingsStore = create<LodgingState>((set) => ({
  lodgings: [],
  setLodgings: (data) => set({ lodgings: data }),
  updateLodging: (lodging) =>
    set((state) => ({
      lodgings: state.lodgings.some((item) => item.id === lodging.id)
        ? state.lodgings.map((item) =>
            item.id === lodging.id ? lodging : item
          )
        : [...state.lodgings, lodging],
    })),
  removeLodging: (id) =>
    set((state) => ({
      lodgings: state.lodgings.filter((lodging) => lodging.id !== id),
    })),
}));

export default useLodgingsStore;