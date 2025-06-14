import Box from "@/ui/Box";
import DatePicker from "@/ui/Datepicker";
import HeaderBack from "@/ui/components/HeaderBack";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Button from "@/ui/Button";
import BoxWorkToDo from "@/pages/Contract/Delete/BoxWorkToDo";
import useContractStore from "@/store/contract/useContractStore";
import useEndContractStore from "@/store/contract/useEndContractStore";
import { add } from "lodash";
import useToastStore from "@/store/toast/useToastStore";
import { constant } from "@/assets/constant";
import ContractService from "@/services/Contract/ContractService";
import { formatDateForRequest } from "@/helper/helper";
import { goBack } from "expo-router/build/global-state/routing";
import LoadingScreen from "@/ui/layouts/LoadingScreen";

function EndContract() {
  const { id, room_code, code, lodgingId } = useLocalSearchParams();
  const { contract, fetchContract, loading } = useContractStore();
  const { addToast } = useToastStore();
  const { endDate, setEndDate } = useEndContractStore();
  const [loadingProcess, setLoadingProcess] = useState(false);
  const [skip, setSkip] = useState<("payment" | "bill")[]>([]);

  useEffect(() => {
    setEndDate(new Date());
  }, []);

  useEffect(() => {
    fetchContract(id as string);
  }, [id]);

  const handleEndContract = useCallback(async () => {
    setLoadingProcess(true);

    try {
      const result = await new ContractService().endContract({
        contract_id: id as string,
        end_date: formatDateForRequest(endDate),
        ...(skip.length > 0 && { skip }),
      });

      if (typeof result !== "string") {
        throw new Error(result.message || "Đã có lỗi xảy ra");
      }

      addToast(constant.toast.type.success, "Kết thúc hợp đồng thành công");
      router.back();
    } catch (error: any) {
      addToast(constant.toast.type.error, error.message || "Đã có lỗi xảy ra");
    } finally {
      setLoadingProcess(false);
    }
  }, [id, endDate, skip]);

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title={`Kết thúc hợp đồng - #${code}`} />
      {loading && <LoadingScreen />}
      <ScrollView className="flex-1 p-3">
        <View className="gap-3">
          <View className="w-full bg-white-50 rounded-xl p-2 py-3 gap-2 border-1 shadow-soft-md flex-col border-white-100 items-center">
            <Text className="font-BeVietnamSemiBold">
              Kết thúc hợp đồng cho phòng {room_code}
            </Text>
          </View>

          <Box
            title="Ngày kết thúc hợp đồng thực tế"
            description="Là ngày khách thuê muốn rời đi"
          >
            <View className="flex-1">
            </View>
              <DatePicker
                required
                label="Ngày khách rời đi"
                value={endDate}
                onChange={(date) => {
                  setEndDate(date);
                }}
                disabled
              />
          </Box>

          <BoxWorkToDo
            skip={skip}
            setSkip={setSkip}
            lodgingId={lodgingId as string}
          />
        </View>
      </ScrollView>

      <View className="p-3 flex bg-white-50">
        <Button
          loading={loadingProcess}
          disabled={loadingProcess}
          onPress={handleEndContract}
          className="bg-lime-400 py-4"
        >
          <Text className="text-mineShaft-900 text-16 font-BeVietnamSemiBold">
            Kết thúc
          </Text>
        </Button>
      </View>
    </View>
  );
}

export default EndContract;
