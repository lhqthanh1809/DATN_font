import Box from "@/ui/Box";
import DatePicker from "@/ui/Datepicker";
import { View } from "react-native";
import React, { useCallback, useEffect } from "react";
import Input from "@/ui/Input";
import Divide from "@/ui/Divide";
import Label from "@/ui/Label";
import Dropdown from "@/ui/Dropdown";
import Scan from "@/ui/Scan";
import { convertStringToDate } from "@/helper/helper";
import { User } from "@/ui/icon/symbol";
import useUserStore from "@/store/user/useUserStore";

interface BoxInfoProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  birthDay: Date;
  setBirthDay: React.Dispatch<React.SetStateAction<Date>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  identityCard: string;
  setIdentityCard: React.Dispatch<React.SetStateAction<string>>;
  gender: { name: string; value: boolean };
  setGender: React.Dispatch<
    React.SetStateAction<{ name: string; value: boolean }>
  >;

  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;

  disabled?: (
    | "address"
    | "name"
    | "phone"
    | "birthday"
    | "id_card"
    | "gender"
    | "email"
  )[];
}

const BoxInfo = ({
  name,
  phone,
  birthDay,
  address,
  identityCard,
  gender,
  email,

  setName,
  setPhone,
  setBirthDay,
  setAddress,
  setIdentityCard,
  setGender,
  setEmail,
  disabled = [],
}: BoxInfoProps) => {

  const {genders} = useUserStore()
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
    <Box title="Thông tin cá nhân" icon={User}>
      {/* Thông tin khách hàng thuê trên hợp đồng */}
      <Input
        value={identityCard}
        disabled={disabled.includes("id_card")}
        onChange={(value) => setIdentityCard(value)}
        required
        label="Căn cước công dân"
        type="code"
        suffix={<Scan onChange={handleDataScanner} />}
      />

      <Input
        required
        disabled={disabled.includes("name")}
        label="Họ tên người dùng"
        placeHolder="Nhập họ tên người dùng"
        value={name}
        onChange={(value) => setName(value)}
      />

      <Input
        required
        disabled={disabled.includes("phone")}
        label="Số điện thoại"
        placeHolder="Số điện thoại"
        value={phone}
        onChange={(value) => setPhone(value)}
        type="phone"
      />

      <Input
        disabled={disabled.includes("email")}
        label="Email"
        placeHolder="Email"
        value={email}
        onChange={(value) => setEmail(value)}
        type="text"
      />

      <Dropdown
        value={gender}
        disabled={disabled.includes("gender")}
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
        disabled={disabled.includes("birthday")}
        onChange={(date) => setBirthDay(date)}
        label="Ngày sinh"
      />

      <Input
        disabled={disabled.includes("address")}
        value={address}
        onChange={(value) => setAddress(value)}
        label="Địa chỉ"
      />
    </Box>
  );
};

export default BoxInfo;
