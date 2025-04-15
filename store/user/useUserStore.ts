import { create } from "zustand";

interface Gender {
  name: string;
  value: boolean;
}

interface UserStore {
  genders: Gender[];
}

const useUserStore = create<UserStore>(() => ({
  genders: [
    {
      name: "Nam",
      value: false,
    },
    {
      name: "Nữ",
      value: true,
    },
  ],
}));

export default useUserStore;
