import { useGeneral } from "@/hooks/useGeneral";
import { BoxPaymentTimeBill } from "@/ui/layout/box_payment_time_bill";
import Layout from "@/ui/layout/layout_create";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BoxInfo } from "@/pages/Equipment/BoxInfo";
import Button from "@/ui/button";
import * as FileSystem from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import { constant } from "@/assets/constant";
import { BoxRoom } from "@/pages/Equipment/BoxRoom";
import { IRoom } from "@/interfaces/RoomInterface";
import { AssetInfo } from "expo-media-library";
import { ICreateEquipment } from "@/interfaces/EquipmentInterface";
import { EquipmentService } from "@/services/Equipment/EquipmentService";

function CreateEquipment() {
  const { lodgings } = useGeneral();
  const { lodgingId } = useLocalSearchParams();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [selectRooms, setSelectRooms] = useState<IRoom[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<number>(constant.equipment.type.private);
  const [selectPhotos, setSelectPhotos] = useState<AssetInfo[]>([]);

  const [loading, setLoading] = useState(false);
  const equipmentService = new EquipmentService();

  const handleCreateEquipment = useCallback(async () => {
    const images = selectPhotos.filter((item) => item.mediaType === "photo");
    if (
      images.length <= 0 ||
      name ||
      type ||
      quantity ||
      quantity < selectPhotos.length
    )
      return;
    setLoading(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(images[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const extension = images[0].filename.split(".")[1].toLocaleLowerCase();
      const imageBase64 = `data:image/${extension};base64,${base64}`;

      let dataReq: ICreateEquipment = {
        lodging_id: lodgingId as string,
        name,
        type,
        quantity,
        thumbnail: imageBase64,
      };
      if (selectRooms.length > 0) {
        dataReq = {
          ...dataReq,
          room_ids: selectRooms.map((item) => item.id ?? ""),
        };
      }
      const res = await equipmentService.createEquipment(dataReq);
      if (!("message" in res)) {
        router.back();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [lodgingId, selectPhotos, selectRooms, name, type, quantity]);

  return (
    <View className="flex-1">
      <Layout title="Thêm thiết bị mới mới">
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
          <View className="flex-row">
            <Button
              disabled={loading}
              loading={loading}
              onPress={() => {
                handleCreateEquipment();
              }}
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

export default CreateEquipment;
