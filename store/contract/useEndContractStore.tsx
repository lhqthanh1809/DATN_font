import { create } from "zustand";

interface IEndContractStore {
  endDate: Date;
  setEndDate: (date: Date) => void;

}

const useEndContractStore = create<IEndContractStore>((set) => ({
  endDate: new Date(),

  // Setter
  setEndDate: (date) => {
    set({ endDate: date });
  },


}));

export default useEndContractStore;
