import { useGeneral } from "@/hooks/useGeneral";
import useUserScreenStore from "@/store/user/useUserScreenStore";
import Menu from "@/ui/layout/Menu";
import { View } from "moti";
import { useEffect } from "react";

const PersonScreen = () => {
  const { user } = useGeneral(); // Lấy user từ hook
  const { tabs, tab, setTab, updateTabs } = useUserScreenStore();

  // Cập nhật tabs khi user.id thay đổi
  useEffect(() => {
    if (user) {
      updateTabs(user);
    }
  }, [user]);

  return (
    <View className="flex-1 bg-white-50">
      <View className="flex-1">{tab?.view || tabs[0]?.view}</View>
      <Menu
        items={tabs}
        active={tab || tabs[0]}
        onChange={(item: any) => setTab(item)}
      />
    </View>
  );
};

export default PersonScreen;
