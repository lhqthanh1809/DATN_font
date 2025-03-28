import { constant } from "@/assets/constant";
import { useUI } from "@/hooks/useUI";
import { IError } from "@/interfaces/ErrorInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Cross, CrossMedium } from "@/ui/icon/symbol";
import ModalDelete from "@/ui/layout/ModalDelete";
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
    <ModalDelete handleConfirmDelete={deleteLodging} title="Xoá nhà cho thuê" subTitle="Bạn có chắc chắn muốn xoá nhà cho thuê này?" />
  );
};



export default ModelConfirmDelete;
