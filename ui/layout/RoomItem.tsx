import { Text, View } from "react-native";
import Button from "../Button";
import React from "react";
import { IRoom } from "@/interfaces/RoomInterface";
import { cn, convertToNumber } from "@/helper/helper";
import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";

const RoomItem: React.FC<{
  item: IRoom;
  onPress?: () => void;
}> = ({ item, onPress }) => {
  return (
    <Button
      style={{
        borderLeftWidth: 5,
        borderLeftColor: "#bef264",
      }}
      onPress={onPress}
      className="bg-mineShaft-950 w-full justify-between px-3 py-4 gap-2 items-center border-1 border-lime-300"
    >
      <View className="flex  gap-2">
        <View className="gap-2 flex-row items-center">
          {/* Mã phòng */}
          <Text className="font-BeVietnamSemiBold text-16 text-white-50">
            {item.room_code}
          </Text>

          {/* Số lượng */}
          <View className="bg-lime-500 rounded-full px-5 py-1">
            <Text className="font-BeVietnamMedium text-14 text-lime-50">
              {`${item.current_tenants}/${item.max_tenants}`}
            </Text>
          </View>
        </View>
        <Text className="font-BeVietnamMedium text-14 text-white-50">
          {`${convertToNumber(item.price?.toString() ?? "0")} đ`}
        </Text>
      </View>
      <View
        className={cn(
          "rounded-full py-2 px-3",
          item.status === constant.room.status.filled
            ? "bg-lime-500"
            : item.status === constant.room.status.fixing
            ? "bg-orange-600"
            : "bg-red-600"
        )}
      >
        <Text
          className={cn(
            "font-BeVietnamRegular text-center",
            item.status === constant.room.status.filled
              ? "text-lime-50"
              : item.status === constant.room.status.fixing
              ? "text-orange-50"
              : "text-red-50"
          )}
        >
          {item.status
            ? (
                reference.room.status as {
                  [key: number]: { name: string };
                }
              )[item.status]?.name
            : reference.undefined.name}
        </Text>
      </View>
    </Button>
  );
};

export default RoomItem;
