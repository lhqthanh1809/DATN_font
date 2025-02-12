import Box from "@/ui/box";
import Dropdown from "@/ui/dropdown";
import Input from "@/ui/input";
import Label from "@/ui/label";
import { useState } from "react";
import { Text } from "react-native";

export const BoxRetailInfor = () => {
  const [numberPeople, setNumberPeople] = useState("");
  const numberPeopleList = [
    "1 người ở",
    "2 người ở",
    "3 người ở",
    "4 người ở",
    "5-6 người ở",
    "7-10 người ở",
    "Không giới hạn",
  ];
  return (
    <Box title="Thông tin đơn vị thuê" className="z-10">
      <Input value="" onChange={() => {}} label="Diện tích phòng" suffix={
        <Label label={'m\u00B2'}/>
      }/>
      <Input value="" onChange={() => {}} label="Giá thuê" suffix={
        <Label label={'đồng/tháng'}/>
      }/>
      <Dropdown
        hasSearch={false}
        className="max-h-52"
        value={numberPeople}
        onChange={(option) => {
            setNumberPeople(option);
          }}
        options={numberPeopleList}
        optionKey=""
        label="Tối đa người ở/phòng"
      />
    </Box>
  );
};
