import { EquipmentService } from "@/services/Equipment/EquipmentService";
import Button from "@/ui/button";
import Icon from "@/ui/icon";
import { Lock } from "@/ui/icon/security";
import { Globe } from "@/ui/icon/symbol";
import ViewHasButtonAdd from "@/ui/layout/add_button";
import HeaderBack from "@/ui/layout/header";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

function ListEquipment() {
  const { lodgingId } = useLocalSearchParams();
  const equipmentService = new EquipmentService();
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);

    equipmentService.lodgingId = lodgingId as string;
    const data = await equipmentService.listEquipment();

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
            {Array(7)
              .fill("")
              .map((_, index) => (
                <Button
                  className="flex-1 basis-1/3 h-20 max-h-52 aspect-square bg-black overflow-hidden relative"
                  key={index}
                >
                  <Image
                    className="w-full h-full object-cover"
                    source={require("../../../../assets/images/may_giac.jpg")}
                  />

                  <View className="absolute w-full bottom-0 left-0 p-1">
                    <View className="bg-mineShaft-950/60 rounded-2xl p-2 flex-row justify-between items-center">
                      <View>
                        <Text className="font-BeVietnamMedium text-white-50">
                          Máy giặc
                        </Text>
                        <Text className="font-BeVietnamMedium text-white-400 text-10">
                          Số lượng: 20
                        </Text>
                      </View>
                      <View className="bg-lime-500 p-1 rounded-full">
                        <Icon
                          className="text-white-50"
                          icon={index % 2 == 0 ? Lock : Globe}
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
