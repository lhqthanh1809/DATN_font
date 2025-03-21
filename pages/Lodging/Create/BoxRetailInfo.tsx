
import Box from "@/ui/Box";
import Dropdown from "@/ui/Dropdown";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import { useState } from "react";
import { Text } from "react-native";

export const BoxRetailInfo: React.FC<{
  areaRoom: string;
  priceRoom: string;
  setAreaRoom: (area: string) => void;
  setPriceRoom: (price: string) => void;
}> = ({ areaRoom, priceRoom, setAreaRoom, setPriceRoom }) => {
  return (
    <Box title="Thông tin đơn vị thuê" description="Thông tin cơ bản diện tích, giá,..." className="z-10">
      <Input
        value={areaRoom}
        onChange={(area) => setAreaRoom(area)}
        label="Diện tích phòng"
        type="number"
        suffix={<Label label={"m\u00B2"} />}
      />

      <Input
        value={priceRoom}
        onChange={(price) => {
          setPriceRoom(price);
        }}
        label="Giá thuê"
        type="number"
        suffix={<Label label={"đồng/tháng"} />}
      />
      {/* <Dropdown
        hasSearch={false}
        className="max-h-52"
        value={numberPeople}
        onChange={(option) => {
          setNumberPeople(option);
        }}
        options={numberPeopleList}
        optionKey=""
        label="Tối đa người ở/phòng"
      /> */}
    </Box>
  );
};
