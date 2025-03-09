import { constant } from "@/assets/constant";
import Box from "@/ui/box";
import Dropdown from "@/ui/dropdown";
import ImagePicker from "@/ui/image_picker";
import Input from "@/ui/input";
import Label from "@/ui/label";
import ListModel from "@/ui/list_modal";
import { AssetInfo } from "expo-media-library";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";

const USAGE_TYPES = [
  {
    value: constant.equipment.type.private,
    title: "Sử dụng riêng trong phòng",
  },
  { value: constant.equipment.type.public, title: "Sử dụng chung cả khu" },
];

const BoxInfo: React.FC<{
  quantity: number;
  setQuantity: (quantity: number) => void;

  name: string;
  setName: (name: string) => void;

  type: number;
  setType: (type: number) => void;

  photo: AssetInfo[];
  setPhoto: React.Dispatch<React.SetStateAction<AssetInfo[]>>;

  disabled?: boolean;
}> = React.memo(
  ({
    name,
    setName,
    disabled,
    quantity,
    setQuantity,
    setType,
    type,
    photo,
    setPhoto,
  }) => {
    const selectedUsageType = useMemo(
      () => USAGE_TYPES.find((usageType) => usageType.value === type),
      [type]
    );

    const handleImageChange = useCallback(
      (value: AssetInfo[]) => setPhoto(value),
      [setPhoto]
    );

    const handleSetName = useCallback(
      (name: string) => setName(name),
      [setName]
    );
    const handleSetQuantity = useCallback(
      (quantity: string) => setQuantity(parseInt(quantity || "0")),
      [setQuantity]
    );
    const handleSetType = useCallback(
      (option: { value: number }) => setType(option.value),
      [setType]
    );

    return (
      <Box title="Thông tin thiết bị" className="z-10">
        <ImagePicker
          required
          value={photo}
          single
          label="Ảnh đại diện"
          onChange={handleImageChange}
        />
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Input
              required
              value={name}
              onChange={handleSetName}
              label="Tên thiết bị"
              disabled={disabled}
            />
          </View>
          <View className="flex-1">
            <Input
              required
              value={quantity.toString()}
              onChange={handleSetQuantity}
              label="Số lượng"
              disabled={disabled}
              type="number"
            />
          </View>
        </View>
        <ListModel
          label="Nhóm thiết bị"
          hasSearch={false}
          value={selectedUsageType}
          optionKey="title"
          options={USAGE_TYPES}
          onChange={handleSetType}
        />
      </Box>
    );
  }
);

export { BoxInfo };
