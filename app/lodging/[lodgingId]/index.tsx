import { Bell, Chat, Home2, Notification } from "@/ui/icon/symbol";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { constant } from "@/assets/constant";
import { Setting } from "@/ui/icon/active";
import Menu from "@/ui/components/Menu";
import HomeScreen from "@/pages/Lodging/Main/screen";
import ListNotify from "@/ui/layouts/ViewListNotification";
import { useLocalSearchParams } from "expo-router";
import ListFeedback from "@/pages/Feedback/Management/List";
import useManagerScreenStore from "@/store/manager/useManagerScreenStore";

const HomeLodging = () => {
  const { lodgingId, slugTab } = useLocalSearchParams();
  const { tabs, tab, setTab, updateTabs } = useManagerScreenStore();
  
  useEffect(() => {
    if (lodgingId) {
      updateTabs(lodgingId as string);
    }
  }, [lodgingId, updateTabs]); 

  useEffect(() => {
    if (tabs.length > 0) {
      const tabActive = tabs.find(tab => tab.slug === slugTab) || tabs[0]; 
      setTab(tabActive);
    }
  }, [slugTab, tabs, setTab]); 

  return (
    <View className="flex-1 bg-white-50" style={{ paddingTop: 0 }}>
      {tab?.view || tabs[0]?.view}
      <Menu
        items={tabs}
        active={tab || tabs[0]}
        onChange={(item: any) => setTab(item)}
      />
    </View>
  );
};

export default HomeLodging;
