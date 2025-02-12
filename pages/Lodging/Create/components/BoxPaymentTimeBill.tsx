import Box from "@/ui/box";
import Dropdown from "@/ui/dropdown";
import Input from "@/ui/input";
import Label from "@/ui/label";
import { useState } from "react";
import { Text } from "react-native";

export const BoxPaymentTimeBill = () => {

  return (
    <Box title="Cài đặt ngày chốt & hạn hoá đơn">
      <Input value="" onChange={() => {}} label="Ngày lập hoá đơn thu tiền" />
      <Input value="" onChange={() => {}} label="Hạn đóng tiền" suffix={
        <Label label={'ngày'}/>
      }/>
    </Box>
  );
};
