import HeaderBack from "@/ui/components/HeaderBack";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

function RentalPaymentHistory() {
  const { id, redirect_to } = useLocalSearchParams();
  console.log(redirect_to)

  return (
    <View className="flex-1">
      <HeaderBack title="Chi tiết hoá đơn" />
    </View>
  );
}

export default RentalPaymentHistory;

