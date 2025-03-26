import { create } from "zustand";
import { ReactNode } from "react";
import { Bell, Chat, Home2, Document, Notification } from "@/ui/icon/symbol";
import { constant } from "@/assets/constant";
import ListLodging from "@pages/User/Lodging/List";
import ListNotify from "@/ui/layout/ViewListNotification";
import ListFeedback from "@/pages/Feedback/User/List";
import ListChannels from "@/pages/Chanel/list";

interface ITab {
  name: string;
  view: React.ReactNode
  icon: React.ElementType;
}

interface UserScreenStore {
  tabs: ITab[];
  tab: ITab | null;
  updateTabs: (user: { id?: string }) => void;
  setTab: (tab: ITab) => void;
}

const useUserScreenStore = create<UserScreenStore>((set, get) => ({
  tabs: [],
  tab: null,

  setTab: (tab) => set({ tab }),

  updateTabs: (user) => {
    const newTabs: ITab[] = [
      {
        name: "Thuê trọ",
        icon: Home2,
        view: <ListLodging/>
      },
      {
        name: "Trò chuyện",
        icon: Chat,
        view: <ListChannels memberId={user.id ?? ""} memberType={constant.object.type.user}/>,
      },
      {
        name: "Hợp đồng",
        icon: Document,
        view: <></>,
      },
      {
        name: "Thông báo",
        icon: Bell,
        view: <ListNotify id={user?.id ?? ""} type={constant.object.type.user}/>,
      },
      {
        name: "Phản hồi",
        icon: Notification,
        view: <ListFeedback />,
      },
    ];

    set({ tabs: newTabs });

    const currentTab = get().tab;
    if (!currentTab || !newTabs.some((t) => t.name === currentTab.name)) {
      set({ tab: newTabs[0] });
    }
  },

}));

export default useUserScreenStore;
