import { IPaymentHistory } from "@/interfaces/PaymentHistoryInterface";
import { Text, View } from "react-native";
import Icon from "../Icon";
import { Bank, Wallet } from "../icon/finance";
import { Skeleton } from "moti/skeleton";
import { convertToNumber, getTimezone } from "@/helper/helper";
import moment from "moment";
import { useMemo } from "react";
import { PaymentService } from "@/services/Payment/PaymentService";

const PaymentHistorySkeleton = () => {
  return (
    <View className="flex-row items-center gap-3">
      <Skeleton width={40} height={40} colorMode="light" radius={"round"} />

      <View className="flex-1 gap-1">
        <Skeleton width={"80%"} height={18} colorMode="light" />
        <Skeleton width={"50%"} height={16} colorMode="light" />
      </View>

      <Skeleton width={80} height={20} colorMode="light" />
    </View>
  );
};

const PaymentHistoryItem: React.FC<{
  history: IPaymentHistory;
}> = ({ history }) => {
  const paymentMethod = useMemo(() => {
    return PaymentService.getReferencePaymentMethod(history.payment_method)
  }, [history])
  return (
    <View className="flex-row items-center gap-3">
      <View className="bg-lime-100 p-2 rounded-full">
        <Icon icon={paymentMethod.icon} className="text-lime-500" />
      </View>

      <View className="flex-1 gap-1">
        <Text
          numberOfLines={1}
          className="font-BeVietnamMedium truncate text-mineShaft-950"
        >
          {paymentMethod.name}
        </Text>
        <Text
          numberOfLines={1}
          className="font-BeVietnamRegular text-12 text-white-700 truncate"
        >
          {moment(new Date(history.paid_at ?? history.created_at))
            .tz(getTimezone())
            .format("DD/MM/YYYY HH:mm")}
        </Text>
      </View>

      <Text className="font-BeVietnamSemiBold text-16 text-mineShaft-950">
        {`${convertToNumber(history.amount.toString())} đ`}
      </Text>
    </View>
  );
};

const PaymentHistoryEmpty = () => {
  return (
    <View className="flex-1 justify-center items-center gap-2">
      <View className="bg-mineShaft-100 p-3 rounded-full">
        <Icon icon={Wallet} />
      </View>
      <View className="items-center">
        <Text className="font-BeVietnamMedium text-mineShaft-950">
          Chưa có giao dịch nào
        </Text>
        <Text className="font-BeVietnamRegular text-white-500 text-12">
          Các giao dịch sẽ hiển thị ở đây
        </Text>
      </View>
    </View>
  );
};

const BoxPaymentHistory: React.FC<{
  histories: IPaymentHistory[];
  loading?: boolean;
}> = ({ histories, loading }) => {
  return (
    <View className="bg-white-50 shadow-soft-xs p-5 rounded-2xl border-1 border-white-100 gap-4">
      <Text className="font-BeVietnamSemiBold text-mineShaft-950">
        Lịch sử thanh toán
      </Text>
      <View className="gap-3">
        {loading ? (
          [...Array(5)].map((_, index) => (
            <PaymentHistorySkeleton key={index} />
          ))
        ) : histories.length > 0 ? (
          histories.map((history) => (
            <PaymentHistoryItem history={history} key={history.id} />
          ))
        ) : (
          <PaymentHistoryEmpty />
        )}
      </View>
    </View>
  );
};

export default BoxPaymentHistory;
