import { cn } from "@/helper/helper";
import Box from "@/ui/Box";
import Button from "@/ui/Button";
import { Text, View } from "react-native";

const BoxMethodCalculator: React.FC<{
  value: boolean;
  onPress: (value: boolean) => void;
}> = ({ value, onPress }) => {
  return (
    <Box title="Phương thức tính hoá đơn" description="Chọn phương thức tính tiền thuê và dịch vụ cuối hợp đồng.">
      {/* Radio tính tháng */}
      <Button
        onPress={() => onPress(true)}
        className="rounded-lg border-1 border-mineShaft-100 p-4 justify-between items-start"
      >
        <View className="gap-1 flex-1">
          <Text className="font-BeVietnamMedium pl-2">Tính tròn tháng</Text>
          <Text className="font-BeVietnamRegular text-12 text-white-700">
            Thanh toán trọn tháng, không chia nhỏ.
          </Text>
        </View>

        <View className="h-5 w-5 rounded-full border-1 border-mineShaft-950 p-1">
          <View
            className={cn("w-full h-full rounded-full", value && "bg-lime-400")}
          />
        </View>
      </Button>

      {/* Radio tính ngày */}
      <Button
        onPress={() => onPress(false)}
        className="rounded-lg border-1 border-mineShaft-100 p-4 justify-between items-start"
      >
        <View className="gap-1 flex-1">
          <Text className="font-BeVietnamMedium pl-2">
            Tính theo số ngày thực tế
          </Text>
          <Text className="font-BeVietnamRegular text-12 text-white-700">
            Thanh toán theo số ngày sử dụng trong tháng.
          </Text>
        </View>

        <View className="h-5 w-5 rounded-full border-1 border-mineShaft-950 p-1">
          <View
            className={cn(
              "w-full h-full rounded-full",
              !value && "bg-lime-400"
            )}
          />
        </View>
      </Button>
    </Box>
  );
};

export default BoxMethodCalculator;
