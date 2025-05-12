import DetailContract from "@/pages/Contract/Detail/Owner/screen";
import ListRentalHistory from "@/pages/RentalHistory/list";
import ListServicePayment from "@/pages/ServicePayment/list";
import HeaderBack from "@/ui/components/HeaderBack";
import TabsLine from "@/ui/components/TabsLine";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";

function Detail() {
  const { lodgingId, id } = useLocalSearchParams();
  const tabs = useMemo(
    () => [
      {
        name: "Chi tiết",
        view: (
          <DetailContract id={id as string} lodgingId={lodgingId as string} />
        ),
      },
      {
        name: "Hoá đơn tiền thuê",
        view: (
          <ListRentalHistory
            lodgingId={lodgingId as string}
            contractId={id as string}
          />
        ),
      },
      {
        name: "Hoá đơn dịch vụ",
        view: (
          <ListServicePayment
            lodgingId={lodgingId as string}
            contractId={id as string}
          />
        ),
      },
    ],
    [lodgingId, id]
  );

  const [active, setActive] = useState(tabs[0]);
  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Chi tiết hợp đồng" />
      <View className="">
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
