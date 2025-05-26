import Box from "@/ui/Box";
import DatePicker from "@/ui/Datepicker";
import { View } from "react-native";
import { useCallback, useEffect } from "react";
import Input from "@/ui/Input";
import Divide from "@/ui/Divide";
import Label from "@/ui/Label";
import Dropdown from "@/ui/Dropdown";
import Scan from "@/ui/Scan";
import { convertStringToDate } from "@/helper/helper";

interface BoxInfoProps {
  name: string;
  quantity: number;
  time: number;
  startDate: Date;
  birthDay: Date;
  address: string;
  identityCard: string;
  endDate: Date;
  status: number;
  phone?: string;
  gender: { name: string; value: boolean } | null | undefined;
}

const BoxInfo = ({
  name,
  quantity,
  time,
  startDate,
  birthDay,
  address,
  identityCard,
  endDate,
  phone,
  status,
  gender,
}: BoxInfoProps) => {
  useEffect(() => {
    if (startDate) {
      const newEndDate = new Date(startDate);
      newEndDate.setMonth(startDate.getMonth() + time);
    }
  }, [time, startDate]);

  return (
    <Box
      title="Thông tin cơ bản"
      description="Ngày dự kiến vào ở, thông tin khách đặt phòng"
    >
      {/* Thông tin về thời gian thuê */}
      <Input
        type="number"
        value={time.toString()}
        label="Thời gian thuê"
        suffix={<Label label="tháng" />}
        disabled
      />
      <View className="flex-row gap-2">
        {startDate && (
          <DatePicker disabled value={startDate} label="Ngày dự kiến vào ở" />
        )}
        {!isNaN(endDate.getTime()) && (
          <DatePicker disabled value={endDate} label="Ngày kết thúc" />
        )}
      </View>
      <View className="items-center px-1">
        <Divide direction="horizontal" className="h-[1] bg-mineShaft-400 " />
      </View>

      {/* Thông tin khách hàng thuê trên hợp đồng */}
      {identityCard && (
        <Input
          disabled
          value={identityCard}
          label="Căn cước công dân"
          type="code"
        />
      )}

      <View className="flex-row gap-2">
        <View className="flex-1">
          <Input
            disabled
            label="Họ tên khách"
            placeHolder="Nhập họ tên khách"
            value={name}
          />
        </View>
      </View>

      {phone && <Input disabled value={phone} label="Số điện thoại" />}

      {gender && <Input disabled value={gender.name} label="Giới tính" />}

      {!isNaN(birthDay.getTime()) && (
        <DatePicker disabled value={birthDay} label="Ngày sinh" />
      )}
      {address && <Input disabled value={address} label="Địa chỉ" />}

      <Input
        disabled
        value={quantity.toString()}
        label="Tổng số thành viên"
        type="number"
        suffix={<Label label="người" />}
      />
    </Box>
  );
};

export default BoxInfo;
