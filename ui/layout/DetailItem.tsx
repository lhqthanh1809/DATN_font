import { Text, View } from "react-native";
import Button from "../Button";
import { cn } from "@/helper/helper";
import { ReactNode } from "react";

const DetailItem: React.FC<{
  title: string;
  data: any;
  suffix?: ReactNode
}> = ({ title, data, suffix }) => {
  return (
    <Button className="flex px-4 py-3 border-1 border-mineShaft-100 rounded-2xl bg-white-50 shadow-sm shadow-mineShaft-950/10 justify-between">
      <View className="gap-2 flex-1">
        <Text className="font-BeVietnamRegular text-12 text-white-400">
          {title}
        </Text>
        <View className={cn("flex-row items-center relative w-full")}>
          <Text
            className={cn(
              `flex-1 text-16 font-BeVietnamMedium text-mineShaft-950`
            )}
          >
            {data}
          </Text>
        </View>
      </View>
      {suffix}
    </Button>
  );
};

export default DetailItem;
