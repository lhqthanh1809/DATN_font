import Button from "@/ui/button";
import Divide from "@/ui/divide";
import Icon from "@/ui/icon";
import { ChevronLeft } from "@/ui/icon/symbol";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import { MapEdit, InforAndLocation, Config } from "./components";
import { MapInterface } from "@/interfaces/MapInterface";
import BackView from "@/ui/back_view";
import { cn } from "@/helper/helper";
import { useRouter } from "expo-router";
import { LodgingType } from "@/interfaces/LodgingInterface";
import { LocationUnit } from "@/interfaces/LocationInterface";

function CreateLodging() {
  //Initial
  const route = useRouter();
  const [lodgingType, setLodgingType] = useState<LodgingType | null>(null);
  const [province, setProvince] = useState<LocationUnit | null>(null);
  const [district, setDistrict] = useState<LocationUnit | null>(null);
  const [ward, setWard] = useState<LocationUnit | null>(null);
  const [street, setStreet] = useState("");
  const [openMap, setOpenMap] = useState(false);
  const [location, setLocation] = useState<MapInterface | null>(null); // Vị trí mặc định
  const [locationCurrent, setLocationCurrent] = useState<MapInterface | null>(
    null
  ); // Vị trí hiện tại được chọn
  const [region, setRegion] = useState<MapInterface | null>(location);
  const [viewIndex, setViewIndex] = useState(0);

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

  const handleNextView = useCallback(() => {
    setViewIndex((prev) => {
      return prev == view.length - 1 ? view.length - 1 : ++prev;
    });
  }, [viewIndex]);
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
      <InforAndLocation
        {...{
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
      <Config />,
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
    ]
  );

  return (
    <View className="flex-1">
      <KeyboardAvoidingView
        className="flex-1 bg-mineShaft-50 relative"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <View className="px-6 bg-white-50 py-2 flex-row items-center gap-3">
          <Pressable
            onPress={() => {
              route.back();
            }}
            className="border-1 border-mineShaft-950 flex items-center justify-center rounded-full"
          >
            <Icon icon={ChevronLeft} className="text-mineShaft-950" />
          </Pressable>
          <Text className="font-BeVietnamBold text-16 text-mineShaft-900">
            Thêm mới nhà cho thêm
          </Text>
        </View>
        {view[viewIndex]}
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
                onPress={handleBackView}
                className="flex-1 bg-white-50 border-1 border-mineShaft-200"
              >
                <Text className="text-mineShaft-950 text-16 font-BeVietnamSemiBold">
                  {viewIndex == view.length - 1 ? "Quay lại" : "Đóng trang"}
                </Text>
              </Button>
              <Button
                onPress={handleNextView}
                className="flex-1 bg-mineShaft-950"
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
