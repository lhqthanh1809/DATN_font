import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as Location from "expo-location";
import MapEdit from "@/pages/Lodging/Create/MapEdit";
import InfoAndLocation from "@/pages/Lodging/Create/InfoAndLocation";
import Config from "@/pages/Lodging/Create/Config";
import { IMap } from "@/interfaces/MapInterface";
import { cn, formatNumber } from "@/helper/helper";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { ILodging, LodgingType } from "@/interfaces/LodgingInterface";
import { LocationUnit } from "@/interfaces/LocationInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import Layout from "@/ui/layout/Layout";
import useToastStore from "@/store/toast/useToastStore";
import { constant } from "@/assets/constant";
import { IError } from "@/interfaces/ErrorInterface";
import { BlurView } from "expo-blur";
import LoadingAnimation from "@/ui/LoadingAnimation";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";

function EditLodging() {
  //Initial
  const route = useRouter();
  const { lodgingId } = useLocalSearchParams();
  const { addToast } = useToastStore();
  const { updateLodging } = useLodgingsStore()
  const [lodging, setLodging] = useState<ILodging | null>(null);
  const [lodgingType, setLodgingType] = useState<LodgingType | null>(null);
  const [province, setProvince] = useState<LocationUnit | null>(null);
  const [district, setDistrict] = useState<LocationUnit | null>(null);
  const [ward, setWard] = useState<LocationUnit | null>(null);
  const [street, setStreet] = useState<string>("");
  const [openMap, setOpenMap] = useState(false);
  const [location, setLocation] = useState<IMap | null>(null); // Vị trí được chọn
  const [locationCurrent, setLocationCurrent] = useState<IMap | null>(null); // Vị trí hiện tại được chọn
  const [region, setRegion] = useState<IMap | null>(location);
  const [viewIndex, setViewIndex] = useState(0);
  const [name, setName] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState(5);
  const [lateDays, setLateDays] = useState(5);
  const [areaRoom, setAreaRoom] = useState<string>("");
  const [priceRoom, setPriceRoom] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Callback
  const handleOpenMap = useCallback(
    (openMap: boolean) => {
      setOpenMap(openMap);
    },
    [openMap]
  );

  const handleSelectLocation = useCallback(() => {
    setLocationCurrent(location);
    setOpenMap(false);
  }, [location, locationCurrent]);

  // Xử lý chỉnh sửa nhà trọ
  const handleUpdateLodging = useCallback(async () => {
    if (!lodgingType) {
      addToast(constant.toast.type.error, "Loại nhà cho thuê là bắt buộc");
      return;
    }

    if (!name) {
      addToast(constant.toast.type.error, "Tên nhà cho thuê là bắt buộc");
      return;
    }

    setProcessing(true);
    const dataReq: ILodging = {
      ...lodging,
      name,
      province_id: province?.id ?? null,
      district_id: district?.id ?? null,
      ward_id: ward?.id ?? null,
      type_id: lodgingType.id,
      address: street ?? null,
      latitude: location?.latitude?.toString() ?? null,
      longitude: location?.longitude?.toString() ?? null,
      late_days: lateDays,
      payment_date: paymentDate,
      area_room_default: formatNumber(areaRoom, "float"),
      price_room_default: formatNumber(priceRoom, "float"),
    };

    try {
      const result = await new LodgingService().update(dataReq);

      if (result.hasOwnProperty("message")) {
        addToast(constant.toast.type.error, (result as IError).message);
        return;
      }
      
      addToast(constant.toast.type.success, "Cập nhật nhà cho thuê thành công!");
      setLodging(result as ILodging);
      updateLodging(result as ILodging)
    } catch (err) {
    } finally {
      setProcessing(false);
    }
  }, [
    addToast,
    lodging,
    lodgingId,
    lodgingType,
    district,
    province,
    ward,
    street,
    location,
    name,
    lateDays,
    paymentDate,
    areaRoom,
    priceRoom,
  ]);

  const fetchLodging = useCallback(async () => {
    setLoading(true);
    try {
      const result = await new LodgingService().detail(lodgingId as string);

      if (result.hasOwnProperty("message")) {
        addToast(constant.toast.type.error, (result as IError).message);
        router.back();
        return;
      }

      setLodging(result as ILodging);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [lodgingId]);

  const handleNextView = useCallback(() => {
    if (viewIndex < view.length - 1) {
      setViewIndex((prev) => ++prev);
      return;
    }

    handleUpdateLodging();
  }, [viewIndex, handleUpdateLodging]);

  const handleBackView = useCallback(() => {
    if (viewIndex)
      setViewIndex((prev) => {
        return --prev;
      });
    else route.back();
  }, [viewIndex]);

  // Effect
  useEffect(() => {
    const openMap = async () => {
      if (locationCurrent) {
        setLocation(locationCurrent);
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // Nếu không được cấp quyền truy cập vị trí đóng map
        setOpenMap(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };

    if (openMap) {
      openMap();
    }
  }, [openMap]);

  useEffect(() => {
    if (location) {
      setRegion(location);
    }
  }, [location]);

  useEffect(() => {
    fetchLodging();
  }, [lodgingId]);

  useEffect(() => {
    if (!lodging) return;

    setName(lodging.name);
    setProvince(lodging.province ?? province);
    setDistrict(lodging.district ?? district);
    setWard(lodging.ward ?? ward);
    setLodgingType(lodging.type ?? lodgingType);
    setStreet(lodging.address ?? street);
    setAreaRoom(lodging.area_room_default?.toString() ?? areaRoom);
    setPriceRoom(lodging.price_room_default?.toString() ?? priceRoom);
    setPaymentDate(lodging.payment_date);
    setLateDays(lodging.late_days);
    setLocation((prev) => {
      if (!lodging.latitude && !lodging.longitude) return prev;

      const base = prev ?? {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      return {
        ...base,
        latitude: lodging.latitude ? Number(lodging.latitude) : base.latitude,
        longitude: lodging.longitude
          ? Number(lodging.longitude)
          : base.longitude,
      };
    });
  }, [lodging]);

  //Memo
  const view = useMemo(
    () => [
      <InfoAndLocation
        {...{
          name,
          setName,
          province,
          district,
          ward,
          setOpenMap: handleOpenMap,
          location,
          lodgingType,
          setLodgingType,
          setDistrict,
          setProvince,
          setStreet,
          setWard,
          street,
        }}
      />,
      <Config
        {...{
          areaRoom,
          priceRoom,
          setAreaRoom,
          setPriceRoom,
          lateDays,
          paymentDate,
          setLateDays,
          setPaymentDate,
        }}
      />,
    ],
    [
      location,
      province,
      district,
      ward,
      handleOpenMap,
      locationCurrent,
      lodgingType,
      setLodgingType,
      setDistrict,
      setProvince,
      setStreet,
      setWard,
      street,
      name,
      setName,
      paymentDate,
      setPaymentDate,
      lateDays,
      setLateDays,
      areaRoom,
      setAreaRoom,
      priceRoom,
      setPriceRoom,
    ]
  );

  return (
    <View className="flex-1">
      <Layout title={"Chỉnh sửa nhà cho thêm"}>
        {loading && (
          <View className="absolute inset-0 z-10 items-center justify-center">
            {/* Tạo nền mờ */}
            <BlurView
              className="absolute w-full h-full"
              intensity={30}
              tint="dark"
            />

            {/* Animation Loading */}
            <LoadingAnimation className="text-white-50" />
          </View>
        )}

        <ScrollView className="px-5 flex-grow bg-white-50">
          <View className="gap-3 items-center py-3 flex-1">
            {view[viewIndex]}
          </View>
        </ScrollView>

        <View className="bg-white-50 relative">
          <View className="p-3 gap-2 ">
            <View className="flex-row flex gap-1">
              {view.map((_, index) => {
                return (
                  <Divide
                    key={index}
                    direction="horizontal"
                    className={cn(
                      "h-2 flex-1 border-1",
                      index <= viewIndex
                        ? "border-transparent bg-lime-400"
                        : "bg-white-50 border-mineShaft-200"
                    )}
                  />
                );
              })}
            </View>
            <View className="flex-row flex gap-1 ">
              <Button
                disabled={processing}
                onPress={handleBackView}
                className="flex-1 bg-white-50 border-1 border-mineShaft-200 py-4"
              >
                <Text className="text-mineShaft-950 text-16 font-BeVietnamSemiBold">
                  {viewIndex == view.length - 1 ? "Quay lại" : "Đóng trang"}
                </Text>
              </Button>
              <Button
                disabled={processing}
                loading={processing}
                onPress={handleNextView}
                classNameLoading="text-white-50"
                className="flex-1 bg-mineShaft-950 py-4"
              >
                <Text className="text-white-50 text-16 font-BeVietnamSemiBold">
                  {viewIndex == view.length - 1 ? "Hoàn thành" : "Tiếp theo"}
                </Text>
              </Button>
            </View>
          </View>
          <View className="bg-white-50 h-5 w-5 absolute bottom-full">
            <View className="absolute h-5 w-5 rounded-bl-full bg-mineShaft-50"></View>
          </View>
          <View className="bg-white-50 h-5 w-5 absolute bottom-full right-0">
            <View className="absolute h-5 w-5 rounded-br-full bg-mineShaft-50"></View>
          </View>
        </View>
      </Layout>
      {location && region && openMap && (
        <MapEdit
          {...{
            location,
            region,
            handleSelectLocation,
            setRegion,
            setLocation,
            setOpenMap,
          }}
        />
      )}
    </View>
  );
}

export default EditLodging;
