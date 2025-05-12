import { MotiView } from "moti";

import { Loading } from "./icon/general";
import Icon from "./Icon";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/helper/helper";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { useEffect, useMemo } from "react";
import { black } from "tailwindcss/colors";
import { useAnimatedValue } from "react-native";

const LoadingAnimation: React.FC<{
  className?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}> = ({ className, size = 20, strokeWidth = 3, color = "#5d5d5d" }) => {
  const process = useSharedValue(0);
  const circleRadius = (size - strokeWidth) / 2;

  const circlePath = useMemo(() => {
    const skPath = Skia.Path.Make();
    skPath.addCircle(size / 2, size / 2, circleRadius);
    return skPath;
  }, [size, circleRadius, strokeWidth]);

  useEffect(() => {
    process.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const rSize = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${process.value * 2 * Math.PI}rad` }],
    };
  }, []);

  const startAnimated = useDerivedValue(() => {
    return interpolate(process.value, [0, 0.5, 1], [0.3, 0.6, 0.3]);
  }, []);
  return (
    <Animated.View className="items-center justify-center" style={rSize}>
      <Canvas
        style={{
          width: size,
          height: size,
        }}
      >
        <Path
          path={circlePath}
          color={color}
          style={"stroke"}
          strokeWidth={strokeWidth}
          start={startAnimated}
          end={1}
          strokeCap={"round"}
        />
        <Path
          opacity={0.2}
          path={circlePath}
          color={color}
          style={"stroke"}
          strokeWidth={strokeWidth}
          start={0}
          end={1}
          strokeCap={"round"}
        />
      </Canvas>
    </Animated.View>
  );
};

export default LoadingAnimation;
