import { useUI } from "@/hooks/useUI";
import Button from "@/ui/Button";
import DatePicker from "@/ui/Datepicker";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { Calender, CrossMedium, FilterSearch, Time } from "@/ui/icon/symbol";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

const FilterRoom: React.FC<{
  leaseDuration: number;
  setLeaseDuration: (time: number) => void;

  quantity: number;
  setQuantity: (quantity: number) => void;

  startDate?: Date;
  setStartDate?: (date: Date) => void;

  onFilter: (params: {
    startDate?: Date;
    quantity: number;
    leaseDuration: number;
  }) => void;
}> = ({
  leaseDuration,
  setLeaseDuration,
  setStartDate,
  startDate,
  quantity,
  setQuantity,
  onFilter,
}) => {
  const { showModal, hideModal } = useUI();
  const onFilterRef = useRef(onFilter);

  useEffect(() => {
    onFilterRef.current = onFilter;
  }, [onFilter, quantity, leaseDuration, startDate]);

  const hideFilter = useCallback(() => {
    hideModal();
  }, [hideModal]);

  const openFilter = useCallback(
    () =>
      showModal(
        <ModalFilter
          {...{
            hideFilter,
            onFilter: onFilterRef.current,
            leaseDuration,
            quantity,
            setLeaseDuration,
            setQuantity,
            setStartDate,
            startDate,
          }}
        />
      ),
    [leaseDuration, quantity, startDate, onFilter]
  );

  return (
    <View className="p-2">
      <Button className="bg-lime-500 p-2 rounded-xl" onPress={openFilter}>
        <Icon icon={FilterSearch} className="text-white-50" />
      </Button>
    </View>
  );
};

const ModalFilter: React.FC<{
  leaseDuration: number;
  setLeaseDuration: (time: number) => void;

  quantity: number;
  setQuantity: (quantity: number) => void;

  startDate?: Date;
  setStartDate?: (date: Date) => void;

  onFilter: (params: {
    startDate?: Date;
    quantity: number;
    leaseDuration: number;
  }) => void;
  hideFilter: () => void;
}> = ({
  leaseDuration,
  setLeaseDuration,
  setStartDate,
  startDate,
  quantity,
  setQuantity,
  onFilter,
  hideFilter,
}) => {
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localTime, setLocalTime] = useState(leaseDuration);

  useEffect(() => setQuantity(localQuantity), [localQuantity]);
  useEffect(() => {
    if (setStartDate && localStartDate) {
      setStartDate(localStartDate);
    }
  }, [localStartDate]);
  useEffect(() => setLeaseDuration(localTime), [localTime]);

  return (
    <Pressable
      onPress={() => {}}
      className="absolute bottom-0 bg-white-50 rounded-t-xl py-4 gap-4 w-full"
    >
      <View className="px-4 flex-row items-center justify-between">
        <View className="gap-3 flex-row items-center">
          <View className="bg-lime-500 p-2 rounded-full">
            <Icon icon={FilterSearch} className="text-white-50" />
          </View>
        </View>
        <Button className="bg-mineShaft-400 p-2" onPress={hideFilter}>
          <Icon icon={CrossMedium} className="text-white-50" />
        </Button>
      </View>
      <Divide direction="horizontal" className="h-[1]" />
      <View className="px-2 gap-3">
        <View className="flex-row gap-2">
          {localStartDate && (
            <DatePicker
              label="Ngày dự kiến vào ở"
              value={localStartDate}
              onChange={(date) => setLocalStartDate(date)}
              prefix={<Icon icon={Calender} />}
            />
          )}

          <View className="flex-1">
            <Input
              label="Thời gian thuê dự kiến"
              value={localTime.toString()}
              onChange={(value) => setLocalTime(value ? parseInt(value) : 0)}
              prefix={<Icon icon={Time} />}
              suffix={<Label label="tháng" />}
              type="number"
            />
          </View>
        </View>
        <Input
          value={localQuantity.toString()}
          onChange={(value) => setLocalQuantity(value ? parseInt(value) : 0)}
          label="Tổng số thành viên dự kiến"
          suffix={<Label label="người" />}
          type="number"
        />
      </View>
      <View className="px-2">
        <Button
          className="bg-lime-400 py-3"
          onPress={() =>
            onFilter({
              startDate: localStartDate,
              quantity: localQuantity,
              leaseDuration: localTime,
            })
          }
        >
          <Text className="font-BeVietnamSemiBold text-14 text-mineShaft-900">
            Tìm kiếm
          </Text>
        </Button>
      </View>
    </Pressable>
  );
};

export default FilterRoom;
