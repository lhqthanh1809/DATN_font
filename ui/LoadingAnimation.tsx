import { MotiView } from "moti";

import { Loading } from "./icon/general";
import Icon from "./Icon";
import { Easing } from "react-native-reanimated";
import { cn } from "@/helper/helper";

const LoadingAnimation:React.FC<{
  className?: string
}> = ({className}) => {
  return (
    <MotiView
      className="items-center justify-center"
      from={{
        rotate: "0deg",
      }}
      animate={{
        rotate: "360deg",
      }}
      transition={{
        type: "timing",
        duration: 1500,
        loop: true,
        repeatReverse: false,
        easing: Easing.linear,
      }}
    >
      <Icon icon={Loading} className={cn("text-mineShaft-950", className)} />
    </MotiView>
  );
}

export default LoadingAnimation;
