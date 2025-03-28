import { create } from "zustand";
import { ReactNode } from "react";
import { Bell, Chat, Home2, Document, Notification } from "@/ui/icon/symbol";
import { constant } from "@/assets/constant";
import ListNotify from "@/ui/layout/ViewListNotification";
import ListFeedback from "@/pages/Feedback/Management/List";
import HomeScreen from "@/pages/Lodging/Main/screen";
import { Setting } from "@/ui/icon/active";
import SettingScreen from "@/pages/Lodging/Setting/Setting";
import ListChannels from "@/pages/Channel/List";

interface ITab {
  name: string;
  slug: string;
  view: React.ReactNode;
  icon: React.ElementType;
}

interface ManagerScreenStore {
  tabs: ITab[];
  tab: ITab | null;
  updateTabs: (lodgingId: string) => void;
  setTab: (tab: ITab) => void;
}

const useManagerScreenStore = create<ManagerScreenStore>((set, get) => ({
  tabs: [],
  tab: null,

  setTab: (tab) => set({ tab }),

  updateTabs: (lodgingId) => {
    const newTabs: ITab[] = [
      {
        name: "Trang chủ",
        slug: "home",
        icon: Home2,
        view: <HomeScreen id={lodgingId} />,
      },
      {
        name: "Trò chuyện",
        slug: "chat",
        icon: Chat,
        view: <ListChannels hasTitle memberId={lodgingId} memberType={constant.object.type.lodging}/>,
      },
      {
        name: "Phản hồi",
        slug: "feedback",
        icon: Notification,
        view: <ListFeedback lodgingId={lodgingId} />,
      },
      {
        name: "Thông báo",
        slug: "notification",
        icon: Bell,
        view: (
          <ListNotify
            id={lodgingId as string}
            type={constant.object.type.lodging}
            hasTitle={true}
          />
        ),
      },
      {
        name: "Cài đặt",
        slug: "setting",
        icon: Setting,
        view: <SettingScreen lodgingId={lodgingId}/>,
      },
    ];

    set({ tabs: newTabs });

    const currentTab = get().tab;
    if (!currentTab || !newTabs.some((t) => t.name === currentTab.name)) {
      set({ tab: newTabs[0] });
    }
  },
}));

export default useManagerScreenStore;