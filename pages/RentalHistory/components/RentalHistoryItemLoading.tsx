import { View } from "react-native";
import { Skeleton } from "moti/skeleton";
import Button from "@/ui/Button";

const RentalHistoryItemLoading: React.FC = () => {
  return (
    <Button className="w-full bg-white-100 rounded-xl p-4 flex-col items-start gap-2">
      <View className="flex-row gap-4 w-full items-center">
        <View className="w-1/4">
          <Skeleton colorMode="light" width={"100%"} height={120} />
        </View>
        <View className="gap-3 flex-1">
          <View className="gap-2">
            <Skeleton colorMode="light" width={"80%"} height={20} />
            <Skeleton colorMode="light" width={"74%"} height={20} />
          </View>

          <Skeleton colorMode="light" width={"44%"} height={20} />

          <View className="w-full flex-row gap-2">
            <View className=" flex-1">
              <Skeleton colorMode="light" width={"100%"} height={32} />
            </View>
            <View className=" flex-1">
              <Skeleton colorMode="light" width={"100%"} height={32} />
            </View>
          </View>
        </View>
      </View>

      {/* Số tiền */}
      <View className="flex-row items-center justify-between w-full px-2">
        <View className="items-center w-1/4">
          <Skeleton colorMode="light" width={"100%"} height={34} />
        </View>

        <View className="items-center w-1/4">
          <Skeleton colorMode="light" width={"100%"} height={34} />
        </View>
        <View className="items-center w-1/4">
          <Skeleton colorMode="light" width={"100%"} height={34} />
        </View>
      </View>
    </Button>
  );
};

export default RentalHistoryItemLoading;