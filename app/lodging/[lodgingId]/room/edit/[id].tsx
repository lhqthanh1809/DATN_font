import { useGeneral } from "@/hooks/useGeneral";
import { BoxPaymentTimeBill } from "@/ui/layout/box_payment_time_bill";
import Layout from "@/ui/layout/layout_create";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Button from "@/ui/button";
import { formatNumber } from "@/helper/helper";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import RoomService from "@/services/Room/RoomService";
import { constant } from "@/assets/constant";
import { BoxInfo } from "@/pages/Room/BoxInfo";
import BoxService from "@/pages/Room/BoxService";
import LoadingAnimation from "@/ui/loading_animation";

function Edit() {
  const { lodgings } = useGeneral();
  const { id, router_from, lodgingId } = useLocalSearchParams();
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
  const roomService = new RoomService();

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

  const handleUpdateRoom = useCallback(async () => {
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

    serviceRoom.lodgingId = lodgingId as string;

    const data = await serviceRoom.update(reqData, id as string);
    setLoading(false);
    if (data && !("message" in data)) {
      router_from == "list"
        ? route.back()
        : route.replace(`lodging/${lodgingId}/room/list` as Href);
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
    id,
    router_from,
  ]);

  const fetchDetailRoom = useCallback(async () => {
    setLoadingData(true);
    const data = await roomService.detail(id as string);
    if (!data || "message" in data) {
      route.back();
      return;
    }

    setName(data.room_code);
    data.price && setPrice(data.price.toString());
    data.area && setArea(data.area.toString());
    data.late_days && setLateDays(data.late_days);
    data.payment_date && setPaymentDate(data.payment_date);
    data.room_services &&
      setServiceSelects(
        data.room_services.map((item) => {
          return {
            id: item.lodging_service_id,
            value: item.last_recorded_value?.toString() || "",
            selected: item.is_enabled,
          };
        })
      );
    setMaxTenants(data.max_tenants);
    setLoadingData(false);
  }, [id]);

  useEffect(() => {
    fetchDetailRoom();
  }, []);

  return (
    <View className="flex-1 bg-white-50">
      <Layout title="Chỉnh sửa thông tin phòng trọ">
        {loadingData && (
          <View className="bg-mineShaft-950/70 z-10 absolute h-full w-full top-0 items-center justify-center">
            <LoadingAnimation className="text-white-50" />
          </View>
        )}
        <ScrollView className="flex-grow bg-white-50" scrollEnabled={!loading}>
          {loading && (
            <View className="bg-black/10 h-full w-full absolute z-20" />
          )}
          <View className="gap-3 items-center py-3 flex-1 px-3 ">
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
              onPress={handleUpdateRoom}
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

export default Edit;
