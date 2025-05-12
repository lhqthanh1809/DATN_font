import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";
import { cn, convertToNumber } from "@/helper/helper";
import { useUI } from "@/hooks/useUI";
import { IRentPayment } from "@/interfaces/RentalPaymentInterface";
import { IRoomRentalHistory } from "@/interfaces/RoomRentalHistoryInterface";
import { PaymentService } from "@/services/Payment/PaymentService";
import useInvoiceStore from "@/store/invoice/useInvoiceStore";
import usePaymentStore from "@/store/payment/usePaymentStore";
import Button from "@/ui/Button";
import HeaderBack from "@/ui/components/HeaderBack";
import PaymentOverviewCard from "@/ui/components/PaymentOverviewCard";
import Icon from "@/ui/Icon";
import { CheckCircle, Error, Warning } from "@/ui/icon/symbol";
import LoadingScreen from "@/ui/layouts/LoadingScreen";
import LoadingAnimation from "@/ui/LoadingAnimation";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function Detail() {
  const { lodgingId, id } = useLocalSearchParams();
  const { invoice, detail } = useInvoiceStore();
  const [loading, setLoading] = useState(false);

  const fetchInvoice = useCallback(async () => {
    setLoading(true);

    const result = await detail(lodgingId as string, "rent", id as string);

    if (!result) router.back();

    setLoading(false);
  }, [lodgingId, id]);

  useEffect(() => {
    fetchInvoice();
  }, []);

  return (
    <View className="flex-1 bg-white-50">
      <HeaderBack title="Chi tiết hoá đơn tiền phòng" />

      {loading && <LoadingScreen />}
      <View className="px-3 pt-3">
        <View className="bg-white-50 shadow-soft-xs p-3 items-center rounded-2xl border-1 border-white-100 gap-1">
          <Text className="font-BeVietnamMedium text-mineShaft-950">
            Phòng {invoice?.room?.room_code || reference.undefined.name}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-3">
        <Button className="flex-1 flex-col items-stretch py-3 gap-3">
          <View className="bg-white-50 shadow-soft-xs p-5 rounded-2xl border-1 border-white-100 gap-3">
            <View className="flex-row justify-between items-start">
              <View className="gap-1 flex-1">
                <Text className="font-BeVietnamMedium text-white-700">
                  Kỳ thanh toán
                </Text>
                <Text className="font-BeVietnamSemiBold text-16">
                  Tháng {String(invoice?.month_billing).padStart(2, "0")}/
                  {invoice?.year_billing}
                </Text>
              </View>

              {/* <View className={cn("px-4 py-2 rounded-full", status.bg)}>
                <Text className={cn("font-BeVietnamMedium", status.text)}>
                  {status.name}
                </Text>
              </View> */}
            </View>
          </View>

          <PaymentOverviewCard
            amountPaid={invoice?.amount_paid ?? 0}
            paymentAmount={invoice?.total_price ?? 0}
          />

          <View className="bg-white-50 shadow-soft-xs p-5 rounded-2xl border-1 border-white-100 gap-3">
            <Text className="font-BeVietnamMedium">Hợp đồng</Text>

            <View className="gap-2">
              {(invoice as IRoomRentalHistory)?.rental_histories &&
                (invoice as IRoomRentalHistory).rental_histories?.map(
                  (item) => <RentalItem item={item} key={item.id} />
                )}
            </View>
          </View>
        </Button>
      </ScrollView>

      {(invoice?.amount_paid ?? 0) >= (invoice?.total_price ?? 0) && (
        <View className="p-3">
          <View className=" shadow-soft-xs bg-lime-400 p-4 rounded-2xl flex-row items-center justify-between">
            <Text className="font-BeVietnamSemiBold text-lime-50">
              Đã thanh toán đủ
            </Text>
            <Icon icon={CheckCircle} className="text-lime-50" />
          </View>
        </View>
      )}
    </View>
  );
}

const RentalItem: React.FC<{
  item: IRentPayment;
}> = ({ item }) => {
  const [itemLocal, setItemLocal] = useState(item);
  const { invoice, detail, setInvoice } = useInvoiceStore();

  const { status, statusReference, iconStatus } = useMemo(() => {
    const status =
      itemLocal.amount_paid == 0
        ? constant.payment.status.unpaid
        : itemLocal.amount_paid < itemLocal.payment_amount
        ? constant.payment.status.partial
        : constant.payment.status.paid;

    const statusReference = PaymentService.getReferenceStatusPayment(status);
    const iconStatus = (() => {
      switch (status) {
        case constant.payment.status.paid:
          return CheckCircle;
        case constant.payment.status.unpaid:
          return Error;
        default:
          return Warning;
      }
    })();
    return {
      status,
      statusReference,
      iconStatus,
    };
  }, [itemLocal]);

  // Thanh toán

  const { showModal } = useUI();
  const { openPaymentModal, setAmountToBePaid } = usePaymentStore();

  const handleWhenPaymentSuccess = useCallback(
    (amount: number, method: string) => {
      if (!itemLocal) return;
      const amountPaid = amount + Number(itemLocal.amount_paid);
      const lastPayment = new Date().toISOString();

      if (invoice) {
        const amountPaidOfInvoice =
          parseFloat(invoice.amount_paid.toString()) + amount;
        setInvoice({
          ...invoice,
          amount_paid: amountPaidOfInvoice,
        });
      }

      setItemLocal({
        ...itemLocal,
        amount_paid: amountPaid,
        last_payment_date: lastPayment,
        ...(amountPaid == itemLocal.payment_amount && {
          status: constant.payment.status.paid,
        }),
      });
    },
    [itemLocal]
  );

  const handleOpenPayment = useCallback(() => {
    if (!itemLocal) return;
    const diffAmount = itemLocal.payment_amount - itemLocal.amount_paid;
    setAmountToBePaid(diffAmount);
    openPaymentModal(
      itemLocal.id,
      itemLocal.contract_id,
      "rent",
      showModal,
      handleWhenPaymentSuccess,
      "debt"
    );
  }, [itemLocal]);


  return (
    <Button
      className="border-1 border-white-100 p-3 flex-col gap-3"
      onPress={() =>
        router.push(
          `/payment_history/rental/${itemLocal.id}?redirect_from=lodging`
        )
      }
    >
      <View className="flex-row w-full items-start justify-between">
        <View className="gap-1">
          <Text className="font-BeVietnamRegular text-12 text-mineShaft-700">
            #{itemLocal.contract?.code}
          </Text>
          <Text className="font-BeVietnamMedium">
            {itemLocal.contract?.full_name || reference.undefined.name}
          </Text>
        </View>

        <View className={cn("py-2 px-3 rounded-full", statusReference.bg)}>
          <Text className={cn("font-BeVietnamMedium", statusReference.text)}>
            {statusReference.name}
          </Text>
        </View>
      </View>

      <View className="w-full flex-row items-center gap-2">
        <Icon icon={iconStatus} className={statusReference.text} />

        <Text className="font-BeVietnamMedium">
          {`${convertToNumber(itemLocal.amount_paid.toString())} đ `}
          {status != constant.payment.status.paid && (
            <Text className="font-BeVietnamRegular text-white-500">
              / {convertToNumber(itemLocal.payment_amount.toString())} đ
            </Text>
          )}
        </Text>
      </View>

      {status != constant.payment.status.paid && (
        <Button onPress={handleOpenPayment} className="bg-lime-400 p-2 w-full">
          <Text className="font-BeVietnamMedium">Thanh toán </Text>
        </Button>
      )}
    </Button>
  );
};

export default Detail;
