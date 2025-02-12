import { MotiView } from "moti";

import { Loading } from "./icon/general";
import Icon from "./icon";
import { Easing } from "react-native-reanimated";

function LoadingAnimation() {
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
      <Icon icon={Loading} className="text-" />
    </MotiView>
  );
}

export default LoadingAnimation;
