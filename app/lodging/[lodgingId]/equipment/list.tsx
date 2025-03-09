import { IEquipment } from "@/interfaces/EquipmentInterface";
import { EquipmentService } from "@/services/Equipment/EquipmentService";
import Button from "@/ui/button";
import Icon from "@/ui/icon";
import { Lock } from "@/ui/icon/security";
import { Globe } from "@/ui/icon/symbol";
import ViewHasButtonAdd from "@/ui/layout/add_button";
import HeaderBack from "@/ui/layout/header";
import { router, useLocalSearchParams } from "expo-router";
import { isArray } from "lodash";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

function ListEquipment() {
  const { lodgingId } = useLocalSearchParams();
  const equipmentService = new EquipmentService();
  const [loading, setLoading] = useState(false);
  const [equipments, setEquipments] = useState<IEquipment[]>([]);

  const fetchList = useCallback(async () => {
    setLoading(true);

    equipmentService.lodgingId = lodgingId as string;
    const data = await equipmentService.listEquipment();

    if (isArray(data)) {
      setEquipments(data);
    }

    setLoading(false);
  }, [lodgingId]);

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <View className="flex-1">
      <HeaderBack title="Danh sách trang thiết bị" />
      <ViewHasButtonAdd
        onPressAdd={() => {
          router.push(`/lodging/${lodgingId}/equipment/create`);
        }}
      >
        <ScrollView className="px-3 flex-1">
          <View className="py-3 gap-3 flex-row flex-wrap flex-1">
            {loading
              ? Array(7)
                  .fill("")
                  .map((_, index) => (
                    <Button
                      className="flex-1 basis-1/3 h-20 max-h-52 aspect-square bg-white-100 overflow-hidden relative"
                      key={index}
                    >
                      <View className="absolute w-full bottom-0 left-0 p-1">
                        <View className="bg-mineShaft-950/60 rounded-2xl p-2 flex-row justify-between items-center">
                          <View className="gap-1">
                            <Skeleton
                              colorMode="light"
                              height={18}
                              width={"70%"}
                            />
                            <Skeleton
                              colorMode="light"
                              height={16}
                              width={"50%"}
                            />
                          </View>
                          <Skeleton
                            colorMode="light"
                            radius={"round"}
                            height={28}
                            width={28}
                          />
                        </View>
                      </View>
                    </Button>
                  ))
              : equipments.map((equipment) => (
                  <Button
                    className="flex-1 basis-1/3 h-20 max-h-52 aspect-square bg-black overflow-hidden relative border-1 border-white-100"
                    key={equipment.id}
                  >
                    <Image
                      className="w-full h-full object-cover"
                      source={{ uri: equipment.thumbnail }}
                    />

                    <View className="absolute w-full bottom-0 left-0 p-1">
                      <View className="bg-mineShaft-950/60 rounded-2xl p-2 flex-row justify-between items-center">
                        <View className="gap-1">
                          <Text numberOfLines={1} className="font-BeVietnamMedium text-white-50 truncate">
                            {equipment.name}
                          </Text>
                          <Text className="font-BeVietnamMedium text-white-400 text-10">
                            Số lượng: {equipment.quantity}
                          </Text>
                        </View>
                        <View className="bg-lime-500 p-1 rounded-full">
                          <Icon
                            className="text-white-50"
                            icon={equipment.type % 2 != 0 ? Lock : Globe}
                          />
                        </View>
                      </View>
                    </View>
                  </Button>
                ))}
          </View>
        </ScrollView>
      </ViewHasButtonAdd>
    </View>
  );
}

export default ListEquipment;
