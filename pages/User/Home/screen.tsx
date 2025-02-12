import { useGeneral } from "@/hooks/useGeneral";
import Icon from "@/ui/icon";
import { Bell } from "@/ui/icon/symbol";
import { Text, View } from "react-native";
import { ManagementScreen, MenuHome, PersonScreen } from "./components";
import { Building } from "@/ui/icon/general";
import { Fingerprint } from "@/ui/icon/security";
import { useEffect, useMemo, useState } from "react";
import { ItemMenu } from "./components/MenuHome";

function HomeUser() {
  const { user } = useGeneral();
  const [navActive, setNavActive] = useState<ItemMenu | null>(null);

  const navItem = useMemo(
    () => [
      {
        text: "Cá nhân",
        icon: Fingerprint,
        screen: <PersonScreen />,
      },
      {
        text: "Quản lý",
        icon: Building,
        screen: <ManagementScreen />,
      },
    ],
    []
  );

  useEffect(() => setNavActive(navItem[0]), [])

  return (
    <View className="flex-1 bg-white-50">
      <View className="p-5 flex-row justify-between items-center border-b-1 border-white-100">
        <Text className="font-BeVietnamSemiBold text-18 text-mineShaft-950">
          {user?.full_name}
        </Text>
        <View className="relative">
          <Icon icon={Bell} className="text-white-950" />
          <View className="absolute bg-lime-500 rounded-full w-2 h-2 items-center justify-center -top-1 right-0"></View>
        </View>
      </View>
      <View className="flex-1 bg-white-50">
        {navActive?.screen}
      </View>

      <MenuHome
        active={navActive}
        items={navItem}
        onChange={(item) => {
          setNavActive(item);
        }}
      />
    </View>
  );
}

export default HomeUser;
