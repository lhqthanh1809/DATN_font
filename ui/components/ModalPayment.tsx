import { constant } from "@/assets/constant";
import { useUI } from "@/hooks/useUI";
import { IError } from "@/interfaces/ErrorInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";
import usePaymentStore from "@/store/payment/usePaymentStore";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { Cross, CrossMedium } from "@/ui/icon/symbol";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import Input from "../Input";
import { Bank, Money, Wallet } from "../icon/finance";
import { cn, convertToNumber, formatNumber } from "@/helper/helper";
import { MotiView } from "moti";

const ModalPayment: React.FC<{
  actionWhenPaymentSuccess?: (amount: number, method: string) => void
}> = ({actionWhenPaymentSuccess}) => {
  const { hideModal } = useUI();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const { amount, setAmount, handlePayment, amountToBePaid, paymentMethods } =
    usePaymentStore();
  const [methodPayment, setMethodPayment] = useState(paymentMethods[0]);

  const handlePaymentProcess = useCallback(async () => {
    setLoading(true);
    try {
      const result = await handlePayment(
        methodPayment.value as "cash" | "bank"
      );
      if (result) {
        addToast(constant.toast.type.success, "Thanh toán thành công")
        actionWhenPaymentSuccess && actionWhenPaymentSuccess(formatNumber(amount, "float") ?? 0 , methodPayment.value)
        hideModal();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [handlePayment, methodPayment, amount]);

  return (
    <Button onPress={() => {
      !loading && hideModal()
    }} className="h-full w-full justify-end">
      <MotiView
        from={{ opacity: 0, translateY: 100 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 200 }}
        className="absolute bottom-0 w-full"
      >
        {/* Container */}
        <Button
          className="bg-white-50 flex-col px-4 py-6 rounded-b-none"
          onPress={() => {}}
        >
          {/* Header */}
          <View className="flex-row justify-between w-full items-center">
            <Text className="font-BeVietnamBold text-18 text-mineShaft-950">
              Thanh toán
            </Text>

            {/* Button Cross */}
            <Button
              disabled={loading}
              onPress={() => {
                hideModal();
              }}
              className=""
            >
              <Icon icon={CrossMedium} />
            </Button>
          </View>

          <View className="w-full gap-2">
            <Input
              value={amount}
              disabled={loading}
              className="w-full"
              type="number"
              onChange={(text) => {
                setAmount(text || "0");
              }}
              placeHolder="Nhập số tiền"
              label="Số tiền"
              suffix={<Text className="font-BeVietnamSemiBold">VND</Text>}
            />

            <Text className="font-BeVietnamRegular text-12 text-mineShaft-500 pl-3">
              Số tiền cần thanh toán:{" "}
              {convertToNumber(amountToBePaid.toString())} đ
            </Text>
          </View>

          <View className="w-full gap-2">
            <Text className="font-BeVietnamRegular text-14 text-mineShaft-950 ml-2">
              Phương thức thanh toán
            </Text>

            <View className="gap-2">
              {paymentMethods.map((item, index) => (
                <Button
                  key={index}
                  disabled={loading}
                  onPress={() => setMethodPayment(item)}
                  className="rounded-lg border-1 border-mineShaft-100 p-4 justify-between items-start"
                >
                  <View className="flex-row items-center gap-3">
                    <Icon icon={item.icon} />
                    <Text className="font-BeVietnamMedium">{item.label}</Text>
                  </View>

                  <View className="h-5 w-5 rounded-full border-1 border-mineShaft-950 p-1">
                    <View
                      className={cn(
                        "w-full h-full rounded-full",
                        methodPayment == item && "bg-lime-400"
                      )}
                    />
                  </View>
                </Button>
              ))}
            </View>
          </View>

          <View className="w-full gap-2">
            <Button
              disabled={loading}
              loading={loading}
              onPress={() => {
                handlePaymentProcess()
              }}
              className="bg-lime-400 py-3"
            >
              <Text className="text-mineShaft-950 font-BeVietnamMedium">
                Xác nhận thanh toán
              </Text>
            </Button>
          </View>
        </Button>
      </MotiView>
    </Button>
  );
};

export default ModalPayment;
