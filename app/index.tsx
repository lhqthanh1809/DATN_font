import { useGeneral } from "@/hooks/useGeneral";
import Icon from "@/ui/Icon";
import { Bell } from "@/ui/icon/symbol";
import { Text, View } from "react-native";
import { Building } from "@/ui/icon/general";
import { Fingerprint } from "@/ui/icon/security";
import { useEffect, useMemo, useState } from "react";
import {
  ItemMenu,
  ManagementScreen,
  MenuHome,
  PersonScreen,
} from "@/pages/User/Home/components";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import { router } from "expo-router";
import MonthPicker from "@/ui/MonthPicker";

function HomeUser() {
  const { user } = useGeneral();
  const [navActive, setNavActive] = useState<ItemMenu | null>(null);
  const { addToast } = useToastStore();

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

  useEffect(() => {
    setNavActive(navItem[0]);
  }, []);

  return (
    <View className="flex-1 bg-white-50">
      <View className="p-5 flex-row justify-between items-center">
        <Button onPress={() => {router.push("/user/detail")}}>
          <Text className="font-BeVietnamSemiBold text-18 text-mineShaft-950">
            {user?.full_name}
          </Text>
        </Button>
        <MenuHome
          active={navActive}
          items={navItem}
          onChange={(item) => {
            setNavActive(item);
          }}
        />
      </View>
      <View className="flex-1 bg-white-50">{navActive?.screen}</View>

    </View>
  );
}

export default HomeUser;
