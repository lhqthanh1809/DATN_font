import { convertToNumber } from "@/helper/helper";
import useContractStore from "@/store/contract/useContractStore";
import useEndContractStore from "@/store/contract/useEndContractStore";
import Box from "@/ui/Box";
import { Money } from "@/ui/icon/finance";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import HeaderBack from "@/ui/components/HeaderBack";
import ListModel from "@/ui/ListModal";
import { useLocalSearchParams } from "expo-router";
import { values } from "lodash";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const percentsMoneyNeedRefunds = [...Array(11)].map((_, index) => {
  return {
    value: index / 10,
    label: `Hoàn trả ${index * 10}%`,
  };
});

const BoxDepositRefund:React.FC<{
  totalDeposit: number
  setTotalDeposit: (value: number) => void,
  moneyRefund: number
  setMoneyRefund: (value: number) => void,
}> = ({setTotalDeposit, totalDeposit, moneyRefund, setMoneyRefund}) => {
  const { lodgingId } = useLocalSearchParams();
  const { contract } = useContractStore();
  const [percentRefund, setPercentRefund] = useState<{
    value: number;
    label: string;
  }>(percentsMoneyNeedRefunds[0]);
  const [deposit, setDeposit] = useState(contract?.deposit_amount ?? 0);
  useEffect(() => {
    setMoneyRefund((deposit * percentRefund.value))
  }, [percentRefund])

  useEffect(() => {
    setTotalDeposit(deposit - moneyRefund)
  }, [deposit, moneyRefund])



  return (
    <Box
      title="Hoàn tiền cọc"
      description="Hoàn tiền cọc nếu trước đó có thu"
      icon={Money}
    >
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Input
            value={deposit.toString()}
            type="number"
            label="Số tiền đã cọc"
            suffix={<Label label="đ" />}
          />
        </View>

        <ListModel
          label="Phần trăm hoàn cọc"
          hasSearch={false}
          className="max-h-36"
          value={percentRefund ?? percentsMoneyNeedRefunds[0]}
          options={percentsMoneyNeedRefunds}
          optionKey="label"
          onChange={(option) => {
            setPercentRefund(option);
          }}
        />
      </View>

      <View className="bg-lime-50 px-4 py-2 rounded-xl border-1 border-lime-200 gap-2 flex-row justify-between">
        {/* Tiền cọc cần hoàn */}
        <View className="items-start gap-1">
          <Text className="font-BeVietnamSemiBold text-14 text-lime-800">
            Số tiền cọc cần hoàn
          </Text>
          <Text className="font-BeVietnamRegular text-14 text-mineShaft-950">{`${convertToNumber(
            moneyRefund.toString()
          )} đ`}</Text>
        </View>

        <View className="items-end gap-1">
          <Text className="font-BeVietnamSemiBold text-14 text-lime-800">{`Thành tiền`}</Text>
          <Text className="font-BeVietnamRegular text-14 text-mineShaft-950">{`${convertToNumber(
            (totalDeposit).toString()
          )} đ`}</Text>
        </View>
      </View>
    </Box>
  );
}

export default BoxDepositRefund;
