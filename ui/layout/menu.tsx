import { Text, View } from "react-native";
import Button from "../Button";
import Icon, { IIcon } from "../Icon";
import { Bell, Home, Home2, Notification } from "../icon/symbol";
import { Setting } from "../icon/active";
import React, { useEffect } from "react";
import { cn } from "@/helper/helper";
import { AnimatePresence, MotiText, MotiView } from "moti";
import Animated, {
  Easing,
  FadeInRight,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";

interface ItemProps {
  name: string;
  icon: React.ElementType<IIcon>;
  view: React.ReactNode
  [key: string]: any;
}

const Menu: React.FC<{
  items: ItemProps[];
  onChange: (item: ItemProps) => void;
  active: ItemProps;
}> = ({ items, onChange, active }) => {

  return (
    <View className="py-1 absolute bottom-2 left-0 w-full items-center">
      <View className="bg-mineShaft-950 rounded-full w-fit flex-row p-3">
        {items.map((item, index) => {
          return (
            <MotiView
              key={index}
              style={{
                backgroundColor: active.name === item.name ? "#FDFDFD" : "#0D0F10",
                borderRadius: 99999,
              }}
              layout={LinearTransition.springify().damping(80).stiffness(300)}
              className="overflow-hidden"
            >
              <Button
                onPress={() => onChange(item)}
                className="gap-2 px-4 py-2"
              >
                <Icon icon={item.icon} className="text-mineShaft-900" />
                <AnimatePresence>
                  {active.name === item.name && (
                    <Animated.Text
                      style={{ color: "#2A2A2A" }}
                      entering={FadeInRight.springify()
                        .damping(40)
                        .stiffness(300)}
                      exiting={FadeOutRight.springify()
                        .damping(40)
                        .stiffness(300)}
                      className="font-BeVietnamMedium"
                    >
                      {item.name}
                    </Animated.Text>
                  )}
                </AnimatePresence>
              </Button>
            </MotiView>
          );
        })}
      </View>
    </View>
  );
};

export default Menu;
