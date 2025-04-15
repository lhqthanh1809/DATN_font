import { BoxPaymentTimeBill } from "@/ui/components/BoxPaymentTimeBill";
import Layout from "@/ui/components/Layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import BoxInfo from "@/pages/Service/BoxInfo";
import { IService } from "@/interfaces/ServiceInterface";
import { IUnit } from "@/interfaces/UnitInterface";
import Button from "@/ui/Button";
import LodgingServiceManagerService from "@/services/LodgingService/LodgingServiceManagerService";
import { formatNumber } from "@/helper/helper";
import { useLocalSearchParams, useRouter } from "expo-router";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";
import { IRoom } from "@/interfaces/RoomInterface";
import { BoxRoom } from "@/ui/components/BoxRoom";

function CreateService() {
  const { lodgings } = useLodgingsStore();
  const { lodgingId } = useLocalSearchParams();
  const [paymentDate, setPaymentDate] = useState<number>(5);
  const [lateDays, setLateDays] = useState<number>(5);
  const [service, setService] = useState<IService | null>(null);
  const [unit, setUnit] = useState<IUnit | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("0");
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [selectRooms, setSelectRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const lodging = useMemo(() => {
    return lodgings?.find((item) => item.id == lodgingId) || null;
  }, [lodgings, lodgingId]);

  useEffect(() => {
    if (lodging) {
      setPaymentDate(lodging.payment_date ?? paymentDate);
      setLateDays(lodging.late_days ?? lateDays);
    }
  }, [lodging]);

  const handleCreateLodgingService = useCallback(async () => {
    const pricePerUnit = formatNumber(price, "float");
    if (!pricePerUnit || !unit) return;
    setLoading(true);
    const serviceLodgingService = new LodgingServiceManagerService(
      lodgingId as string
    );
    const data = await serviceLodgingService.create({
      late_days: lateDays,
      payment_date: paymentDate,
      price_per_unit: pricePerUnit,
      service_id: service?.id || null,
      name: service?.id ? null : name || null,
      unit_id: unit.id,
      ...(selectRooms.length > 0 && { room_ids: selectRooms.map(item => item.id ?? "") })
    });
    setLoading(false);
    if (!("message" in data)) {
      route.back();
    }
  }, [lodgingId, paymentDate, lateDays, service, unit, name, price]);

  return (
    <View className="flex-1">
      <Layout title="Thêm dịch vụ mới">
        <ScrollView className="px-3 flex-grow bg-white-50">
          <View className="gap-3 items-center py-3 flex-1">
            <BoxInfo
              {...{
                name,
                price,
                service,
                setName,
                setPrice,
                setService,
                setUnit,
                unit,
              }}
            />
            <BoxPaymentTimeBill
              {...{ lateDays, paymentDate, setLateDays, setPaymentDate }}
            />
            <BoxRoom
              {...{
                rooms,
                selectRooms,
                setRooms,
                setSelectRooms,
                lodgingId: lodgingId as string,
              }}
            />
          </View>
        </ScrollView>
        <View className="p-3 flex bg-white-50">
          <View className="flex-row">
            <Button
              disabled={loading}
              loading={loading}
              onPress={handleCreateLodgingService}
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

export default CreateService;
