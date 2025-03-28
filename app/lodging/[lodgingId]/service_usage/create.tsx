import { constant } from "@/assets/constant";
import { cn, convertToNumber, formatNumber } from "@/helper/helper";
import { IError } from "@/interfaces/ErrorInterface";
import { IRoomUsage } from "@/interfaces/RoomUsageInterface";
import ItemRoomUsage from "@/pages/RoomUsage/RoomUsageItem";
import RoomUsageService from "@/services/RoomUsage/RoomUsageService";
import ServiceManagerService from "@/services/Service/ServiceManagerService";
import { useListRoomUsageStore } from "@/store/roomUsage/useListRoomUsageStore";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import HeaderBack from "@/ui/layout/HeaderBack";
import { router, useLocalSearchParams } from "expo-router";
import { isArray } from "lodash";
import { AnimatePresence, MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";

const roomUsageService = new RoomUsageService();

const Create = () => {
  const { lodgingId } = useLocalSearchParams();
  const { fetchRoomUsages, loading, roomUsages, removeRoomUsage } =
    useListRoomUsageStore();
  const { addToast } = useToastStore();

  const [loadingProcess, setLoadingProcess] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [value, setValue] = useState("");

  const handleCloseService = useCallback(
    async (id: string, currentValue: number) => {
      setLoadingProcess(true);
      const newValue = formatNumber(value, "float") ?? 0;

      try {
        if (newValue < currentValue) {
          addToast(constant.toast.type.error, "Chỉ số mới bé hơn chỉ số cũ");
          return;
        }

        const result = await roomUsageService.finalizedRoomUsage({
          lodging_id: lodgingId as string,
          final_index: newValue,
          room_usage_id: id,
        });

  
        if (result.hasOwnProperty("message")) {
          addToast(constant.toast.type.error, (result as IError).message);
          return;
        }

        if(!result){
          addToast(constant.toast.type.error, "Chốt dịch vụ thất bại");
          return;
        }
        addToast(constant.toast.type.success, "Chốt dịch vụ thành công!");
        setValue("")
        setActive(null)
        removeRoomUsage((result as IRoomUsage).id)
      } catch (err) {
      } finally {
        setLoadingProcess(false);
      }
    },
    [active, lodgingId, value]
  );

  useEffect(() => {
    fetchRoomUsages(lodgingId as string);
  }, [lodgingId]);

  useEffect(() => {
    setValue("");
  }, [active]);

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Chốt dịch vụ tháng" />

      <ScrollView className="flex-1 px-3">
        <View className="py-3 gap-3">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <Button
                className="w-full bg-white-100 rounded-xl p-4 flex-col items-start gap-2"
                key={index}
              >
                <View className="flex-row gap-4 w-full items-center">
                  <View className="w-1/4">
                    <Skeleton colorMode="light" width={"100%"} height={120} />
                  </View>
                  <View className="gap-4 flex-1">
                    <View className="gap-2 flex-row">
                      <Skeleton
                        colorMode="light"
                        width={44}
                        height={44}
                        radius={"round"}
                      />
                      <View className="gap-2">
                        <Skeleton colorMode="light" width={"80%"} height={20} />
                        <Skeleton colorMode="light" width={"74%"} height={20} />
                      </View>
                    </View>

                    <Skeleton colorMode="light" width={"64%"} height={20} />
                  </View>
                </View>
              </Button>
            ))
          ) : (
            <AnimatePresence>
              {roomUsages.map((roomUsage) => (
                <ItemRoomUsage
                  key={roomUsage.id}
                  roomUsage={roomUsage}
                  active={active}
                  setActive={setActive}
                  value={value}
                  setValue={setValue}
                  loadingProcess={loadingProcess}
                  onCloseService={handleCloseService}
                />
              ))}
            </AnimatePresence>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Create;
