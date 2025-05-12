import { cn, convertToDate, convertToNumber, env } from "@/helper/helper";
import { IRentPayment } from "@/interfaces/RentalPaymentInterface";
import moment from "moment";
import { View, Text } from "react-native";
import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { CheckCircle, Error, Warning } from "@/ui/icon/symbol";
import { useUI } from "@/hooks/useUI";
import usePaymentStore from "@/store/payment/usePaymentStore";
import { useCallback, useState } from "react";
import usePaymentUserStore from "@/store/payment/usePaymentUserStore";
import { useGeneral } from "@/hooks/useGeneral";
import useToastStore from "@/store/toast/useToastStore";
import { constant } from "@/assets/constant";
import { Href, router } from "expo-router";

const RentPaymentItem: React.FC<{
  rental: IRentPayment;
  lodgingId?: string;
}> = ({ rental, lodgingId }) => {
  const paymentDate = moment.tz(
    rental.payment_date,
    "YYYY-MM-DD HH:mm:ss",
    env("TIMEZONE")
  );
  const { user } = useGeneral();
  const { addToast } = useToastStore();
  const [rentalLocal, setRentalLocal] = useState(rental);
  const diffAmount = rentalLocal.payment_amount - rentalLocal.amount_paid;
  const { showModal } = useUI();
  const {
    openPaymentModal: openPaymentModalStore,
    setAmountToBePaid: setAmountToBePaidStore,
  } = usePaymentStore();
  const {
    openPaymentModal: openPaymentModalUser,
    setAmountToBePaid: setAmountToBePaidUser,
  } = usePaymentUserStore();

  const handleWhenPaymentSuccess = useCallback(
    (amount: number, method: string) => {
      const amountPaid = amount + Number(rentalLocal.amount_paid);
      const lastPayment = new Date().toISOString();

      setRentalLocal({
        ...rentalLocal,
        amount_paid: amountPaid,
        last_payment_date: lastPayment,
      });
    },
    [rentalLocal]
  );

  const handleOpenPayment = useCallback(() => {
    if (lodgingId) {
      setAmountToBePaidStore(diffAmount);
      openPaymentModalStore(
        rentalLocal.id,
        rentalLocal.contract_id,
        "rent",
        showModal,
        handleWhenPaymentSuccess,
        "debt"
      );
    } else {
      if (!user?.wallet) {
        addToast(constant.toast.type.error, "Ví người dùng không khả dụng");
        return;
      }
      setAmountToBePaidUser(diffAmount);
      openPaymentModalUser(
        rentalLocal.id,
        rentalLocal.contract_id,
        "rent",
        user.wallet.balance,
        showModal,
        handleWhenPaymentSuccess
      );
    }
  }, [
    rentalLocal,
    showModal,
    openPaymentModalUser,
    openPaymentModalStore,
    diffAmount,
    handleWhenPaymentSuccess,
    lodgingId,
    user,
  ]);

  return (
    <Button className="w-full bg-white-50 rounded-xl p-4 border-1 shadow-soft-md flex-col items-start border-white-100 gap-2">
      <View className="flex-row gap-4 w-full items-center">
        <View className="border-1 items-stretch px-6 py-3 rounded-md border-white-200 gap-2">
          <View>
            <Text className="font-BeVietnamMedium text-mineShaft-600 text-center">
              Tháng
            </Text>
            <Text
              className={cn(
                "font-BeVietnamBold text-3xl  text-center",
                diffAmount <= 0
                  ? "text-lime-600"
                  : rentalLocal.amount_paid == 0
                  ? "text-redPower-600"
                  : "text-happyOrange-600"
              )}
            >
              {paymentDate.month() + 1}
            </Text>
          </View>
          <View className="">
            <Divide className="h-1 w-full bg-lime-800" />
          </View>
          <Text className="font-BeVietnamMedium text-center text-mineShaft-950">
            {paymentDate.year()}
          </Text>
        </View>
        <View className="gap-2 flex-1">
          <View className="gap-1">
            <Text className="font-BeVietnamMedium text-mineShaft-800">
              Ngày thanh toán: {convertToDate(rentalLocal.payment_date)}
            </Text>
            {diffAmount <= 0 ? (
              <Text className="font-BeVietnamMedium text-mineShaft-800">
                Thanh toán lần cuối:{" "}
                {convertToDate(rentalLocal.last_payment_date)}
              </Text>
            ) : (
              <Text className="font-BeVietnamMedium text-mineShaft-800">
                Hạn thanh toán: {convertToDate(rentalLocal.due_date)}
              </Text>
            )}
          </View>

          <View className="flex-row items-center gap-2">
            <Icon
              icon={
                diffAmount <= 0
                  ? CheckCircle
                  : rentalLocal.amount_paid == 0
                  ? Error
                  : Warning
              }
              className={cn(
                diffAmount <= 0
                  ? "text-lime-500"
                  : rentalLocal.amount_paid == 0
                  ? "text-redPower-600"
                  : "text-happyOrange-600"
              )}
            />
            <Text numberOfLines={1} className="font-BeVietnamRegular truncate">
              {diffAmount <= 0
                ? `Đã thanh toán`
                : rentalLocal.amount_paid == 0
                ? "Chưa thanh toán"
                : `Trả một phần, ${convertToDate(
                    rentalLocal.last_payment_date
                  )}`}
            </Text>
          </View>

          <View className="w-full flex-row gap-2">
            <Button
              className=" flex-1 border-1 border-lime-500 px-4 py-2"
              onPress={() =>
                router.push(
                  `/payment_history/rental/${rental.id}?redirect_from=${
                    lodgingId ? "lodging" : "user"
                  }` as Href
                )
              }
            >
              <Text className="font-BeVietnamMedium text-mineShaft-950">
                Xem chi tiết
              </Text>
            </Button>
            {diffAmount > 0 && (
              <Button
                onPress={handleOpenPayment}
                className="flex-1 bg-lime-300 px-4 py-2"
              >
                <Text className="font-BeVietnamMedium text-mineShaft-950">
                  Thanh toán
                </Text>
              </Button>
            )}
          </View>
        </View>
      </View>

      {/* Số tiền */}
      <View className="flex-row items-center justify-between w-full px-2">
        <View className="items-center">
          <Text className="font-BeVietnamRegular text-12 text-mineShaft-700">
            Tổng tiền
          </Text>
          <Text className="font-BeVietnamMedium">
            {convertToNumber(rentalLocal.payment_amount.toString())} đ
          </Text>
        </View>
        <View className="items-center">
          <Text className="font-BeVietnamRegular text-12 text-mineShaft-700">
            Đã trả
          </Text>
          <Text className="font-BeVietnamMedium text-lime-600">
            {convertToNumber(rentalLocal.amount_paid.toString())} đ
          </Text>
        </View>
        <View className="items-center">
          <Text className="font-BeVietnamRegular text-12 text-mineShaft-700">
            Còn thiếu
          </Text>
          <Text className="font-BeVietnamMedium text-redPower-600">
            {convertToNumber(diffAmount.toString())} đ
          </Text>
        </View>
      </View>
    </Button>
  );
};

export default RentPaymentItem;
