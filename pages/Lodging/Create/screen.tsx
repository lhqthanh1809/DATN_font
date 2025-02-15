import Button from "@/ui/button";
import Divide from "@/ui/divide";
import Icon from "@/ui/icon";
import { ChevronLeft } from "@/ui/icon/symbol";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import { MapEdit, InfoAndLocation, Config } from "./components";
import { IMap } from "@/interfaces/MapInterface";
import { cn, formatNumber } from "@/helper/helper";
import { useRouter } from "expo-router";
import { ILodging, LodgingType } from "@/interfaces/LodgingInterface";
import { LocationUnit } from "@/interfaces/LocationInterface";
import { IResponse } from "@/interfaces/ResponseInterface";
import { BaseHttpService } from "@/services/BaseHttpService";
import { apiRouter } from "@/assets/ApiRouter";
import { HttpStatusCode } from "axios";
import LodgingService from "@/services/Lodging/LodgingService";
import HeaderBack from "@/ui/layout/header";

function CreateLodging() {
  //Initial
  const route = useRouter();
  const [lodgingType, setLodgingType] = useState<LodgingType | null>(null);
  const [province, setProvince] = useState<LocationUnit | null>(null);
  const [district, setDistrict] = useState<LocationUnit | null>(null);
  const [ward, setWard] = useState<LocationUnit | null>(null);
  const [street, setStreet] = useState<string>("");
  const [openMap, setOpenMap] = useState(false);
  const [location, setLocation] = useState<IMap | null>(null); // Vị trí mặc định
  const [locationCurrent, setLocationCurrent] = useState<IMap | null>(
    null
  ); // Vị trí hiện tại được chọn
  const [region, setRegion] = useState<IMap | null>(location);
  const [viewIndex, setViewIndex] = useState(0);
  const [name, setName] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState(5);
  const [lateDays, setLateDays] = useState(5);
  const [areaRoom, setAreaRoom] = useState<string>("");
  const [priceRoom, setPriceRoom] = useState<string>("");
  const [processingCreate, setProcessingCreate] = useState(false);

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

  // Xử lý tạo nhà trọ
  const handleCreateLodging = useCallback(async () => {
    setProcessingCreate(true);
    if (!lodgingType || !name) return;
    const dataReq: ILodging = {
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
    const data = await new LodgingService().create(dataReq);

    if ("code" in data) {
      setProcessingCreate(false);
    } else route.push("/");
  }, [
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

  const handleNextView = useCallback(() => {
    if (viewIndex < view.length - 1) {
      setViewIndex((prev) => ++prev);
      return;
    }

    handleCreateLodging();
  }, [viewIndex, handleCreateLodging]);

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
          location: locationCurrent,
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
      <KeyboardAvoidingView
        className="flex-1 bg-mineShaft-50 relative"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <HeaderBack title="Thêm mới nhà cho thêm"/>
        <ScrollView className="px-5 flex-grow bg-white-50">{view[viewIndex]}</ScrollView>

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
                disabled={processingCreate}
                onPress={handleBackView}
                className="flex-1 bg-white-50 border-1 border-mineShaft-200 py-4"
              >
                <Text className="text-mineShaft-950 text-16 font-BeVietnamSemiBold">
                  {viewIndex == view.length - 1 ? "Quay lại" : "Đóng trang"}
                </Text>
              </Button>
              <Button
                disabled={processingCreate}
                loading={processingCreate}
                onPress={handleNextView}
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
      </KeyboardAvoidingView>
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

export default CreateLodging;
