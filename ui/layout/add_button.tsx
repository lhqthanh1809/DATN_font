import { MotiView } from "moti";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Button from "../button";
import Icon from "../icon";
import { PlusTiny } from "../icon/symbol";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useWindowDimensions, View } from "react-native";
import { useEffect, useState } from "react";
import { clamp } from "@/helper/helper";

const BUTTON_SIZE = 46;
const SPACING_WIDTH = 14;
const SPACING_HEIGHT = 14;

const ViewHasButtonAdd: React.FC<{
  children?: React.ReactNode;
  onPressAdd: () => void;
}> = ({ children, onPressAdd }) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [parentSize, setParentSize] = useState({
    width: screenWidth,
    height: screenHeight,
  });

  const translationX = useSharedValue(
    parentSize.width - BUTTON_SIZE - SPACING_WIDTH
  );
  const translationY = useSharedValue(
    parentSize.height - BUTTON_SIZE - SPACING_HEIGHT
  );
  const prevTranslationX = useSharedValue(SPACING_WIDTH);
  const prevTranslationY = useSharedValue(SPACING_HEIGHT);

  useEffect(() => {
    translationX.value = parentSize.width - BUTTON_SIZE - SPACING_WIDTH;
    translationY.value = parentSize.height - BUTTON_SIZE - SPACING_HEIGHT;
  }, [parentSize]);

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxX = parentSize.width - BUTTON_SIZE - SPACING_WIDTH;
      const maxY = parentSize.height - BUTTON_SIZE - SPACING_HEIGHT;

      translationX.value = Math.min(
        Math.max(prevTranslationX.value + event.translationX, SPACING_WIDTH),
        maxX
      );
      translationY.value = Math.min(
        Math.max(prevTranslationY.value + event.translationY, SPACING_HEIGHT),
        maxY
      );
    })
    .onEnd(() => {
      const middle = parentSize.width / 2;
      translationX.value = withSpring(
        translationX.value < middle
          ? SPACING_WIDTH
          : parentSize.width - BUTTON_SIZE - SPACING_WIDTH
      );
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));

  return (
    <View
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setParentSize({ width, height });
      }}
      className="flex-1 bg-white-50"
    >
      {children}
      <GestureDetector gesture={pan}>
        <MotiView
          className="bg-lime-300 absolute rounded-xl"
          style={animatedStyle}
          transition={{ type: "spring" }}
        >
          <Button
            onPress={onPressAdd}
            style={{
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
            }}
            className="items-center justify-center"
          >
            <Icon icon={PlusTiny} />
          </Button>
        </MotiView>
      </GestureDetector>
    </View>
  );
};

export default ViewHasButtonAdd;
