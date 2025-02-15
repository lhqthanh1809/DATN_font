import Button from "@/ui/button";
import Icon, { IIcon } from "@/ui/icon";
import { Building } from "@/ui/icon/general";
import { Fingerprint } from "@/ui/icon/security";
import { View } from "react-native";
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
  return (
    <View className="flex-row gap-2 p-3">
      {items.map((item, index) => (
        <MotiView
          from={{
            flexGrow: index == 0 ? 1 : 0,
          }}
          animate={{
            flexGrow: active == item ? 1 : 0,
          }}
          transition={{
            duration: 200,
            easing: Easing.linear,
            type: "timing",
          }}
          key={index}
        >
          <Button
            className={cn(
              "border border-mineShaft-950 py-3 px-6 gap-3",
              active == item || (!active && index == 0)
                ? "bg-mineShaft-950"
                : "bg-white-50"
            )}
            onPress={() => {
              onChange && onChange(item);
            }}
          >
            <Icon
              icon={item.icon}
              className={cn(
                active == item || (!active && index == 0)
                  ? "text-white-50"
                  : "text-mineShaft-950"
              )}
            />
            <Animated.Text
              className={cn(
                "font-BeVietnamMedium ",
                active == item || (!active && index == 0)
                  ? "text-white-50"
                  : "text-mineShaft-950"
              )}
            >
              {item.text}
            </Animated.Text>
          </Button>
        </MotiView>
      ))}
    </View>
  );
};

export default MenuHome;
