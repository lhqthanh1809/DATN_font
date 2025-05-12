import { reference } from "@/assets/reference";
import { convertToNumber } from "@/helper/helper";
import { IRoomRentalHistory } from "@/interfaces/RoomRentalHistoryInterface";
import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { ChevronRight, Home2 } from "@/ui/icon/symbol";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export const RoomRentalItem: React.FC<{
  item: IRoomRentalHistory;
  lodgingId: string
}> = ({ item, lodgingId }) => {
  return (
    <Button className="w-full bg-white-50 rounded-xl p-4 border-1 shadow-soft-sx flex-col items-start border-white-100 gap-4" onPress={() => router.push(`/lodging/${lodgingId}/invoice/detail/rent/${item.id}`)}>
      <View className="flex-row justify-between w-full gap-4">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="border-1 border-lime-400 bg-lime-100 p-2 rounded-full">
            <Icon icon={Home2} className="text-lime-500" />
          </View>

          <View className="gap-1 flex-1">
            <Text className="font-BeVietnamMedium">
              Tiền phòng - Tháng {String(item.month_billing).padStart(2, "0")}/
              {item.year_billing}
            </Text>

            <Text className="font-BeVietnamRegular text-12 text-white-700">
              Phòng {item.room?.room_code ?? reference.undefined.name}
            </Text>
          </View>
        </View>

        <Icon icon={ChevronRight} />
      </View>

      <Divide className="h-0.25" />

      <View className="flex-row items-center justify-around w-full">
        <View className="items-center">
          <Text className="font-BeVietnamRegular text-white-800 text-12">
            Tổng tiền
          </Text>
          <Text className="font-BeVietnamMedium">{`${convertToNumber(
            item.total_price.toString()
          )} đ`}</Text>
        </View>

        <View className="items-center">
          <Text className="font-BeVietnamRegular text-white-800 text-12">
            Đã thanh toán
          </Text>
          <Text className="font-BeVietnamMedium text-lime-500">
            {`${convertToNumber(item.amount_paid.toString())} đ`}
          </Text>
        </View>
        <View className="items-center">
          <Text className="font-BeVietnamRegular text-white-800  text-12">
            Còn lại
          </Text>
          <Text className="font-BeVietnamMedium text-mineShaft-950">
            {`${convertToNumber(
              (item.total_price - item.amount_paid).toString()
            )} đ`}
          </Text>
        </View>
      </View>
    </Button>
  );
};

const ListRental: React.FC<{
  items: IRoomRentalHistory[];
  lodgingId: string
}> = ({ items, lodgingId }) => {
  return items.map((item) => <RoomRentalItem item={item} key={item.id} lodgingId={lodgingId} />);
};

export default ListRental;
