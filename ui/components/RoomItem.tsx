import { Text, View } from "react-native";
import Button from "../Button";
import React, { useMemo } from "react";
import { IRoom } from "@/interfaces/RoomInterface";
import { cn, convertToNumber } from "@/helper/helper";
import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";

const RoomItem: React.FC<{
  item: IRoom;
  onPress?: () => void;
}> = ({ item, onPress }) => {
  const percent = useMemo(() => {
    return Math.ceil(
      ((item.current_tenants ?? 0) / Math.max(item.max_tenants, 1)) * 100
    );
  }, [item]);

  const status = useMemo(() => {
    return item.status
      ? reference.room.status[item.status as keyof typeof reference.room.status]
      : reference.undefined;
  }, [item]);

  return (
    <Button
      onPress={onPress}
      className="w-full justify-between p-4 gap-2 items-center rounded-xl shadow-custom border-1 border-mineShaft-100 bg-white-50 flex-col"
    >
      <View className="flex-row items-center justify-between w-full">
        <Text className="font-BeVietnamSemiBold text-16 text-mineShaft-950">
          {item.room_code}
        </Text>

        <Text className="font-BeVietnamBold text-18 text-lime-400">
          {`${convertToNumber(item.price?.toString() ?? "0")} đ`}
        </Text>
      </View>

      <View className="w-full">
        <View className="flex-row items-center gap-2">
          <View className={cn("w-2 h-2 rounded-full", status.bg)} />
          <Text className={cn("font-BeVietnamMedium text-mineShaft-900")}>
            {status.name}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between w-full">
        <Text className="font-BeVietnamRegular text-14 text-mineShaft-500">
          {`Tỉ lệ sử dụng: ${item.current_tenants}/${item.max_tenants}`}
        </Text>

        <Text className="font-BeVietnamMedium text-14 text-mineShaft-800">
          {`${percent}%`}
        </Text>
      </View>

      <View
        className="w-full h-1 rounded-full overflow-hidden bg-white-100"
      >
        <View
          className="rounded-full h-full absolute top-0 left-0 bg-lime-400"
          style={{
            width: `${percent}%`,
          }}
        />
      </View>

    </Button>
  );
};

export default RoomItem;
