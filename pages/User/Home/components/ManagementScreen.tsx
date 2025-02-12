import { apiRouter } from "@/assets/ApiRouter";
import { ResponseInterface } from "@/interfaces/ResponseInterface";
import { BaseHttpService } from "@/services/BaseHttpService";
import Button from "@/ui/button";
import Icon from "@/ui/icon";
import { Building } from "@/ui/icon/general";
import { Plus, Trash } from "@/ui/icon/symbol";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const ManagementScreen = () => {
  const route = useRouter();
  const [lodgings, setLodgings] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data: ResponseInterface = await new BaseHttpService().https({
          url: apiRouter.listLodgingByUser,
          authentication_requested: true,
        });
        setLodgings(data.body?.data || []); // ✅ Đảm bảo luôn có một mảng hợp lệ
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <View className="px-3 py-5 flex-1">
      <View className="flex-row justify-between items-center px-2 mb-4">
        <Text className="font-BeVietnamMedium text-16">Nhà trọ của tôi</Text>
        <Button
          className="w-8 h-8 p-0 bg-lime-300 border border-lime-400 rounded-lg"
          onPress={() => route.push("/lodging/create")}
        >
          <Icon icon={Plus} className="text-mineShaft-900"/>
        </Button>
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
                height={50}
              />
            ))}
        </View>
      ) : lodgings && lodgings.length > 0 ? (
        <View className="gap-3">
          {lodgings.map((item, index) => (
            <LodgingItem
              key={index}
              address={item.address || "Địa chỉ không xác định"}
              name={item.name || "Nhà trọ không có tên"}
            />
          ))}
        </View>
      ) : (
  
        <View className="flex-1 items-center justify-center">
          <Button onPress={() => route.push("/lodging/create")} className="items-center gap-3">
            <Icon icon={Plus} className="text-mineShaft-200"/>
            <Text className="font-BeVietnamMedium text-mineShaft-200 text-16">Thêm trọ mới</Text>
          </Button>
        </View>
      )}
    </View>
  );
};

const LodgingItem: React.FC<{ name: string; address: string }> = ({
  name,
  address,
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
    <View>
      <View className="h-fit relative w-full overflow-hidden rounded-md">
        <GestureDetector gesture={fling}>
          <MotiView style={animatedStyle}>
            <Button className="bg-white-50 border-1 border-lime-400 rounded-md gap-2 p-2 flex-col items-start">
              <Text className="font-BeVietnamSemiBold text-16 text-mineShaft-900">
                {name}
              </Text>
              <Text className="font-BeVietnamMedium text-10 text-mineShaft-500">
                {address}
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
