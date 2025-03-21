import { BoxPaymentTimeBill } from "@/ui/layout/BoxPaymentTimeBill";
import Layout from "@/ui/layout/Layout";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import BoxInfo from "@/pages/Service/BoxInfo";
import { IService } from "@/interfaces/ServiceInterface";
import { IUnit } from "@/interfaces/UnitInterface";
import Button from "@/ui/Button";
import LodgingServiceManagerService from "@/services/LodgingService/LodgingServiceManagerService";
import { formatNumber } from "@/helper/helper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ILodgingService } from "@/interfaces/LodgingServiceInterface";
import { IError } from "@/interfaces/ErrorInterface";
import LoadingAnimation from "@/ui/LoadingAnimation";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";

function Update() {
  const { id, lodgingId } = useLocalSearchParams();
  const { lodgings } = useLodgingsStore();
  const [paymentDate, setPaymentDate] = useState<number>(5);
  const [lateDays, setLateDays] = useState<number>(5);
  const [service, setService] = useState<IService | null>(null);
  const [unit, setUnit] = useState<IUnit | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const boxInfoRef = useRef<{ isLoading: boolean } | null>(null);
  const route = useRouter();
  const serviceLodgingService = new LodgingServiceManagerService(null);


    const lodging = useMemo(() => {
    return lodgings?.find((item) => item.id == lodgingId) || null;
  }, [lodgings, lodgingId]);

  useEffect(() => {
    if (lodging) {
      setPaymentDate(lodging.payment_date ?? paymentDate);
      setLateDays(lodging.late_days ?? lateDays);
      setPrice(lodging.price_room_default?.toString() || price);
    }
  }, [lodging]);


  const fetchService = useCallback(async () => {
    setLoadingData(true);
    const data: ILodgingService | IError = await serviceLodgingService.detail(
      id as string
    );
    if (!data || "message" in data) {
      route.back();
      return;
    }
    setLoadingData(false);
    data.payment_date && setPaymentDate(data.payment_date);
    data.name && setName(data.name);
    data.late_days && setLateDays(data.late_days);
    data.unit && setUnit(data.unit);
    data.price_per_unit && setPrice(data.price_per_unit.toString());
    data.service && setService(data.service);
  }, [id]);

  const handleUpdateLodgingService = useCallback(async () => {
    const pricePerUnit = formatNumber(price, "float");
    if (!pricePerUnit || !unit) return;
    setLoading(true);
    serviceLodgingService.setLodgingId(lodgingId as string);
    const data = await serviceLodgingService.update({
      id: id as string,
      late_days: lateDays,
      payment_date: paymentDate,
      price_per_unit: pricePerUnit,
      service_id: service?.id || null,
      name: service?.id ? null : name || null,
      unit_id: unit.id,
    });
    setLoading(false);
    if (!("message" in data)) {
      route.back();
    }
  }, [lodgingId, paymentDate, lateDays, service, unit, name, price]);

  useEffect(() => {
    fetchService();
  }, []);

  return (
    <View className="flex-1">
      <Layout title="Cập nhật thông tin dịch vụ">
        {loadingData && (
          <View className="bg-mineShaft-950/70 z-10 absolute h-full w-full top-0 items-center justify-center">
            <LoadingAnimation className="text-white-50" />
          </View>
        )}
        <ScrollView className="px-3 flex-grow bg-white-50">
          <View className="gap-3 items-center py-3 flex-1">
            <BoxInfo
              ref={boxInfoRef}
              isUpdate
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
              disabled={false}
              {...{ lateDays, paymentDate, setLateDays, setPaymentDate }}
            />
          </View>
        </ScrollView>
        <View className="p-3 flex bg-white-50">
          <View className="flex-row">
            <Button
              disabled={loading}
              loading={loading}
              onPress={handleUpdateLodgingService}
              className="flex-1 bg-lime-400 py-4"
            >
              <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
                Cập nhật
              </Text>
            </Button>
          </View>
        </View>
      </Layout>
    </View>
  );
}

export default Update;
