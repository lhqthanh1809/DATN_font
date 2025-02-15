import { useGeneral } from "@/hooks/useGeneral";
import { ILodging } from "@/interfaces/LodgingInterface";
import LodgingService from "@/services/Lodging/LodgingService";
import Button from "@/ui/button";
import Icon from "@/ui/icon";
import { Plus, PlusTiny, Trash } from "@/ui/icon/symbol";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const ManagementScreen = () => {
  const route = useRouter();
  const { setLodging } = useGeneral();
  const [lodgings, setLodgings] = useState<Array<ILodging>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await new LodgingService().listByUser();
      if (Array.isArray(data)) {
        setLodgings(data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handlePressLodging = useCallback((lodging: ILodging) => {
    setLodging(lodging)
    route.push('/lodging/home')
  }, []);

  return (
    <View className="px-3 py-5 flex-1">
      <View className="flex-row justify-between items-center px-2 mb-4">
        <Text className="font-BeVietnamMedium text-16">Nhà trọ của tôi</Text>
        {lodgings.length > 0 && (
          <Button
            className="p-2 px-4 bg-lime-100 rounded-lg gap-0"
            onPress={() => route.push("/lodging/create")}
          >
            <Icon icon={PlusTiny} className="text-lime-900" strokeWidth={2}  />
            <Text className="font-BeVietnamMedium text-lime-900 px-2">Trọ mới</Text>
          </Button>
        )}
      </View>

      {loading ? (
        <View className="gap-3">
          {Array(3)
            .fill("")
            .map((_, index) => (
              <Skeleton
                key={index}
                width={"100%"}
                colorMode="light"
                height={64}
              />
            ))}
        </View>
      ) : lodgings && lodgings.length > 0 ? (
        <View className="gap-3">
          {lodgings.map((item, index) => (
            <LodgingItem key={index} item={item} onPress={handlePressLodging}/>
          ))}
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Button
            onPress={() => route.push("/lodging/create")}
            className="items-center gap-3"
          >
            <Icon icon={PlusTiny} className="text-mineShaft-200" />
            <Text className="font-BeVietnamMedium text-mineShaft-200 text-16">
              Thêm trọ mới
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
};

const LodgingItem: React.FC<{
  item: ILodging;
  onPress?: (item : ILodging) => void;
}> = ({ item, onPress }) => {
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
    <View>
      <View className="h-fit relative w-full overflow-hidden rounded-md">
        <GestureDetector gesture={fling}>
          <MotiView style={animatedStyle}>
            <Button
              className="bg-lime-200 border-1 border-lime-400 rounded-md gap-2 p-3 flex-col items-start"
              onPress={() => onPress && onPress(item)}
            >
              <Text className="font-BeVietnamSemiBold text-16 text-mineShaft-900">
                {item.name}
              </Text>
              <Text className="font-BeVietnamMedium text-12 text-mineShaft-500">
                {item.address}
              </Text>
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

export default ManagementScreen;
