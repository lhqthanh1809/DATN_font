import { ScrollView, View } from "react-native";
import React, { useEffect } from "react";
import ILocation from "@/interfaces/LocationInterface";
import { LodgingType } from "@/interfaces/LodgingInterface";
import { BoxInfo } from "./BoxInfo";
import { BoxLocation } from "./BoxLocation";

const InfoAndLocation: React.FC<
  ILocation & {
    lodgingType: LodgingType | null;
    setLodgingType: (type: LodgingType | null) => void;
    setOpenMap: (openMap: boolean) => void;
    name: string;
    setName: (name: string) => void;
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
  name,
  setName,
}) => {
  
  return (
      <View className="gap-3 items-center py-3 flex-1">
        <BoxInfo
          {...{
            name,
            setName,
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
  );
};

export default InfoAndLocation;
