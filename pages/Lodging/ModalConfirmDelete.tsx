import { constant } from "@/assets/constant";
import { useUI } from "@/hooks/useUI";
import { IError } from "@/interfaces/ErrorInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";
import useToastStore from "@/store/useToastStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Cross, CrossMedium } from "@/ui/icon/symbol";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";

const ModelConfirmDelete: React.FC<{
  lodgingId: string;
}> = ({ lodgingId }) => {
  const { hideModal } = useUI();
  const { removeLodging } = useLodgingsStore();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);

  const deleteLodging = useCallback(async () => {
    setLoading(true);

    try {
      const result = await new LodgingService().delete(lodgingId);

      if (result.hasOwnProperty("message")) {
        addToast(constant.toast.type.error, "Xoá nhà cho thuê thất bại.");
        return;
      }

      addToast(constant.toast.type.success, "Xoá nhà cho thuê thành công!");
      removeLodging(lodgingId);
      hideModal();
      router.replace("/");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [lodgingId]);

  return (
    <View className="h-full w-full items-center justify-center">
      <View className="w-full px-6">
        <Button className="bg-white-50 flex-col px-3 py-7" onPress={() => {}}>
          <Button
            disabled={loading}
            onPress={() => {
              hideModal();
            }}
            className="absolute right-3 top-3"
          >
            <Icon icon={CrossMedium} />
          </Button>

          <View className="gap-1">
            <Text className="font-BeVietnamSemiBold text-16 text-center">
              Xoá nhà cho thuê
            </Text>
            <Text className="font-BeVietnamMedium text-center text-mineShaft-500">
              Bạn có chắc chắn muốn xoá nhà cho thuê này?
            </Text>
          </View>

          <View className="w-full gap-2">
            <Button
              disabled={loading}
              loading={loading}
              onPress={deleteLodging}
              className="bg-redPower-300 py-3"
            >
              <Text className="text-mineShaft-950 font-BeVietnamMedium">
                Xác nhận
              </Text>
            </Button>
            <Button
              disabled={loading}
              onPress={() => {
                hideModal();
              }}
              className="bg-mineShaft-500 py-3"
            >
              <Text className="text-mineShaft-100 font-BeVietnamMedium">
                Huỷ bỏ
              </Text>
            </Button>
          </View>
        </Button>
      </View>
    </View>
  );
};

export default ModelConfirmDelete;
