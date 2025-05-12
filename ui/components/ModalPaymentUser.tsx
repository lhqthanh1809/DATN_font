import { constant } from "@/assets/constant";
import { useUI } from "@/hooks/useUI";
import { IError } from "@/interfaces/ErrorInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import useLodgingsStore from "@/store/lodging/useLodgingsStore";
import usePaymentStore from "@/store/payment/usePaymentStore";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import Icon from "@/ui/Icon";
import { CrossMedium } from "@/ui/icon/symbol";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import Input from "../Input";
import { cn, convertToNumber, formatNumber } from "@/helper/helper";
import { MotiView } from "moti";
import usePaymentUserStore from "@/store/payment/usePaymentUserStore";
import { useGeneral } from "@/hooks/useGeneral";

const ModalPaymentUser: React.FC<{
  actionWhenPaymentSuccess?: (amount: number, method: string) => void
}> = ({actionWhenPaymentSuccess}) => {
  const {user, changeUser} = useGeneral()
  const { hideModal } = useUI();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const { amount, setAmount, handlePayment, amountToBePaid, balance } =
    usePaymentUserStore();

  const handlePaymentProcess = useCallback(async () => {
    setLoading(true);
    try {
      const result = await handlePayment();
      if (result) {
        if(user){

          changeUser({
            ...user,
            ...(user.wallet && {wallet: {
              ...user.wallet,
              balance: balance - (formatNumber(amount, "float") ?? 0)
            }})
          })
        }
        addToast(constant.toast.type.success, "Thanh toán thành công")
        actionWhenPaymentSuccess && actionWhenPaymentSuccess(formatNumber(amount, "float") ?? 0, constant.payment.method.transfer)
        hideModal();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [handlePayment, amount, balance]);

  return (
    <Button onPress={() => {
      !loading && hideModal()
    }} className="h-full w-full justify-center items-center p-3">
      <MotiView
        from={{ opacity: 0, translateY: 100 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 200 }}
        className="w-full"
      >
        {/* Container */}
        <Button
          className="bg-white-50 flex-col px-4 py-6"
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
            <Text className="font-BeVietnamMedium text-mineShaft-800">Số tiền cần thanh toán</Text>
            <Text className="font-BeVietnamBold text-3xl">{convertToNumber(amountToBePaid.toString())} đ</Text>
          </View>

          <View className="w-full gap-1 bg-white-100 p-4 rounded-xl">
            <Text className="font-BeVietnamMedium text-mineShaft-800">Số dư tài khoản</Text>
            <Text className="font-BeVietnamSemiBold text-2xl">{convertToNumber(balance.toString())} đ</Text>
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

            {/* <Text className="font-BeVietnamRegular text-12 text-mineShaft-500 pl-3">
              Số tiền cần thanh toán:{" "}
              {convertToNumber(amountToBePaid.toString())} đ
            </Text> */}
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
            <Button
              disabled={loading}
              onPress={() => {
                hideModal()
              }}
              className="bg-white-50 p-2"
            >
              <Text className="text-mineShaft-600 font-BeVietnamMedium">
                Huỷ bỏ
              </Text>
            </Button>
          </View>
        </Button>
      </MotiView>
    </Button>
  );
};

export default ModalPaymentUser;
