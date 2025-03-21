import Box from "@/ui/Box";
import DatePicker from "@/ui/Datepicker";
import { View } from "react-native";
import { useMemo, useState } from "react";
import Input from "@/ui/Input";
import Divide from "@/ui/Divide";
import Label from "@/ui/Label";

interface BoxInfoProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  startDate: Date;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
}

const BoxInfo = ({
  name,
  setName,
  phone,
  setPhone,
  quantity,
  setQuantity,
  time,
  setTime,
  startDate,
  setStartDate,
}: BoxInfoProps) => {
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
            value={name}
            onChange={(value) => setName(value)}
          />
        </View>
        <View className="flex-1">
          <Input
            required
            label="Số điện thoại"
            placeHolder="Số điện thoại"
            value={phone}
            onChange={(value) => setPhone(value)}
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
