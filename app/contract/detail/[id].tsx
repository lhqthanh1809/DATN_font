import ListRentalHistory from "@/pages/RentalHistory/list";
import BackView from "@/ui/BackView";
import HeaderBack from "@/ui/layout/HeaderBack";
import TabsLine from "@/ui/layout/TabsLine";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";

function Detail() {
  const { id } = useLocalSearchParams();
  const tabs = useMemo(
    () => [
      {
        name: "Chi tiết",
        view: <></>,
      },
      {
        name: "Lịch sử thanh toán",
        view: (
          <ListRentalHistory
            contractId={id as string}
          />
        ),
      },
    ],
    [ id]
  );

  const [active, setActive] = useState(tabs[0]);
  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Chi tiết hợp đồng" />
      <View className="bg-black px-4 rounded-b-xl">
        <TabsLine
          tabs={tabs}
          active={active}
          onChange={(tab) => setActive(tab)}
        />
      </View>
      {active.view}
    </View>
  );
}

export default Detail;
