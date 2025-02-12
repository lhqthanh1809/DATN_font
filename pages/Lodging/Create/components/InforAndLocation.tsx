import { ScrollView, View } from "react-native";
import BoxInfor from "./BoxInfor";
import { BoxLocation } from "./BoxLocation";
import React from "react";
import LocationInterface from "@/interfaces/LocationInterface";
import { LodgingType } from "@/interfaces/LodgingInterface";

const InforAndLocation: React.FC<
  LocationInterface & {
    lodgingType: LodgingType | null;
    setLodgingType: (type: LodgingType | null) => void;
    setOpenMap: (openMap: boolean) => void;
  }
> = ({
  setLodgingType,
  lodgingType,
  setOpenMap,
  province,
  district,
  ward,
  location,
  setDistrict,
  setProvince,
  setStreet,
  setWard,
  street,
}) => {
  return (
    <ScrollView className="px-5 flex-grow">
      <View className="gap-3 items-center py-3 flex-1">
        <BoxInfor
          {...{
            setLodgingType,
            lodgingType,
          }}
        />
        <BoxLocation
          {...{
            setDistrict,
            setProvince,
            setWard,
            setStreet,
            district,
            province,
            ward,
            street,
            setOpenMap,
            location,
          }}
        />
      </View>
    </ScrollView>
  );
};

export default InforAndLocation;
