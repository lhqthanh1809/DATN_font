import { IMap } from "@/interfaces/MapInterface";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import {
  QuarterCircleInsideBLeft,
  QuarterCircleInsideBRight,
} from "@/ui/icon/shapes";
import { Compass } from "@/ui/icon/travel";
import Map from "@/ui/Map";
import { useCallback } from "react";
import { View, Pressable, Text } from "react-native";
import { MapPressEvent } from "react-native-maps";

const MapEdit: React.FC<{
  location: IMap;
  region: IMap;
  setLocation: (location: IMap) => void;
  setRegion: (region: IMap) => void;
  setOpenMap: (openMap: boolean) => void;
  handleSelectLocation: () => void;
}> = ({
  location,
  region,
  setOpenMap,
  setLocation,
  setRegion,
  handleSelectLocation,
}) => {
  const handleMapPress = useCallback((event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    const newLocation = { ...location, latitude, longitude };
    setLocation(newLocation);
  }, []);

  const handleBackLocation = useCallback(() => {
    setRegion(location);
  }, [location]);

  return (
    <View
      className="absolute w-full h-full bg-black"
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponderCapture={() => true}
    >
      <Map
        location={location}
        onPress={handleMapPress}
        region={region}
        showUserLocation={true}
        onChangeRegion={(region) => setRegion(region)}
      />
      <View className="absolute bottom-0 w-full bg-white-50 gap-1">
        <View className="p-3 gap-2 ">
          <Button
            onPress={handleSelectLocation}
            className="w-full bg-mineShaft-950 py-3"
          >
            <Text className="text-white-50 text-14 font-BeVietnamSemiBold">
              Chọn vị trí
            </Text>
          </Button>
          <Button
            onPress={() => {
              setOpenMap(false);
            }}
            className="flex-1 bg-white-50 border-1 border-mineShaft-200 py-3"
          >
            <Text className="text-mineShaft-950 text-14 font-BeVietnamSemiBold">Đóng định vị vị trí</Text>
          </Button>
        </View>
        <View className="absolute bottom-full">
          <Icon icon={QuarterCircleInsideBLeft} className="text-white-50" />
        </View>
        <View className="absolute bottom-full right-0">
          <Icon icon={QuarterCircleInsideBRight} className="text-white-50" />
        </View>

        <View className="absolute bottom-full w-full left-0 p-2">
          <View className="bg-white-50 p-3 rounded-full">
            <Text className="font-BeVietnamMedium text-14 text-center text-mineShaft-800">
              {location.latitude}, {location.longitude}
            </Text>
          </View>
        </View>

        <View className="absolute bottom-full right-0 px-4 py-20">
          <Pressable
            onPress={handleBackLocation}
            className="bg-white-50 p-2 rounded-full"
          >
            <Icon icon={Compass} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default MapEdit;
