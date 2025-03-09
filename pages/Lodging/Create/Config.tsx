import Box from "@/ui/box";
import { ScrollView, View } from "react-native";

import { BoxPaymentTimeBill } from "@/ui/layout/box_payment_time_bill";
import { BoxRetailInfo } from "./BoxRetailInfo";

const Config: React.FC<{
  areaRoom: string;
  priceRoom: string;
  setAreaRoom: (area: string) => void;
  setPriceRoom: (price: string) => void;
  paymentDate: number;
  lateDays: number;
  setPaymentDate: (paymentDate: number) => void;
  setLateDays: (lateDays: number) => void;
}> = ({
  areaRoom,
  priceRoom,
  setAreaRoom,
  setPriceRoom,
  lateDays,
  paymentDate,
  setLateDays,
  setPaymentDate,
}) => {
  return (
      <>
        <BoxRetailInfo
          {...{ areaRoom, priceRoom, setAreaRoom, setPriceRoom }}
        />
        <BoxPaymentTimeBill
          {...{ lateDays, paymentDate, setLateDays, setPaymentDate }}
        />
      </>
  );
};

export default Config;
