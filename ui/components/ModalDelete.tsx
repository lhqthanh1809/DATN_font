import { constant } from "@/assets/constant";
import { useUI } from "@/hooks/useUI";
import { IError } from "@/interfaces/ErrorInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Cross, CrossMedium, Trash } from "@/ui/icon/symbol";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import LoadingAnimation from "../LoadingAnimation";

const ModalDelete: React.FC<{
  handleConfirmDelete: () => void;
  title: string;
  subTitle: string;
}> = ({ handleConfirmDelete, title, subTitle }) => {
  const { hideModal } = useUI();
  const [loading, setLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      await handleConfirmDelete();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [handleConfirmDelete]);

  return (
    <View className="h-full w-full items-center justify-center">
      <View className="w-full px-6">
        <Button className="bg-white-50 flex-col p-6" onPress={() => {}}>
          {/* <Button
            disabled={loading}
            onPress={() => {
              hideModal();
            }}
            className="absolute right-3 top-3"
          >
            <Icon icon={CrossMedium} />
          </Button> */}

          <View className="gap-1">
            <Text className="font-BeVietnamSemiBold text-16 text-center">
              {title}
            </Text>
            <View className="px-5">

            <Text className="font-BeVietnamMedium text-center text-mineShaft-500">
              {subTitle}
            </Text>
            </View>
          </View>

          <View className="w-full gap-3">
            <Button
              disabled={loading}
              onPress={() => {
                handleDelete();
              }}
              className="bg-redPower-600 py-3 gap-2 items-center"
            >
              {loading ? <LoadingAnimation size={18} strokeWidth={2} color="#FBECEC"/> : <Icon icon={Trash} className="text-redPower-100"/>}
              <Text className="text-redPower-100 font-BeVietnamMedium">
              {loading ? "Đang xoá..." : "Xác nhận"}
              </Text>
            </Button>
            <Button
              disabled={loading}
              onPress={() => {
                hideModal();
              }}
              className="bg-mineShaft-100 py-3"
            >
              <Text className="text-mineShaft-900 font-BeVietnamMedium">
                Huỷ bỏ
              </Text>
            </Button>
          </View>
        </Button>
      </View>
    </View>
  );
};

export default ModalDelete;
