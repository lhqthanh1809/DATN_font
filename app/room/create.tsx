import { useGeneral } from "@/hooks/useGeneral";
import { BoxPaymentTimeBill } from "@/ui/layout/box_payment_time_bill";
import LayoutCreate from "@/ui/layout/layout_create";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BoxInfo, BoxService } from "@pages/Room/Create/components";
import Button from "@/ui/button";
import { formatNumber } from "@/helper/helper";
import { useRouter } from "expo-router";
import RoomService from "@/services/Room/RoomService";
import { constant } from "@/assets/constant";
import { ILodgingService } from "@/interfaces/LodgingServiceInterface";
import { IRoomService } from "@/interfaces/RoomServiceInterface";

function CreateRoom() {
  const { lodging } = useGeneral();
  const [paymentDate, setPaymentDate] = useState<number>(
    lodging?.payment_date || 5
  );
  const [lateDays, setLateDays] = useState<number>(lodging?.late_days || 5);
  const [serviceSelects, setServiceSelects] = useState<
    Array<{
      id: string;
      value?: string;
      selected: boolean;
    }>
  >([]);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>(
    lodging?.price_room_default?.toString() || ""
  );
  const [area, setArea] = useState<string>(
    lodging?.area_room_default?.toString() || ""
  );
  const [maxTenants, setMaxTenants] = useState(
    constant.room.max_tenants_default
  );
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const handleCreateRoom = useCallback(async () => {
    if (!lodging || !lodging.id || !name) return;
    setLoading(true);
    const serviceRoom = new RoomService(lodging.id);
    const reqData = {
      late_days: lateDays,
      payment_date: paymentDate,
      price: formatNumber(price, "float"),
      area: formatNumber(area, "float"),
      room_code: name,
      max_tenants: maxTenants,
      services: serviceSelects
        .filter((item) => item.selected)
        .map((item) => ({
          id: item.id,
          value: formatNumber(item.value || "0", "float"),
        })),
    };
    const data = await serviceRoom.create(reqData);
    setLoading(false);
    if (data && !("message" in data)) {
      route.push("/room/list");
    }
  }, [
    lodging,
    paymentDate,
    lateDays,
    serviceSelects,
    name,
    price,
    area,
    maxTenants,
  ]);

  return (
    <View className="flex-1">
      <LayoutCreate title="Thêm phòng trọ mới">
        <ScrollView className="px-5 flex-grow bg-white-50">
          <View className="gap-3 items-center py-3 flex-1">
            <BoxInfo
              {...{
                name,
                price,
                setName,
                setPrice,
                area,
                maxTenants,
                setArea,
                setMaxTenants,
              }}
            />
            <BoxPaymentTimeBill
              {...{ lateDays, paymentDate, setLateDays, setPaymentDate }}
            />
            <BoxService
              {...{
                serviceSelects,
                setServiceSelects,
              }}
            />
          </View>
        </ScrollView>
        <View className="p-3 flex bg-white-50">
          <View className="flex-row">
            <Button
              disabled={loading}
              loading={loading}
              onPress={handleCreateRoom}
              className="flex-1 bg-lime-400 py-4"
            >
              <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
                Hoàn thành
              </Text>
            </Button>
          </View>
        </View>
      </LayoutCreate>
    </View>
  );
}

export default CreateRoom;
