import { reference } from "@/assets/reference";
import { cn, convertToNumber } from "@/helper/helper";
import { IRoomServiceInvoice } from "@/interfaces/RoomServiceInvoiceInterface";
import ServiceManagerService from "@/services/Service/ServiceManagerService";
import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { ChevronRight } from "@/ui/icon/symbol";
import { router } from "expo-router";
import { useMemo } from "react";
import { Text, View } from "react-native";

const service = new ServiceManagerService()

export const RoomServiceInvoiceItem: React.FC<{
  item: IRoomServiceInvoice;
  lodgingId: string
}> = ({ item, lodgingId }) => {
    const serviceReference = useMemo(() =>{
        return item.service ? service.getReferenceService(item.service) : reference.other
    }, [item]) 
  return (
    <Button className="w-full bg-white-50 rounded-xl p-4 border-1 shadow-soft-sx flex-col items-start border-white-100 gap-4" onPress={() => router.push(`/lodging/${lodgingId}/invoice/detail/service/${item.id}`)}>
      <View className="flex-row justify-between w-full gap-4">
        <View className="flex-row items-center gap-3 flex-1">
          <View className={cn("bg-lime-100 p-2 rounded-full", serviceReference.bg)}>
            <Icon icon={serviceReference.icon} className={serviceReference.text} />
          </View>

          <View className="gap-1 flex-1">
            <Text className="font-BeVietnamMedium">
              {item.service ? serviceReference.name : item.service_name} - Tháng {String(item.month_billing).padStart(2, "0")}/
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

const ListRoomServiceInvoice: React.FC<{
  items: IRoomServiceInvoice[];
  lodgingId: string
}> = ({ items, lodgingId }) => {
  return items.map((item) => <RoomServiceInvoiceItem item={item} key={item.id} lodgingId={lodgingId}/>);;
};

export default ListRoomServiceInvoice;
