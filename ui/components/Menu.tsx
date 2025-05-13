import { Text, View } from "react-native";
import Button from "../Button";
import Icon, { IIcon } from "../Icon";
import React, { useEffect } from "react";
import { AnimatePresence, MotiView } from "moti";
import Animated, {
  FadeInRight,
  FadeOutRight,
  LinearTransition,
} from "react-native-reanimated";
import { cn } from "@/helper/helper";

interface ItemProps {
  name: string;
  icon: React.ElementType<IIcon>;
  view: React.ReactNode;
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
                backgroundColor:
                  active.name === item.name ? "#FDFDFD" : "#0D0F10",
              }}
              layout={LinearTransition.springify().damping(80).stiffness(300)}
              className="overflow-hidden rounded-full"
            >
              <Button
                onPress={() => onChange(item)}
                className="gap-2 px-4 py-2"
              >
                <Icon
                  icon={item.icon}
                  className={cn(
                    active.name === item.name
                      ? "text-mineShaft-950"
                      : "text-white-50"
                  )}
                />
                {active.name === item.name && (
                  <Animated.Text
                    style={{ color: "#2A2A2A" }}
                    entering={FadeInRight.springify()
                      .damping(20)
                      .stiffness(200)}
                    // exiting={FadeOutRight.springify()
                    //   .damping(20)
                    //   .stiffness(200)}
                    className="font-BeVietnamMedium"
                  >
                    {item.name}
                  </Animated.Text>
                )}
              </Button>
            </MotiView>
          );
        })}
      </View>
    </View>
  );
};

export default Menu;
