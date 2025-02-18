import { MotiView, View } from "moti";
import { ReactNode, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Button from "./button";
import Icon from "./icon";
import { Trash } from "./icon/symbol";

const ItemFling = <T,>({
  children,
  onPress,
  item,
}: {
  children: ReactNode;
  onPress: (item: T) => void;
  item: T;
}) => {
  const _MIN_TRANSLATE_X = -50;
  const _MAX_TRANSLATE_X = 0;
  const [removeDisabled, setRemoveDisabled] = useState(false);

  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const fling = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = withSpring(
        Math.min(
          Math.max(event.translationX, _MIN_TRANSLATE_X),
          _MAX_TRANSLATE_X
        ),
        { damping: 50, stiffness: 200 }
      );
    })
    .onEnd(() => {
      // Khi thả tay, tự động về _MAX_TRANSLATE_X (0)
      translateX.value = withSpring(
        translateX.value < _MIN_TRANSLATE_X / 2
          ? _MIN_TRANSLATE_X
          : _MAX_TRANSLATE_X,
        { damping: 50, stiffness: 200 }
      );
    });

  useDerivedValue(() => {
    runOnJS(setRemoveDisabled)(translateX.value < _MIN_TRANSLATE_X);
  });
  return (
    <View className="w-full">
      <View className="h-fit relative w-full overflow-hidden rounded-md">
        <GestureDetector gesture={fling}>
          <MotiView style={animatedStyle}>
            <Button
              className="bg-lime-200 border-1 border-lime-400 rounded-md gap-2 p-3 flex-col items-start"
              onPress={() => onPress && onPress(item)}
            >
              {children}
            </Button>
          </MotiView>
        </GestureDetector>
        <Button
          className="h-full absolute w-full rounded-md bg-red-600 -z-10 justify-end"
          disabled={removeDisabled}
        >
          <View className="w-[50] items-center ">
            <Icon icon={Trash} className="text-red-100" />
          </View>
        </Button>
      </View>
    </View>
  );
};

export default ItemFling;
