import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import moment from "moment";
import axios from "axios";
import { isArray } from "lodash";
import { Skeleton } from "moti/skeleton";

import { IServicePayment } from "@/interfaces/ServicePaymentInterface";
import ServicePaymentService from "@/services/ServicePayment/ServicePaymentService";
import { reference } from "@/assets/reference";
import { cn, convertToDate, convertToNumber, env } from "@/helper/helper";
import useToastStore from "@/store/toast/useToastStore";
import Button from "@/ui/Button";
import Divide from "@/ui/Divide";
import Icon from "@/ui/Icon";
import { CheckCircle, TimeSmall } from "@/ui/icon/symbol";
import UnitService from "@/services/Unit/UnitService";
import ServiceManagerService from "@/services/Service/ServiceManagerService";
import usePaymentStore from "@/store/payment/usePaymentStore";
import { useUI } from "@/hooks/useUI";
import { useGeneral } from "@/hooks/useGeneral";
import usePaymentUserStore from "@/store/payment/usePaymentUserStore";
import { constant } from "@/assets/constant";
import { Href, router } from "expo-router";

type Props = { lodgingId?: string; contractId: string };

const unitService = new UnitService();
const serviceManagerService = new ServiceManagerService();

/**
 * Component representing a single service payment item.
 *
 * @param {Object} props - The component props.
 * @param {IServicePayment} props.payment - The payment data for the service.
 *
 * @returns {JSX.Element} A button element displaying service payment details and actions.
 *
 * @description
 * This component displays detailed information about a service payment, including:
 * - Service name and icon.
 * - Billing period (month and year).
 * - Pricing details (unit price, old and new indices, total amount, paid amount, and remaining amount).
 * - Payment deadlines or last payment date.
 * - Action buttons for viewing details or making a payment.
 *
 * @remarks
 * - The `useMemo` hook is used to optimize calculations for service details and payment-related values.
 * - Conditional rendering is applied to show the "Thanh toán" (Pay) button only if there is an outstanding amount.
 *
 * @example
 * ```tsx
 * <ServicePaymentItem payment={paymentData} />
 * ```
 */
const ServicePaymentItem = ({
  payment,
  contractId,
  lodgingId,
}: {
  payment: IServicePayment;
  contractId: string;
  lodgingId?: string;
}) => {
  const { user } = useGeneral();
  const { addToast } = useToastStore();
  const { room_service_usage: usage } = payment;
  const [paymentLocal, setPaymentLocal] = useState(payment);
  const {
    openPaymentModal: openPaymentModalStore,
    setAmountToBePaid: setAmountToBePaidStore,
  } = usePaymentStore();
  const {
    openPaymentModal: openPaymentModalUser,
    setAmountToBePaid: setAmountToBePaidUser,
  } = usePaymentUserStore();
  const { showModal } = useUI();
  const service = useMemo(
    () =>
      usage?.service
        ? serviceManagerService.getReferenceService(usage.service)
        : reference.other,
    [usage?.service]
  );

  const { unit, unitLowerName, isFixed, price, diffAmount, displayValue } =
    useMemo(() => {
      const unit = usage?.unit
        ? reference.unit[usage.unit.name as keyof typeof reference.unit]
        : reference.undefined;
      const unitLowerName =
        "lowerName" in unit ? unit.lowerName : unit.name.toLowerCase();

      const isFixed = usage?.unit?.is_fixed;
      const price = (usage?.total_price ?? 0) / (usage?.value ?? 1);
      const diffAmount = paymentLocal.payment_amount - paymentLocal.amount_paid;

      const displayValue = isFixed
        ? `${convertToNumber(price.toString())} đ/${unitLowerName}`
        : `${convertToNumber(
            (usage?.initial_index ?? 0).toString()
          )} ${unitLowerName} - ${convertToNumber(
            (usage?.final_index ?? 0).toString()
          )} ${unitLowerName}`;

      return { unit, unitLowerName, isFixed, price, diffAmount, displayValue };
    }, [usage, paymentLocal.payment_amount, paymentLocal.amount_paid]);

  const handleWhenPaymentSuccess = useCallback(
    (amount: number, method: string) => {
      const amountPaid = amount + Number(paymentLocal.amount_paid);
      const lastPayment = new Date().toISOString();

      setPaymentLocal({
        ...paymentLocal,
        amount_paid: amountPaid,
        last_payment_date: lastPayment,
      });
    },
    [paymentLocal]
  );

  const handleOpenPayment = useCallback(() => {
    if (lodgingId) {
      setAmountToBePaidStore(diffAmount);
      openPaymentModalStore(
        payment.id,
        payment.contract_id,
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
        payment.id,
        payment.contract_id,
        "service",
        user.wallet.balance,
        showModal,
        handleWhenPaymentSuccess
      );
    }
  }, [
    payment,
    showModal,
    openPaymentModalUser,
    openPaymentModalStore,
    diffAmount,
    handleWhenPaymentSuccess,
    lodgingId,
    user,
  ]);

  return (
    <Button className="w-full bg-white-50 rounded-xl p-4 border border-white-100 shadow-soft-md flex-col items-start gap-2"           onPress={() =>
            router.push(
              `/payment_history/service/${payment.id}?redirect_from=${
                lodgingId ? "lodging" : "user"
              }` as Href
            )
          }>
      {/* Header */}
      <View className="flex-row justify-between items-start w-full gap-4">
        <View className="gap-2 flex-1">
          <View className="flex-row items-center gap-2">
            <Icon icon={service.icon} className={service.text} />
            <Text className="font-BeVietnamMedium">
              {usage?.service ? service.name : usage?.service_name}
            </Text>
          </View>
          <Text className="font-BeVietnamRegular text-12 text-mineShaft-700">
            {`${isFixed ? "Đơn giá" : "Chỉ số cũ - mới"}: `}
            <Text className="font-BeVietnamSemiBold">{displayValue}</Text>
          </Text>
        </View>
        <Text className="font-BeVietnamRegular text-12 text-mineShaft-500">
          Tháng {usage?.month_billing}/{usage?.year_billing}
        </Text>
      </View>

      <Divide className="h-0.25" />

      {/* Payment Details */}
      <View className="w-full gap-2">
        <Text className="font-BeVietnamRegular text-12 text-mineShaft-700">
          Tổng tiền:{" "}
          <Text className="font-BeVietnamMedium text-14">
            {convertToNumber(paymentLocal.payment_amount.toString())} đ
          </Text>
        </Text>
        <Text className="font-BeVietnamRegular text-12 text-mineShaft-700">
          Đã trả:{" "}
          <Text className="font-BeVietnamMedium text-lime-600 text-14">
            {convertToNumber(paymentLocal.amount_paid.toString())} đ
          </Text>
        </Text>
        <Text className="font-BeVietnamRegular text-12 text-mineShaft-700">
          Còn thiếu:{" "}
          <Text className="font-BeVietnamMedium text-redPower-600 text-14">
            {convertToNumber(diffAmount.toString())} đ
          </Text>
        </Text>
        <View className="flex-row items-center gap-1">
          <Icon icon={TimeSmall} className="text-mineShaft-500" />
          <Text className="font-BeVietnamRegular text-12 text-mineShaft-500">
            {diffAmount <= 0
              ? `Thanh toán lần cuối: ${convertToDate(
                  paymentLocal.last_payment_date
                )}`
              : `Hạn thanh toán: ${convertToDate(paymentLocal.due_date)}`}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="w-full flex-row gap-2">
        {diffAmount > 0 && (
          <Button
            className="flex-1 bg-lime-300 px-4 py-2"
            onPress={() => {
              handleOpenPayment();
            }}
          >
            <Text className="font-BeVietnamMedium text-mineShaft-950">
              Thanh toán
            </Text>
          </Button>
        )}
      </View>
    </Button>
  );
};

const LoadingSkeleton = () => (
  <Button className="w-full bg-white-100 rounded-xl p-4 flex-col items-start gap-2">
    <View className="flex-row justify-between items-start w-full gap-4">
      <View className="gap-2 flex-1">
        <View className="flex-row items-center gap-2">
          <Skeleton height={30} width={30} colorMode="light" />
          <Skeleton height={26} width="70%" colorMode="light" />
        </View>
        <Skeleton height={22} width="70%" colorMode="light" />
      </View>
      <Skeleton height={22} width={100} colorMode="light" />
    </View>
    <Divide className="h-0.25" />
    <View className="w-full gap-2">
      {[70, 60, 66, 30].map((width, idx) => (
        <Skeleton key={idx} height={22} width={`${width}%`} colorMode="light" />
      ))}
    </View>
    <View className="w-full flex-row gap-2">
      <Skeleton height={32} width="50%" colorMode="light" />
      <Skeleton height={32} width="50%" colorMode="light" />
    </View>
  </Button>
);

const ListServicePayment: React.FC<Props> = ({ lodgingId, contractId }) => {
  const [servicePayments, setServicePayments] = useState<IServicePayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServicePayment = useCallback(
    async (cancelToken: any) => {
      setIsLoading(true);
      const res = await new ServicePaymentService().list(
        {
          contract_id: contractId,
          ...(lodgingId && { lodging_id: lodgingId }),
        },
        cancelToken
      );
      if (isArray(res)) setServicePayments(res);
      if (!cancelToken.reason) setIsLoading(false);
    },
    [lodgingId, contractId]
  );

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchServicePayment(source.token);
    return () => source.cancel("Component unmounted");
  }, [fetchServicePayment]);

  return (
    <View className="flex-1 pt-3">
      <ScrollView className="px-3 flex-1">
        <View className="gap-4 pb-3">
          {isLoading
            ? [...Array(4)].map((_, i) => <LoadingSkeleton key={i} />)
            : servicePayments.map((payment) => (
                <ServicePaymentItem
                  lodgingId={lodgingId}
                  key={payment.id}
                  payment={payment}
                  contractId={contractId}
                />
              ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ListServicePayment;
