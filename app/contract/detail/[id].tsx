import DetailContract from "@/pages/Contract/Detail/User/screen";
import ListRentalHistory from "@/pages/RentalHistory/list";
import ListServicePayment from "@/pages/ServicePayment/list";
import BackView from "@/ui/BackView";
import HeaderBack from "@/ui/components/HeaderBack";
import TabsLine from "@/ui/components/TabsLine";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";

function Detail() {
  const { id } = useLocalSearchParams();
  const tabs = useMemo(
    () => [
      {
        name: "Chi tiết",
        view: <DetailContract id={id as string}/>,
      },
      {
        name: "Thanh toán tiền thuê",
        view: (
          <ListRentalHistory
            contractId={id as string}
          />
        ),
      },
      {
        name: "Thanh toán dịch vụ",
        view: (
          <ListServicePayment
            contractId={id as string}
          />
        ),
      },
    ],
    [id]
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
