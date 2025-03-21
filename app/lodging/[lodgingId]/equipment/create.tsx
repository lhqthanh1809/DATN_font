import { BoxPaymentTimeBill } from "@/ui/layout/BoxPaymentTimeBill";
import Layout from "@/ui/layout/Layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { BoxInfo } from "@/pages/Equipment/BoxInfo";
import Button from "@/ui/Button";
import { router, useLocalSearchParams } from "expo-router";
import { constant } from "@/assets/constant";
import { BoxRoom } from "@/pages/Equipment/BoxRoom";
import { IRoom } from "@/interfaces/RoomInterface";
import { AssetInfo } from "expo-media-library";
import { ICreateEquipment } from "@/interfaces/EquipmentInterface";
import { EquipmentService } from "@/services/Equipment/EquipmentService";
import useToastStore from "@/store/useToastStore";
import * as FileSystem from "expo-file-system";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";

function CreateEquipment() {
  const { lodgings } = useLodgingsStore();
  const { lodgingId } = useLocalSearchParams();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [selectRooms, setSelectRooms] = useState<IRoom[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<number>(constant.equipment.type.private);
  const [selectPhotos, setSelectPhotos] = useState<(AssetInfo | string)[]>([]);

  const [loading, setLoading] = useState(false);
  const equipmentService = new EquipmentService();
  const { addToast } = useToastStore();

  const handleCreateEquipment = useCallback(async () => {
    const images = selectPhotos.filter((item) => typeof item == "string" || item.mediaType === "photo");

    if (images.length <= 0) {
      addToast(constant.toast.type.error, "Ảnh đại diện là bắt buộc");
      return;
    }

    if (!name) {
      addToast(constant.toast.type.error, "Tên thiết bị là bắt buộc");
      return;
    }

    if (!quantity) {
      addToast(constant.toast.type.error, "Số lượng là bắt buộc");
      return;
    }

    if (quantity < selectRooms.length) {
      addToast(
        constant.toast.type.error,
        "Số lượng trang thiết bị không đủ để trang bị"
      );
      return;
    }
    setLoading(true);
    try {
        let thumbnail = images[0];
        if(typeof thumbnail != "string"){
            const base64 = await FileSystem.readAsStringAsync(thumbnail.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            const extension = thumbnail.filename.split(".")[1].toLocaleLowerCase();
            thumbnail = `data:image/${extension};base64,${base64}`;
        }

      let dataReq: ICreateEquipment = {
        lodging_id: lodgingId as string,
        name,
        type,
        quantity,
        thumbnail,
      };
      if (selectRooms.length > 0) {
        dataReq = {
          ...dataReq,
          room_ids: selectRooms.map((item) => item.id ?? ""),
        };
      }
      const res = await equipmentService.createEquipment(dataReq);
      if ("message" in res) {
        addToast(constant.toast.type.error, res.message);
      }
      addToast(constant.toast.type.success, "Thêm trang thiết bị thành công.");
      router.back();
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
