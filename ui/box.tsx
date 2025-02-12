import { cn } from "@/helper/helper";
import { ReactNode, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import Divide from "./divide";
import { useGeneral } from "@/hooks/useGeneral"; 

interface Props {
  className?: string;
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
}

function Box({ className, children, title, icon = null }: Props) {
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
      {(title || icon) && (
        <View className="gap-2">
          <View className="ml-2 flex-row items-center gap-2">
            {icon}
            <Text className={cn("text-mineShaft-950 font-BeVietnamBold")}>
              {title}
            </Text>
          </View>
          <Divide direction="horizontal" className="w-2/3 bg-mineShaft-600" />
        </View>
      )}
      {children}
    </Pressable>
  );
}

export default Box;
