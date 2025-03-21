import { convertToNumber } from "@/helper/helper";
import { Canvas, Path, SkFont, Skia, Text } from "@shopify/react-native-skia";
import React from "react";
import { View } from "react-native";
import {
  SharedValue,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

const DonutChart: React.FC<{
  radius: number;
  strokeWidth: number;
  outerStrokeWidth: number;
  font: SkFont;
  totalValue: SharedValue<string>;
  n: number;
  decimals: SharedValue<number[]>;
  colors: string[];
}> = ({
  radius,
  strokeWidth,
  outerStrokeWidth,
  font,
  totalValue,
  colors,
  decimals,
  n,
}) => {
  const array = Array.from({ length: n });

  const innerRadius = radius - outerStrokeWidth / 2;
  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const targetText = useDerivedValue(() => {
    return `${totalValue.value}`;
  }, []);

  const fontSize = font.measureText("00đ");

  const textX = useDerivedValue(() => {
    const _fontSize = font.measureText(targetText.value);
    return radius - _fontSize.width / 2;
  });

  return (
    <View className="flex-1">
      <Canvas style={{ flex: 1 }}>
        <Path
          path={path}
          color="#F4F7FC"
          style="stroke"
          strokeWidth={outerStrokeWidth}
          strokeJoin="round"
          strokeCap="round"
          start={0}
          end={1}
        />

        {array.map((_, index) => {
          return (
            <DonutPath
              key={index}
              radius={radius}
              strokeWidth={strokeWidth}
              color={colors[index]}
              decimals={decimals}
              index={index}
              outerStrokeWidth={outerStrokeWidth}
            />
          );
        })}

        <Text
          y={radius + fontSize.height / 2}
          x={textX}
          text={targetText}
          font={font}
          color="#4d7c0f"
        />
      </Canvas>
    </View>
  );
};

const DonutPath: React.FC<{
  radius: number;
  strokeWidth: number;
  color: string;
  decimals: SharedValue<number[]>;
  index: number;
  outerStrokeWidth: number;
}> = ({ radius, color, decimals, index, strokeWidth, outerStrokeWidth }) => {
  const innerRadius = radius - outerStrokeWidth / 2;
  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  const start = useDerivedValue(() => {
    if (index === 0) {
      return 0;
    }

    const decimal = decimals.value.slice(0, index);

    const sum = decimal.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    return withTiming(sum, {
      duration: 1000,
    });
  });

  const end = useDerivedValue(() => {
    if (index === decimals.value.length - 1) {
      return withTiming(1, { duration: 1000 });
    }

    const decimal = decimals.value.slice(0, index + 1);

    const sum = decimal.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    return withTiming(sum, {
      duration: 1000,
    });
  });

  return (
    <Path
      path={path}
      color={color}
      style={"stroke"}
      strokeWidth={strokeWidth}
      strokeJoin={"round"}
      start={start}
      end={end}
    />
  );
};

export default DonutChart;
