import Box from "@/ui/box";
import DatePicker from "@/ui/datepicker";
import { View } from "react-native";
import { useMemo, useState } from "react";
import Input from "@/ui/input";
import Divide from "@/ui/divide";
import Label from "@/ui/label";

const BoxInfo = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [nameHoldPerson, setNameHoldPerson] = useState<string>("");
  const [phoneHoldPerson, setPhoneHoldPerson] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [time, setTime] = useState(1);

  return (
    <Box
      title="Thông tin cơ bản"
      description="Ngày dự kiến vào ở, thông tin khách đặt cọc"
    >
      <View className="flex-row gap-2">
        <DatePicker
          value={startDate}
          onChange={(date) => setStartDate(date)}
          label="Ngày dự kiến vào ở"
        />
        <Input
          type="number"
          value={time.toString()}
          required
          label="Thời gian thuê dự kiến"
          suffix={<Label label="tháng" />}
          onChange={(value) => setTime(value ? parseInt(value) : 0)}
        />
      </View>
      <View className="items-center px-1">
        <Divide direction="horizontal" className="h-[1] bg-mineShaft-400 " />
      </View>
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Input
            required
            label="Tên người cọc"
            placeHolder="Nhập tên người cọc"
            value={nameHoldPerson}
            onChange={(value) => setNameHoldPerson(value)}
          />
        </View>
        <View className="flex-1">
          <Input
            required
            label="Số điện thoại"
            placeHolder="Số điện thoại"
            value={phoneHoldPerson}
            onChange={(value) => setPhoneHoldPerson(value)}
            type="phone"
          />
        </View>
      </View>
      <Input
        value={quantity.toString()}
        onChange={(value) => setQuantity(value ? parseInt(value) : 1)}
        required
        label="Tổng số thành viên dự kiến"
        type="number"
        suffix={<Label label="người" />}
      />
    </Box>
  );
};

export default BoxInfo;
