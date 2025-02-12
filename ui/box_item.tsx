import { Text, View } from "react-native";
import Button from "./button";
import Icon, { IIcon } from "./icon";
import { cn } from "@/helper/helper";

interface Props {
  title: string;
  description: string;
  icon: React.ElementType<IIcon>;
  className?: string;
}

const BoxItem = ({ title, description, icon, className }: Props) => {
  return (
    <Button
      className={cn(
        "bg-mineShaft-950 flex-1 flex-col items-start p-4 gap-4",
        className
      )}
    >
      <View className="border-1 border-white-50 rounded-full p-3">
        <Icon icon={icon} className="text-white-50" />
      </View>
      <View className="gap-1 w-full">
        <Text className="text-white-50 font-BeVietnamSemiBold text-right text-14">
          {title}
        </Text>
        <Text className="text-white-300 font-BeVietnamRegular text-12 text-justify">
          {description}
        </Text>
      </View>
    </Button>
  );
};

export default BoxItem;
