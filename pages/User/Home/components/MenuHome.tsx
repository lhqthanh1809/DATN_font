import Button from "@/ui/Button";
import Icon, { IIcon } from "@/ui/Icon";
import { Building } from "@/ui/icon/general";
import { Fingerprint } from "@/ui/icon/security";
import { Text, View } from "react-native";
import { MotiView } from "moti";
import React, { useState } from "react";
import Animated, { Easing } from "react-native-reanimated";
import { cn } from "@/helper/helper";

export interface ItemMenu {
  text: string;
  icon: React.ElementType<IIcon>;
  screen: React.ReactNode;
}

interface MenuProps {
  items: Array<ItemMenu>;
  onChange?: (item: ItemMenu) => void;
  active: ItemMenu | null;
}

const MenuHome = ({ items, onChange, active }: MenuProps) => {
  const [width, setWidth] = useState(0);
  return (
    <View className="relative bg-white-100 rounded-full p-1 items-center">
    <View
      className="flex-row relative"
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setWidth(width);
      }}
    >
      <MotiView
        className="bg-mineShaft-950 h-full rounded-full absolute"
        style={{
          width: width / items.length,
        }}
        animate={{
          translateX:
            (width / items.length) *
            items.findIndex((item) => item === active),
        }}
        transition={{
          type: "timing",
          duration: 200
        }}
      />
      {items.map((item, index) => (
        <Button
          key={index}
          className="px-3 py-2 rounded-full"
          onPress={() => onChange && onChange(item)}
        >
          <Text
            className={cn(
              "font-BeVietnamMedium",
              active === item ? "text-white-50" : "text-mineShaft-950"
            )}
            style={{
              fontSize: 10,
            }}
          >
            {item.text}
          </Text>
        </Button>
      ))}
    </View>
  </View>
  );
};

export default MenuHome;
