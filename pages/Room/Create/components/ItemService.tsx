import { reference } from "@/assets/reference";
import { cn } from "@/helper/helper";
import { ILodgingService } from "@/interfaces/LodgingServiceInterface";
import ServiceManagerService from "@/services/Service/ServiceManagerService";
import UnitService from "@/services/Unit/UnitService";
import Button from "@/ui/button";
import CheckBox from "@/ui/checkbox";
import Service from "@/ui/icon/private/service";
import Input from "@/ui/input";
import { View } from "moti";
import React, { useRef, useEffect } from "react";
import { Pressable, Text } from "react-native";

const ItemService: React.FC<{
  value: string;
  service: ILodgingService;
  checked: boolean;
  onPress: (service: ILodgingService) => void;
  onChange: (value: string, serviceId: string) => void;
}> = ({ service, checked, onPress, onChange, value }) => {
  const unitService = new UnitService();
  const serviceManagerService = new ServiceManagerService();

  return (
    <Pressable
      onPress={() => onPress(service)}
      className={cn(
        "w-full flex-col items-start p-3 gap-2 border-1 rounded-lg",
        checked
          ? "bg-lime-200 border-lime-400"
          : "bg-white-50 border-mineShaft-200"
      )}
    >
      <View className={cn("flex-row items-center justify-between w-full")}>
        <View className="flex-row items-center gap-2">
          <CheckBox checked={checked} className="border-mineShaft-200" />
          <Text className="font-BeVietnamMedium text-14">
            {service.service
              ? serviceManagerService.getReferenceService(service.service).name
              : service.name}
          </Text>
        </View>
        <Text className="font-BeVietnamMedium text-12 text-mineShaft-500">
          {`${new Intl.NumberFormat("vi-VN").format(
            Number(service.price_per_unit)
          )} ${
            service.unit
              ? unitService.getUnitSuffix("đồng", service.unit)
              : reference.undefined.name
          }`}
        </Text>
      </View>
      {checked && !service.unit?.is_fixed && (
        <Input
          type="number"
          className="w-full py-0 h-9"
          classNameInput="text-12"
          value={value || ""}
          onChange={(value) => onChange(value, service.id || "")}
          placeHolder="Nhập chỉ số hiện tại (Mặc định: 0)"
        />
      )}
    </Pressable>
  );
};

export default ItemService;
