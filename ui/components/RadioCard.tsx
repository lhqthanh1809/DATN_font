import { Text, View } from "react-native";
import Button from "../Button";
import { cn } from "@/helper/helper";
import React from "react";

const  RadioCard:React.FC<{
    title: string;
    description?: string;
    hasActive?: boolean;
    onPress: () => void;
}> = ({onPress,title,description,hasActive}) => {
  return (
    <Button
      onPress={onPress}
      className="rounded-lg border-1 border-mineShaft-100 p-4 justify-between items-start"
    >
      <View className="gap-1 flex-1">
        <Text className="font-BeVietnamMedium pl-2">
          {title}
        </Text>
        {description && (
          <Text className="font-BeVietnamRegular text-12 text-white-700">
            {description}
          </Text>
        )}
      </View>

      <View className="h-5 w-5 rounded-full border-1 border-mineShaft-950 p-1">
        <View
          className={cn("w-full h-full rounded-full", hasActive && "bg-lime-400")}
        />
      </View>
    </Button>
  );
}

export default RadioCard;
