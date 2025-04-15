import { BoxPaymentTimeBill } from "@/ui/components/BoxPaymentTimeBill";
import Layout from "@/ui/components/Layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Button from "@/ui/Button";
import { formatNumber } from "@/helper/helper";
import { useLocalSearchParams, useRouter } from "expo-router";
import RoomService from "@/services/Room/RoomService";
import { constant } from "@/assets/constant";
import { BoxInfo } from "@/pages/Room/BoxInfo";
import BoxService from "@/pages/Room/BoxService";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";

function CreateRoom() {
  const { lodgings } = useLodgingsStore();
  const { lodgingId } = useLocalSearchParams();
  const [paymentDate, setPaymentDate] = useState<number>(5);
  const [lateDays, setLateDays] = useState<number>(5);
  const [serviceSelects, setServiceSelects] = useState<
    Array<{
      id: string;
      value?: string;
      selected: boolean;
    }>
  >([]);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [maxTenants, setMaxTenants] = useState(
    constant.room.max_tenants_default
  );
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const route = useRouter();

  const lodging = useMemo(() => {
    return lodgings?.find((item) => item.id == lodgingId) || null;
  }, [lodgings, lodgingId]);

  useEffect(() => {
    if (lodging) {
      setPaymentDate(lodging.payment_date ?? paymentDate);
      setLateDays(lodging.late_days ?? lateDays);
      setPrice(lodging.price_room_default?.toString() || price);
      setArea(lodging.area_room_default?.toString() || area);
    }
  }, [lodging]);

  const handleCreateRoom = useCallback(async () => {
    if (!name) return;
    setLoading(true);
    const serviceRoom = new RoomService(lodgingId as string);
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
      route.back();
    }
  }, [
    lodgingId,
    paymentDate,
    lateDays,
    serviceSelects,
    name,
    price,
    area,
    maxTenants,
  ]);

  return (
    <View className="flex-1 bg-white-50">
      <Layout title="Thêm phòng trọ mới">
        <ScrollView className="px-3 flex-grow bg-white-50">
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
                lodgingId: lodgingId as string,
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
      </Layout>
    </View>
  );
}

export default CreateRoom;
