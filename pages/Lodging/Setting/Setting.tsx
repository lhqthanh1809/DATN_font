import { useUI } from "@/hooks/useUI";
import useLodgingStore from "@/store/lodging/user/useLodgingStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Home2, Trash } from "@/ui/icon/symbol";
import BoxDevInfor from "@/ui/layout/BoxDevInfor";
import { Href, router } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

const SettingScreen: React.FC<{
  lodgingId: string;
}> = ({ lodgingId }) => {
  const { showModal } = useUI();
  const { deleteLodging } = useLodgingStore();
  const functions = useMemo(() => {
    return [
      {
        name: "Thông tin nhà cho thuê",
        icon: Home2,
        router: `lodging/${lodgingId}/edit`,
      },
    ];
  }, [lodgingId]);

  return (
    <ScrollView className="flex-1 p-3">
      <View className="gap-2">
        <View className="gap-2 border-1 border-white-100 bg-white-50 p-3 rounded-lg shadow-soft-md">
          {functions.map((item, index) => (
            <Button
              onPress={() => {
                router.push(item.router as Href);
              }}
              key={index}
              className="border-1 border-lime-500 px-4 py-2 flex-1 basis-1/3 gap-3 justify-start"
            >
              <Icon icon={item.icon} />
              <Text className="font-BeVietnamMedium">{item.name}</Text>
            </Button>
          ))}
        </View>

        <Button onPress={() => { deleteLodging(lodgingId, showModal) }} className="border-1 border-redPower-600 bg-redPower-600 items-center gap-3 py-3">
          <Icon icon={Trash} className="text-redPower-100" />
          <Text className="font-BeVietnamMedium text-redPower-100">
            Xoá nhà cho thuê
          </Text>
        </Button>

        <BoxDevInfor />
      </View>
    </ScrollView>
  );
};

export default SettingScreen;
