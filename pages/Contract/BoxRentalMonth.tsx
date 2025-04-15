import {
  calculateDuration,
  convertToNumber,
  env,
  formatNumber,
  getFromDate,
  getTimezone,
} from "@/helper/helper";
import useContractStore from "@/store/contract/useContractStore";
import useEndContractStore from "@/store/contract/useEndContractStore";
import Box from "@/ui/Box";
import DatePicker from "@/ui/Datepicker";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

const BoxRentalMonth: React.FC<{
  totalRental: number;
  setTotalRental: (value: number) => void;
}> = ({ totalRental, setTotalRental }) => {
  const { contract } = useContractStore();
  const { endDate } = useEndContractStore();
  const [priceRoom, setPriceRoom] = useState(contract?.room?.price ?? 0);
  const [duration, setDuration] = useState({ months: 0, days: 0 });
  const [amountReduce, setAmountReduce] = useState("0");

  const paymentDate = useMemo(() => {
    return contract?.room?.payment_date ?? 1;
  }, [contract]);

  const fromDate = useMemo(() => {
    return getFromDate(paymentDate);
  }, [paymentDate]);

  const amountCollected = useMemo(() => {
    const pricePerMonth =
      (priceRoom / (contract?.room?.current_tenants ?? 1)) *
      (contract?.quantity ?? 1);
    const dayInMonth = moment(endDate).daysInMonth();
    const pricePerDay = pricePerMonth / dayInMonth;

    return pricePerMonth * duration.months + pricePerDay * duration.days;
  }, [priceRoom, contract, duration, endDate]);

  useEffect(() => {
    setDuration(calculateDuration(fromDate, endDate));
  }, [fromDate, endDate]);

  useEffect(() => {
    setTotalRental(
      amountCollected - (formatNumber(amountReduce, "float") ?? 0)
    );
  }, [amountCollected, amountReduce]);

  return (
    <Box
      title="Thu tiền phòng khi kết thúc hợp đồng"
      description={`Vào ${moment(endDate)
        .tz(getTimezone())
        .format("DD/MM/YYYY")}. Chu kì 1 tháng, ngày ${
        contract?.room?.payment_date
      } thu`}
    >
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Input
            value={amountCollected.toString()}
            type="number"
            label="Tiền phòng cần thu"
            suffix={<Label label="đ" />}
          />
        </View>
        {/* <Input
          value={amountReduce.toString()}
          type="number"
          label="Giảm trừ tiền phòng"
          suffix={<Label label="đ" />}
          onChange={(amount) => {
            setAmountReduce(amount || "0");
          }}
        /> */}
      </View>

      <Text className="font-BeVietnamRegular text-12">
        Số ngày khách ở tính từ chu kì gần nhất:{" "}
        <Text className="text-redPower-600 font-BeVietnamSemiBold">
          {duration.months}
        </Text>{" "}
        tháng,{" "}
        <Text className="text-redPower-600 font-BeVietnamSemiBold">
          {duration.days}
        </Text>{" "}
        ngày
      </Text>

      <View className="bg-lime-50 px-4 py-2 rounded-xl border-1 border-lime-200 gap-2 items-end">
        <View className="items-end gap-1">
          <Text className="font-BeVietnamSemiBold text-14 text-lime-800">{`Thành tiền`}</Text>
          <Text className="font-BeVietnamRegular text-14 text-mineShaft-950">{`${convertToNumber(
            totalRental.toString()
          )} đ`}</Text>
        </View>
      </View>
    </Box>
  );
};

export default BoxRentalMonth;
