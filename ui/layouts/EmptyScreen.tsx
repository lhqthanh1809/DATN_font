import { Text, View } from "react-native";
import Icon, { IIcon } from "../Icon";
import React from "react";

const EmptyScreen: React.FC<{
  title: string;
  description: string;
  icon: React.ElementType<IIcon>;
  className?: string;
}> = ({ description, icon, title, className }) => {
  return (
    <View className={`flex-1 items-center justify-center ${className}`}>
      <View className="items-center gap-9">
        <View className="p-6 bg-white-50 rounded-full shadow-md shadow-black/10">
          <View className="p-9 rounded-full bg-mineShaft-50 border-4 border-mineShaft-100">
            <View className="p-9 bg-white-50 rounded-full shadow-md shadow-black/10">
              <View className="bg-mineShaft-950 p-4 rounded-full">
                <Icon icon={icon} strokeWidth={2} />
              </View>
            </View>
          </View>
        </View>
        <View className="items-center gap-2 px-8">
          <Text className="font-BeVietnamBold text-16 text-mineShaft-900">
            {title}
          </Text>
          <Text className="font-BeVietnamRegular text-14 text-center text-mineShaft-400">
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default EmptyScreen;
