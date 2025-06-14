import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";
import { cn, getTimezone } from "@/helper/helper";
import { useGeneral } from "@/hooks/useGeneral";
import { useUI } from "@/hooks/useUI";
import { IContract } from "@/interfaces/ContractInterface";
import { ILodging } from "@/interfaces/LodgingInterface";
import { IPaymentHistory } from "@/interfaces/PaymentHistoryInterface";
import { IRentPayment } from "@/interfaces/RentalPaymentInterface";
import { IRoom } from "@/interfaces/RoomInterface";
import { PaymentService } from "@/services/Payment/PaymentService";
import RentPaymentService from "@/services/RentalPayment/RentPaymentService";
import usePaymentStore from "@/store/payment/usePaymentStore";
import usePaymentUserStore from "@/store/payment/usePaymentUserStore";
import usePaymentHistoryStore from "@/store/paymentHistory/usePaymentHistoryStore";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import BoxPaymentHistory from "@/ui/components/BoxPaymentHistory";
import HeaderBack from "@/ui/components/HeaderBack";
import PaymentOverviewCard from "@/ui/components/PaymentOverviewCard";
import Icon from "@/ui/Icon";
import { Bank } from "@/ui/icon/finance";
import { CheckCircle, Home2 } from "@/ui/icon/symbol";
import LoadingScreen from "@/ui/layouts/LoadingScreen";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { Skeleton } from "moti/skeleton";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function RentalPaymentHistory() {
  const { id, redirect_from } = useLocalSearchParams();
  const { user } = useGeneral();
  const { addToast } = useToastStore();

  const [loading, setLoading] = useState(false);
  const { paymentHistories, list, addPaymentHistory } =
    usePaymentHistoryStore();
  const rentalService = new RentPaymentService();
  const [rental, setRental] = useState<IRentPayment | null>(null);
  const contract = useMemo(() => rental?.contract ?? null, [rental]);
  const room = useMemo(() => rental?.contract?.room ?? null, [rental]);
  const lodging = useMemo(
    () => rental?.contract?.room?.lodging ?? null,
    [rental]
  );

  const status = useMemo(() => {
    return rental
      ? PaymentService.getReferenceStatusPayment(rental.status)
      : reference.undefined;
  }, [rental]);

  const fetchRentalHistory = useCallback(async () => {
    try {
      const result = await rentalService.detail(id as string);

      if ("message" in result) {
        router.canGoBack() ? router.back() : router.replace("/");
        return;
      }

      setRental(result);
    } catch (err: any) {
      useToastStore
        .getState()
        .addToast(
          constant.toast.type.error,
          err.message || "Lỗi không xác định"
        );
    }
  }, [id]);

  const fetchData = useCallback(async () => {
    setLoading(true);

    await Promise.all([
      fetchRentalHistory(),
      list({
        object_id: id as string,
        object_type: "rent",
      }),
    ]);

    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, []);

  // Thanh toán
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
      if (!rental) return;
      const amountPaid = amount + Number(rental.amount_paid);
      const lastPayment = new Date().toISOString();

      const amountToBePaid = rental.payment_amount - rental.amount_paid;

      addPaymentHistory(
        rental.id,
        "rent",
        Math.min(amount, amountToBePaid),
        method
      );

      setRental({
        ...rental,
        amount_paid: amountPaid,
        last_payment_date: lastPayment,
        ...(amountPaid == rental.payment_amount && {
          status: constant.payment.status.paid,
        }),
      });
    },
    [rental]
  );

  const handleOpenPayment = useCallback(() => {
    if (!rental) return;
    const diffAmount = rental.payment_amount - rental.amount_paid;
    if (redirect_from == "lodging") {
      setAmountToBePaidStore(diffAmount);
      openPaymentModalStore(
        rental.id,
        rental.contract_id,
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
        rental.id,
        rental.contract_id,
        "rent",
        user.wallet.balance,
        showModal,
        handleWhenPaymentSuccess
      );
    }
  }, [
    rental,
    showModal,
    openPaymentModalUser,
    openPaymentModalStore,
    handleWhenPaymentSuccess,
    redirect_from,
    user,
  ]);

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Chi tiết hoá đơn" />

      {loading && <LoadingScreen />}
      <ScrollView className="flex-1 px-3">
        <Button className="flex-col items-stretch flex-1 py-3 gap-3">
          <View className="bg-white-50 shadow-soft-xs p-5 rounded-2xl border-1 border-white-100 gap-1">
            {redirect_from != constant.object.type.lodging && (
              <Text className="font-BeVietnamSemiBold text-mineShaft-950">
                {lodging?.type?.name ?? ""}{" "}
                {lodging?.name || reference.undefined.name}
              </Text>
            )}

            <Text className="font-BeVietnamMedium text-12 text-mineShaft-950">
              Phòng {room?.room_code || reference.undefined.name}
            </Text>
            <Text className="font-BeVietnamRegular text-12 text-white-700">
              Hợp đồng #{contract?.code}
            </Text>
          </View>

          {/* Header */}
          <View className="bg-white-50 shadow-soft-xs p-5 rounded-2xl border-1 border-white-100 gap-3">
            <View className="flex-row justify-between items-start">
              <View className="gap-1 flex-1">
                <Text className="font-BeVietnamMedium text-white-700">
                  Kỳ thanh toán
                </Text>
                <Text className="font-BeVietnamSemiBold text-16">
                  {rental
                    ? `${rental.room_rent_invoice?.month_billing}/${rental.room_rent_invoice?.year_billing}`
                    : reference.undefined.name}
                </Text>
              </View>

              <View className={cn("px-4 py-2 rounded-full", status.bg)}>
                <Text className={cn("font-BeVietnamMedium", status.text)}>
                  {status.name}
                </Text>
              </View>
            </View>
          </View>

          {/* Header */}
          {rental && (
            <PaymentOverviewCard
              dueDate={rental.due_date}
              amountPaid={rental.amount_paid}
              paymentAmount={rental.payment_amount}
            />
          )}

          <BoxPaymentHistory histories={paymentHistories} loading={loading} />
        </Button>
      </ScrollView>

      <View className="p-3">
        {rental?.status == constant.payment.status.paid ? (
          <View className=" shadow-soft-xs bg-lime-400 p-4 rounded-2xl flex-row items-center justify-between">
            <Text className="font-BeVietnamSemiBold text-lime-50">
              Đã thanh toán đủ
            </Text>
            <Icon icon={CheckCircle} className="text-lime-50" />
          </View>
        ) : (
          <Button
            onPress={() => handleOpenPayment()}
            className="shadow-soft-xs bg-lime-400 p-4 rounded-2xl flex-row"
          >
            <Text className="font-BeVietnamSemiBold text-lime-50">
              Thanh toán
            </Text>
          </Button>
        )}
      </View>
    </View>
  );
}

export default RentalPaymentHistory;
