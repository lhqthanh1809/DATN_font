import Layout from "@/ui/layout/Layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BoxInfo } from "@/pages/Equipment/BoxInfo";
import Button from "@/ui/Button";
import * as FileSystem from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import { constant } from "@/assets/constant";
import { BoxRoom } from "@/pages/Equipment/BoxRoom";
import { IRoom } from "@/interfaces/RoomInterface";
import { AssetInfo } from "expo-media-library";
import {
  ICreateEquipment,
  IEquipment,
  IUpdateEquipment,
} from "@/interfaces/EquipmentInterface";
import { EquipmentService } from "@/services/Equipment/EquipmentService";
import useToastStore from "@/store/useToastStore";
import { IError } from "@/interfaces/ErrorInterface";
import { BlurView } from "expo-blur";
import LoadingAnimation from "@/ui/LoadingAnimation";
import { useEquipmentStore } from "@/store/equipment/useEquipmentStore";

function UpdateEquipment() {
  const { lodgingId, id } = useLocalSearchParams();
  const {
    equipment,
    fetchEquipment,
    handleUpdateEquipment,
    loading,
    loadingProcess,
    name,
    quantity,
    rooms,
    selectPhotos,
    selectRooms,
    setName,
    setQuantity,
    setRooms,
    setSelectPhotos,
    setSelectRooms,
    setType,
    type,
  } = useEquipmentStore();

  useEffect(() => {
    fetchEquipment(id as string);
  }, [id]);

  return (
    <View className="flex-1">
      <Layout title="Cập nhật thiết bị">
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
        <ScrollView className="px-3 flex-grow bg-white-50">
          <View className="gap-3 items-center py-3 flex-1">
            <BoxInfo
              {...{
                photo: selectPhotos,
                setPhoto: setSelectPhotos,
                setType,
                type,
                name,
                setName,
                quantity,
                setQuantity,
              }}
            />
            {type === constant.equipment.type.private && (
              <BoxRoom
                {...{
                  rooms,
                  selectRooms,
                  setRooms,
                  setSelectRooms,
                  lodgingId: lodgingId as string,
                }}
              />
            )}
          </View>
        </ScrollView>
        <View className="p-3 flex bg-white-50">
          <View className="flex-row gap-2">
            <Button
              disabled={loadingProcess}
              className="flex-1 bg-red-600 py-4"
            >
              <Text className="text-white-50 text-16 font-BeVietnamSemiBold">
                Xoá phòng
              </Text>
            </Button>
            <Button
              disabled={loadingProcess}
              loading={loadingProcess}
              onPress={() => handleUpdateEquipment(lodgingId as string)}
              className="flex-1 bg-lime-400 py-4"
            >
              <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
                Chỉnh sửa
              </Text>
            </Button>
          </View>
        </View>
      </Layout>
    </View>
  );
}

export default UpdateEquipment;
