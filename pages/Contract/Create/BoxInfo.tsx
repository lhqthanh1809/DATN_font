import Box from "@/ui/box";
import DatePicker from "@/ui/datepicker";
import { View } from "react-native";
import { useCallback, useEffect } from "react";
import Input from "@/ui/input";
import Divide from "@/ui/divide";
import Label from "@/ui/label";
import Dropdown from "@/ui/dropdown";
import Scan from "@/ui/scan";
import { convertStringToDate } from "@/helper/helper";

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
  birthDay: Date;
  setBirthDay: React.Dispatch<React.SetStateAction<Date>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  identityCard: string;
  setIdentityCard: React.Dispatch<React.SetStateAction<string>>;
  endDate: Date;
  setEndDate: React.Dispatch<React.SetStateAction<Date>>;
  genders: { name: string; value: boolean }[];
  gender: { name: string; value: boolean };
  setGender: React.Dispatch<
    React.SetStateAction<{ name: string; value: boolean }>
  >;
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
  birthDay,
  setBirthDay,
  address,
  setAddress,
  identityCard,
  setIdentityCard,
  endDate,
  setEndDate,
  genders,
  gender,
  setGender,
}: BoxInfoProps) => {
  useEffect(() => {
    if (startDate) {
      const newEndDate = new Date(startDate);
      newEndDate.setMonth(startDate.getMonth() + time);
      setEndDate((prev) =>
        prev.getTime() !== newEndDate.getTime() ? newEndDate : prev
      );
    }
  }, [time, startDate]);

  const handleDataScanner = useCallback((dataScanner: string) => {
    if (dataScanner) {
      const data = dataScanner.split("|");
      setIdentityCard((prev) => (data[0] !== prev ? data[0] : prev));
      setName((prev) => (data[2] !== prev ? data[2] : prev));
      setAddress((prev) => (data[5] !== prev ? data[5] : prev));
      setBirthDay((prev) => {
        const newDate = convertStringToDate(data[3]);
        return newDate && newDate !== prev ? newDate : prev;
      });
      setGender(
        (prev) => genders.find((item) => item.name === data[4]) ?? prev
      );
    }
  }, []);

  return (
    <Box
      title="Thông tin cơ bản"
      description="Ngày dự kiến vào ở, thông tin khách đặt phòng"
    >
      {/* Thông tin về thời gian thuê */}
      <Input
        type="number"
        value={time.toString()}
        required
        label="Thời gian thuê dự kiến"
        suffix={<Label label="tháng" />}
        onChange={(value) => setTime(value ? parseInt(value) : 0)}
      />
      <View className="flex-row gap-2">
        <DatePicker
          required
          disabled
          value={startDate}
          onChange={(date) => setStartDate(date)}
          label="Ngày dự kiến vào ở"
        />
        <DatePicker
          value={endDate}
          onChange={(date) => setEndDate(date)}
          label="Ngày kết thúc"
        />
      </View>
      <View className="items-center px-1">
        <Divide direction="horizontal" className="h-[1] bg-mineShaft-400 " />
      </View>

      {/* Thông tin khách hàng thuê trên hợp đồng */}
      <Input
        value={identityCard}
        onChange={(value) => setIdentityCard(value)}
        required
        label="Căn cước công dân"
        type="code"
        suffix={<Scan onChange={handleDataScanner} />}
      />
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Input
            required
            label="Họ tên khách"
            placeHolder="Nhập họ tên khách"
            value={name}
            onChange={(value) => setName(value)}
          />
        </View>
        <View className="flex-1 ">
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
      <Dropdown
        value={gender}
        onChange={(option) => {
          setGender(option);
        }}
        hasSearch={false}
        className="z-20"
        options={genders}
        optionKey="name"
        label="Giới tính"
      />
      <DatePicker
        value={birthDay}
        onChange={(date) => setBirthDay(date)}
        required
        label="Ngày sinh"
      />
      <Input
        value={address}
        onChange={(value) => setAddress(value)}
        label="Địa chỉ"
      />
      <Input
        value={quantity.toString()}
        onChange={(value) => setQuantity(value ? parseInt(value) : 0)}
        required
        label="Tổng số thành viên"
        type="number"
        suffix={<Label label="người" />}
      />
    </Box>
  );
};

export default BoxInfo;
