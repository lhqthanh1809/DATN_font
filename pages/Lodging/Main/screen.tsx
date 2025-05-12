import { constant } from "@/assets/constant";
import { useGeneral } from "@/hooks/useGeneral";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { ChevronDownSmall, ChevronLeft } from "@/ui/icon/symbol";
import { useFocusEffect, usePathname, useRouter } from "expo-router";
import { isArray } from "lodash";
import { View } from "moti";
import { useState, useCallback, useEffect, useMemo, ReactNode, use } from "react";
import { ScrollView, Text } from "react-native";
import LoadPermission from "./components/LoadPermission";
import MenuFunctionBox from "./components/MenuFunctionBox";
import { ILodging } from "@/interfaces/LodgingInterface";
import TabsBlock from "@/ui/components/TabsBlock";
import ManagerScreen from "./components/ManagerScreen";
import StatisticalScreen from "./components/StatisticalScreen";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";
import { useRoute } from '@react-navigation/native';

interface TabProp {
  name: string;
  view: ReactNode;
}

const HomeScreen: React.FC<{
  id: string;
}> = ({ id }) => {
  const { user } = useGeneral();
  const { lodgings} = useLodgingsStore()
  const [currentPath, setCurrentPath] = useState<string>(usePathname());
  const [lodging, setLodging] = useState<ILodging | null>(null);
  const route = useRouter();
  const [tab, setTab] = useState<TabProp | null>(null);

  const handleLoadHome = useCallback(() => {
    if (!user) {
      route.push("/login");
      return;
    }

    if (!lodgings) return;

    const foundLodging = lodgings.find((item) => item.id == id) || null;
    setLodging(foundLodging);

    if (!foundLodging) {
      route.replace("/");
      return;
    }
  }, [user, lodgings, id]);

  useEffect(() => {
    handleLoadHome();
  }, [user, lodgings, id]);

  const tabs = useMemo(() => {
    return [
      {
        name: "Quản lý",
        view: <ManagerScreen currentPath={currentPath} lodgingId={id} />,
      },
      {
        name: "Tổng quan",
        view: <StatisticalScreen lodgingId={id}/>,
      },
    ];
  }, [currentPath, id]);

  useEffect(() => {
    setTab(tabs[0]);
  }, [tabs]);

  return (
    <>
      <View className="relative z-10 py-2">
        <View className="p-4 flex-row items-center justify-center gap-2">
          <Button
            onPress={() => {
              route.navigate("/");
            }}
            className="flex items-center justify-center absolute left-6 z-10 p-1 rounded-full"
          >
            <Icon icon={ChevronLeft} className="text-mineShaft-950" />
          </Button>
          <Button
            className="p-0 gap-2"
            onPress={() => route.push("/lodging/list")}
          >
            <Text className="text-mineShaft-950 font-BeVietnamBold text-2xl text-center">
              {lodging?.name}
            </Text>
            <Icon icon={ChevronDownSmall} className="text-mineShaft-900" />
          </Button>
        </View>
        <TabsBlock
          tabs={tabs}
          renderKey="name"
          onChange={(tab) => setTab(tab)}
          className="mx-6 bg-[#f6f4fc]"
        />
      </View>
      <ScrollView
        className="px-2 flex-1"
        contentContainerStyle={{ paddingBottom: 76 }}
      >
        {tab?.view ?? tabs[0].view}
      </ScrollView>
    </>
  );
};

export default HomeScreen;
