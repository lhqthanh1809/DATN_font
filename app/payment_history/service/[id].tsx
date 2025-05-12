import { constant } from "@/assets/constant";
import { reference } from "@/assets/reference";
import { cn, getTimezone } from "@/helper/helper";
import { useGeneral } from "@/hooks/useGeneral";
import { useUI } from "@/hooks/useUI";
import { IServicePayment } from "@/interfaces/ServicePaymentInterface";
import { PaymentService } from "@/services/Payment/PaymentService";
import ServiceManagerService from "@/services/Service/ServiceManagerService";
import ServicePaymentService from "@/services/ServicePayment/ServicePaymentService";
import usePaymentStore from "@/store/payment/usePaymentStore";
import usePaymentUserStore from "@/store/payment/usePaymentUserStore";
import usePaymentHistoryStore from "@/store/paymentHistory/usePaymentHistoryStore";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import BoxPaymentHistory from "@/ui/components/BoxPaymentHistory";
import HeaderBack from "@/ui/components/HeaderBack";
import PaymentOverviewCard from "@/ui/components/PaymentOverviewCard";
import Icon from "@/ui/Icon";
import { CheckCircle } from "@/ui/icon/symbol";
import LoadingScreen from "@/ui/layouts/LoadingScreen";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

function ServicePaymentHistory() {
  const { id, redirect_from } = useLocalSearchParams();
  const { user } = useGeneral();
  const { addToast } = useToastStore();
  const servicePaymentService = new ServicePaymentService();
  const serviceManagerService = new ServiceManagerService();

  const [loading, setLoading] = useState(false);
  const { paymentHistories, list, addPaymentHistory } =
    usePaymentHistoryStore();
  const [servicePayment, setServicePayment] = useState<IServicePayment | null>(
    null
  );
  const contract = useMemo(
    () => servicePayment?.contract ?? null,
    [servicePayment]
  );
  const room = useMemo(
    () => servicePayment?.contract?.room ?? null,
    [servicePayment]
  );
  const lodging = useMemo(
    () => servicePayment?.contract?.room?.lodging ?? null,
    [servicePayment]
  );
  const { status, statusReference, service } = useMemo(() => {
    if (!servicePayment)
      return {
        status: 0,
        statusReference: reference.undefined,
        service: reference.other,
      };

    const diffAmount =
      servicePayment.payment_amount - servicePayment.amount_paid;
    const status =
      servicePayment.amount_paid == 0
        ? constant.payment.status.unpaid
        : diffAmount <= 0
        ? constant.payment.status.paid
        : constant.payment.status.partial;

    const statusReference = PaymentService.getReferenceStatusPayment(status);
    const service = servicePayment.room_service_usage?.service
      ? serviceManagerService.getReferenceService(
          servicePayment.room_service_usage?.service
        )
      : reference.other;

    return { status, statusReference, service };
  }, [servicePayment]);

  const fetchServicePayment = useCallback(async () => {
    try {
      const result = await servicePaymentService.detail(id as string);

      if ("message" in result) {
        router.canGoBack() ? router.back() : router.replace("/");
        return;
      }

      setServicePayment(result);
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
      fetchServicePayment(),
      list({
        object_id: id as string,
        object_type: "service",
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
      if (!servicePayment) return;
      const amountPaid = amount + Number(servicePayment.amount_paid);
      const lastPayment = new Date().toISOString();

      const amountToBePaid =
        servicePayment.payment_amount - servicePayment.amount_paid;

      addPaymentHistory(
        servicePayment.id,
        "rent",
        Math.min(amount, amountToBePaid),
        method
      );

      setServicePayment({
        ...servicePayment,
        amount_paid: amountPaid,
        last_payment_date: lastPayment,
      });
    },
    [servicePayment]
  );

  const handleOpenPayment = useCallback(() => {
    if (!servicePayment) return;
    const diffAmount =
      servicePayment.payment_amount - servicePayment.amount_paid;
    if (redirect_from == "lodging") {
      setAmountToBePaidStore(diffAmount);
      openPaymentModalStore(
        servicePayment.id,
        servicePayment.contract_id,
        "service",
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
        servicePayment.id,
        servicePayment.contract_id,
        "service",
        user.wallet.balance,
        showModal,
        handleWhenPaymentSuccess
      );
    }
  }, [
    servicePayment,
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

          <View className="bg-white-50 shadow-soft-xs p-5 rounded-2xl border-1 border-white-100 gap-3">
            <View className="flex-row justify-between items-start">
              <View className="gap-2 flex-1 flex-row">
                <View className="bg-lime-100 p-2 rounded-full">
                  <Icon icon={service.icon} className="text-lime-500" />
                </View>

                <View className="gap-1">
                  <Text className="font-BeVietnamSemiBold text-16">
                    {servicePayment?.room_service_usage?.service
                      ? service.name
                      : servicePayment?.room_service_usage?.service_name}
                  </Text>
                  <Text className="font-BeVietnamRegular text-12">
                    {servicePayment?.room_service_usage
                      ? `Tháng ${
                          servicePayment.room_service_usage.month_billing <=
                            9 && "0"
                        }${servicePayment.room_service_usage.month_billing}/${
                          servicePayment.room_service_usage.year_billing
                        }`
                      : reference.undefined.name}
                  </Text>
                </View>
              </View>

              <View
                className={cn("px-4 py-2 rounded-full", statusReference.bg)}
              >
                <Text
                  className={cn("font-BeVietnamMedium", statusReference.text)}
                >
                  {statusReference.name}
                </Text>
              </View>
            </View>
          </View>

          {/* Header */}
          {servicePayment && (
            <PaymentOverviewCard
              dueDate={servicePayment.due_date}
              amountPaid={servicePayment.amount_paid}
              paymentAmount={servicePayment.payment_amount}
            />
          )}

          <BoxPaymentHistory histories={paymentHistories} loading={loading} />
        </Button>
      </ScrollView>

      <View className="p-3">
        {status == constant.payment.status.paid ? (
          <View className=" shadow-soft-xs bg-lime-400 p-4 rounded-2xl flex-row items-center justify-between">
            <Text className="font-BeVietnamSemiBold text-lime-50">
              Đã thanh toán đủ
            </Text>
            <Icon icon={CheckCircle} className="text-lime-50" />
          </View>
        ) : (
          <Button
            onPress={handleOpenPayment}
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

export default ServicePaymentHistory;
