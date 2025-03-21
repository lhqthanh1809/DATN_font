import { Text, View } from "react-native";
import Button from "./Button";
import Icon, { IIcon } from "./Icon";
import { cn } from "@/helper/helper";

interface Props {
  title: string;
  description: string;
  icon: React.ElementType<IIcon>;
  className?: string;
  onPress?: () => void;
}

const BoxItem = ({ title, description, icon, className, onPress }: Props) => {
  return (
    <Button
      onPress={onPress}
      className={cn(
        "bg-lime-100 flex-1 flex-col items-start px-4 pt-4 pb-6 gap-4",
        className
      )}
    >
      <View className="rounded-lg p-4 bg-white-50">
        <Icon icon={icon} className="text-lime-500 " />
      </View>
      <View className="gap-1 w-full">
        <Text className="text-mineShaft-900 font-BeVietnamSemiBold text-12">
          {title}
        </Text>
        {/* <Text className="text-white-300 font-BeVietnamRegular text-12 text-justify">
          {description}
        </Text> */}
      </View>
    </Button>
  );
};

export default BoxItem;
