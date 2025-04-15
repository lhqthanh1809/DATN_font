import { constant } from "@/assets/constant";
import { convertToNumber, formatDateForRequest, formatNumber } from "@/helper/helper";
import { ICreateFinalBill } from "@/interfaces/ContractInterface";
import BoxDepositRefund from "@/pages/Contract/BoxDepositRefund";
import BoxRentalMonth from "@/pages/Contract/BoxRentalMonth";
import BoxServiceUsage from "@/pages/Contract/BoxServiceUsage";
import ContractService from "@/services/Contract/ContractService";
import useContractStore from "@/store/contract/useContractStore";
import useEndContractStore from "@/store/contract/useEndContractStore";
import useLodgingServiceStore from "@/store/lodgingService/useLodgingServiceStore";
import useToastStore from "@/store/toast/useToastStore";
import Box from "@/ui/Box";
import Button from "@/ui/Button";
import DatePicker from "@/ui/Datepicker";
import { Money } from "@/ui/icon/finance";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import HeaderBack from "@/ui/components/HeaderBack";
import ListModel from "@/ui/ListModal";
import { router, useLocalSearchParams } from "expo-router";
import { values } from "lodash";
import { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

function FinalBill() {
  const { lodgingId } = useLocalSearchParams();
  const { services } = useLodgingServiceStore();
  const { contract } = useContractStore();
  const { addToast } = useToastStore();
  const { endDate, setEndDate } = useEndContractStore();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalRental, setTotalRental] = useState(0);
  const [totalService, setTotalService] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [moneyRefund, setMoneyRefund] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTotalPrice(0);
  }, [contract]);

  useEffect(() => {
    setTotalPrice(totalRental + totalService - totalDeposit);
  }, [totalRental, totalService, totalDeposit]);

  const handleCreateFinalBill = useCallback(async () => {
    if (!contract) {
      addToast(
        constant.toast.type.error,
        "Không tìm thấy hợp đồng để lập quyết toán"
      );
      return;
    }
    setLoading(true);
    try {
      const data : ICreateFinalBill = {
        contract_id: contract?.id,
        room_id: contract?.room_id,
        deposit_amount_refund: moneyRefund,
        end_date: formatDateForRequest(endDate),
        ...(services.length > 0 && {
          services: services
            .filter((service) => service.id !== undefined)
            .map((service) => ({
              id: service.id as string,
              value: typeof service.current_value == "string" ? formatNumber(service.current_value, "float") : service.current_value,
            })),
        }),
      };
      
      const result = await (new ContractService).createFinalBill(data);

      if (typeof result != "string") {
        throw new Error(result.message);
      }

      addToast(
        constant.toast.type.success,
        "Lập quyết toán hợp đồng thành công"
      );
      router.back();
    } catch (error: any) {
      addToast(
        constant.toast.type.error,
        error.message || "Có lỗi xảy ra trong quá trình lập quyết toán hợp đồng"
      );
    } finally {
      setLoading(false);
    }
  }, [services, moneyRefund, endDate, contract]);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <View className="flex-1 bg-white-50">
        <HeaderBack title="Quyết toán hợp đồng" />

        <ScrollView className="px-3">
          <View className="gap-3 py-3">
            <Box
              title="Ngày kết thúc hợp đồng"
              description="Là ngày khách thuê muốn rời đi"
            >
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
            <BoxDepositRefund
              {...{
                setTotalDeposit,
                totalDeposit,
                moneyRefund,
                setMoneyRefund,
              }}
            />
            <BoxRentalMonth {...{ setTotalRental, totalRental }} />
            <BoxServiceUsage {...{ setTotalService, totalService }} />
          </View>
        </ScrollView>

        <View className="p-3 flex bg-white-50 gap-2">
          <View className="items-end gap-1">
            <Text className="font-BeVietnamRegular">Tổng cộng</Text>
            <Text className="font-BeVietnamSemiBold text-16 text-lime-600">
              {convertToNumber(totalPrice.toString())} đ
            </Text>
          </View>
          <Button disabled={loading} loading={loading} onPress={() => handleCreateFinalBill()} className="bg-lime-400 py-3">
            <Text className="text-mineShaft-900 font-BeVietnamSemiBold">
              Lập quyết toán
            </Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default FinalBill;
