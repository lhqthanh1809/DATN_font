import Box from "@/ui/Box";
import { Text, View } from "react-native";
import React from "react";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import { convertToNumber } from "@/helper/helper";

const BoxPrice: React.FC<{
  priceRoom: string;
  depositAmount: string
  setDepositAmount: (amount: string) => void
}> = ({ priceRoom, depositAmount, setDepositAmount }) => {

  return (
    <Box
      title="Thông tin giá trị hợp đồng"
      description="Thiết lập giá thuê"
    >
      <Input
        required
        value={depositAmount}
        onChange={(price) => setDepositAmount(price)}
        label="Mức giá cọc hợp đồng"
        type="number"
        suffix={<Label label="đồng" />}
      />
      <View className="bg-lime-50 p-2 rounded-xl border-1 border-lime-200 gap-2 items-end">
        <Text className="font-BeVietnamSemiBold text-14 text-lime-800">{`Giá thuê hiện tại`}</Text>
        <Text className="font-BeVietnamRegular text-14 text-mineShaft-950">{`${convertToNumber(
          priceRoom
        )} đồng/tháng`}</Text>
      </View>
    </Box>
  );
};

export default BoxPrice;
