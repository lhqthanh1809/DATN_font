import { cn } from "@/helper/helper";
import React, { ReactNode, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import Divide from "./Divide";
import { useGeneral } from "@/hooks/useGeneral";
import Icon, { IIcon } from "./Icon";

interface Props {
  className?: string;
  children: ReactNode;
  title?: string;
  icon?: React.ElementType<IIcon> | null;
  suffix?: ReactNode;
  description?: string;
}

function Box({
  className,
  children,
  title,
  icon = null,
  description,
  suffix,
}: Props) {
  const { clickRef } = useGeneral();
  const boxRef = useRef(null);

  return (
    <Pressable
      ref={boxRef}
      onPress={() => {
        clickRef(boxRef, () => {});
      }}
      className={cn(
        "border-1 border-mineShaft-200 bg-white-50 p-10 rounded-md gap-12 w-full relative",
        className
      )}
    >
      {(title || icon || suffix) && (
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <View className="ml-2 flex-row items-center gap-2">
              {icon && <Icon icon={icon}/>}
              <View>
                <Text className={cn("text-mineShaft-950 font-BeVietnamBold")}>
                  {title}
                </Text>
                {description && (
                  <Text className="font-BeVietnamRegular text-mineShaft-400 text-12">
                    {description}
                  </Text>
                )}
              </View>
            </View>
            {suffix}
          </View>
          <Divide direction="horizontal" className="w-2/3 bg-mineShaft-600" />
        </View>
      )}
      {children}
    </Pressable>
  );
}

export default Box;
