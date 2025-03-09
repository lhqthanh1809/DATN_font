import Box from "@/ui/box";
import DatePicker from "@/ui/datepicker";
import { Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import Input from "@/ui/input";
import Divide from "@/ui/divide";
import Label from "@/ui/label";
import { convertToNumber } from "@/helper/helper";

const BoxPriceHolding: React.FC<{
  priceRoom: string;
}> = ({ priceRoom }) => {
  const [price, setPrice] = useState<string>(priceRoom);

  return (
    <Box
      title="Thông tin giá cọc"
      description="Số tiền cọc, số tiền này sẽ chuyển thành cọc chính thức khi thêm hợp đồng"
    >
      <Input
        required
        value={price}
        onChange={(price) => setPrice(price)}
        label="Số tiền cọc giữ chỗ"
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

export default BoxPriceHolding;
