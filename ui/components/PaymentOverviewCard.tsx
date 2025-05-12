import { convertToNumber, getTimezone } from "@/helper/helper";
import moment from "moment";
import { MotiView } from "moti";
import { useMemo } from "react";
import { Text, View } from "react-native";

const PaymentOverviewCard: React.FC<{
  paymentAmount: number;
  amountPaid: number;
  dueDate?: string;
}> = ({ amountPaid, dueDate, paymentAmount }) => {
  const perPayment = useMemo(() => {
    if (paymentAmount === 0) return 0;
    return (amountPaid / paymentAmount) * 100;
  }, [amountPaid, paymentAmount]);

  return (
    <View className="bg-white-50 shadow-soft-xs p-5 rounded-2xl border-1 border-white-100 items-center gap-4">
      <View className="gap-1 items-center">
        <Text className="font-BeVietnamRegular text-white-800">Tổng cộng</Text>
        <Text className="font-BeVietnamBold text-16 text-mineShaft-950">
          {`${convertToNumber(paymentAmount.toString())} đ`}
        </Text>

        {dueDate && (
          <Text className="font-BeVietnamRegular text-white-700 text-12">
            Hạn thanh toán:{" "}
            {moment(new Date(dueDate)).tz(getTimezone()).format("DD/MM/YYYY")}
          </Text>
        )}
      </View>

      {/* Line Process */}
      <View className="w-full h-2 bg-mineShaft-100 rounded-full">
        <MotiView
          from={{ width: "0%" }}
          animate={{ width: `${perPayment}%` }}
          transition={{ type: "timing", duration: 300 }}
          className="h-full absolute top-0 left-0 bg-lime-400 rounded-full"
        />
      </View>

      {/* Amount */}

      <View className="flex-row items-center justify-around w-full">
        <View className="items-center">
          <Text className="font-BeVietnamRegular text-white-800 text-12">
            Đã thanh toán
          </Text>
          <Text className="font-BeVietnamMedium text-lime-500">
            {`${convertToNumber(amountPaid.toString())} đ`}
          </Text>
        </View>
        <View className="items-center">
          <Text className="font-BeVietnamRegular text-white-800  text-12">
            Còn lại
          </Text>
          <Text className="font-BeVietnamMedium text-mineShaft-950">
            {`${convertToNumber((paymentAmount - amountPaid).toString())} đ`}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PaymentOverviewCard;
